import {
  defer,
  type LoaderFunctionArgs,
  type MetaArgs,
} from '@shopify/remix-oxygen';
import {Await, useLoaderData} from '@remix-run/react';
import type {Filter} from '@shopify/hydrogen/storefront-api-types';
import {
  Pagination,
  Analytics,
  getSeoMeta,
  flattenConnection,
} from '@shopify/hydrogen';
import invariant from 'tiny-invariant';
import {routeHeaders} from '~/data/cache';
import {seoPayload} from '~/lib/seo.server';
import {COMMON_PRODUCT_CARD_FRAGMENT} from '~/data/commonFragments';
import {RouteContent} from '~/sections/RouteContent';
import PageHeader from '~/components/PageHeader';
import {Empty} from '~/components/Empty';
import {FireIcon} from '@heroicons/react/24/outline';
import {getPaginationAndFiltersFromRequest} from '~/utils/getPaginationAndFiltersFromRequest';
import {getLoaderRouteFromMetaobject} from '~/utils/getLoaderRouteFromMetaobject';
import {ProductsGrid} from '~/components/ProductsGrid';
import clsx from 'clsx';
import { Suspense, useEffect, useRef, useState } from 'react';
import ProductFilterHiddenScrollBar from '~/components/ProductFilterHiddenScrollBar';
import { SwitchTab } from '~/components/Tabs';
import { IconBbq, IconChicken, IconPepper, IconSpicy } from '~/components/Icon';

export const headers = routeHeaders;

export async function loader({params, request, context}: LoaderFunctionArgs) {
  const {collectionHandle} = params;
  const locale = context.storefront.i18n;

  invariant(collectionHandle, 'Missing collectionHandle param');

  // Query the route metaobject
  const routePromise = getLoaderRouteFromMetaobject({
    params,
    context,
    request,
    handle: 'route-collection',
  });

  const {paginationVariables, filters, sortKey, reverse} =
    getPaginationAndFiltersFromRequest(request);

  // 2. Query the colelction details
  const [{collection}] = await Promise.all([
    context.storefront.query(COLLECTION_QUERY, {
      variables: {
        ...paginationVariables,
        handle: collectionHandle,
        filters,
        sortKey,
        reverse,
        country: context.storefront.i18n.country,
        language: context.storefront.i18n.language,
      },
    }),
  ]);

  if (!collection) {
    throw new Response('collection', {status: 404});
  }

  const seo = seoPayload.collection({collection, url: request.url});

  const defaultPriceFilter = collection.productsWithDefaultFilter.filters.find(
    (filter) => filter.id === 'filter.v.price',
  );

  return defer({
    routePromise,
    collection,
    defaultPriceFilter: {
      value: defaultPriceFilter?.values[0] ?? null,
      locale,
    },
    seo,
  });
}

export const meta = ({matches}: MetaArgs<typeof loader>) => {
  return getSeoMeta(...matches.map((match) => (match.data as any).seo));
};

const categoryData = [
  {
    label: "All Flavors",
    value: "all",
  },
  {
    label: "Spicy",
    value: "hot-spicy",
    icon: IconSpicy,
  },
  {
    label: "BBQ",
    value: "bbq",
    icon: IconBbq,
  },
  {
    label: "Chicken",
    value: "chicken-jerky",
    icon: IconChicken,
  },
  {
    label: "Pepppered",
    value: "peppered",
    icon: IconPepper,
  }
];

export default function Collection() {
  const {collection, routePromise} =
    useLoaderData<typeof loader>();

  const noResults = !collection.products.nodes.length;
  const [isSmall, setIsSmall] = useState(false);
  const [currentProducts, setCurrentProducts] = useState(() => flattenConnection(collection.products));
  const products = flattenConnection(collection.products);

  const [isSticky, setIsSticky] = useState(false); // State to manage sticky behavior

  const filterRef = useRef<HTMLDivElement>(null); // Ref for the filter component


  const onTabChange = (value: string) => {
    const filtedProducts = value == 'all' ? products : products.filter((e) => e.tags.includes(value));
    setCurrentProducts(filtedProducts);
  }
  const onToggle = (value: string) => {
    setIsSmall(value == 'small' ? true : false);
  }
  
  const totalProducts = noResults
    ? 0
    : currentProducts.length;

  // Function to handle scroll event and check when the filter should stick
const handleScroll = () => {
  const filterElement = filterRef.current;
  if (filterElement) {
    const filterPosition = filterElement.getBoundingClientRect().top;
    const shouldStick = filterPosition <= 10;
    // Only update isSticky when there's an actual change
    if (shouldStick !== isSticky) {
      setIsSticky(shouldStick);
    }
  }
};
  // Update currentProducts whenever collection.products changes
  useEffect(() => {
    setCurrentProducts(flattenConnection(collection.products));
  }, [collection.products]);

  // Add scroll event listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    // Cleanup on unmount
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isSticky]);

  const filterCategory = categoryData.filter((item) =>
    item.value === 'all' ? true : products.some((product) => product.tags.includes(item.value)) 
  );

  return (
    <div
      className={clsx(
        `nc-PageCollection pt-8 lg:pt-14 pb-20 lg:pb-28 xl:pb-32`,
        'space-y-20 sm:space-y-24 lg:space-y-28',
      )}
    >
      <div className="md:container">
        <div className="space-y-14 lg:space-y-24">
          {/* HEADING */}
          <div className='container'>
            <div className="grid grid-cols-6 items-center text-sm font-medium gap-2 text-neutral-500 mb-2">
              <div className='col-span-2 flex'>
                <FireIcon className="w-5 h-5" />
                <span className="text-neutral-700 ml-1">
                  {totalProducts} Jerkies
                </span>
              </div>
              <div className="flex col-span-4 ml-auto">
                <SwitchTab isSmall={isSmall} onToggle={(val: string) => onToggle(val)}  className='justify-self-end'/>
              </div>
            </div>
            <PageHeader
              // remove the html tags on title
              title={collection.title.replace(/(<([^>]+)>)/gi, '')}
              description={collection.description}
              hasBreadcrumb={false}
              breadcrumbText={collection.title}
            />
          </div>

          <main className='!mt-8 !lg:mt-14'>
            {/* TABS FILTER 
            <FilterMenu
              onTabChange={onTabChange}
              onToggle={onToggle}
              isSmall={isSmall}
            />
            */}

            <div ref={filterRef} className={clsx(isSticky ? 'sticky-filter md:relative' : '')}>
              <ProductFilterHiddenScrollBar 
                onTabChange={onTabChange}
                categoryData={categoryData}
                collectionHandle={collection.handle}
              />
            </div>

            {/* LOOP ITEMS */}
            <>
              {!noResults ? (
                <ProductsGrid nodes={currentProducts} isSmall={isSmall} collection={collection} />
              ) : (
                <Empty />
              )}
            </>
          </main>
        </div>
      </div>

      {/* 3. Render the route's content sections */}
      <Suspense fallback={<div className="h-32" />}>
        <Await
          errorElement="There was a problem loading route's content sections"
          resolve={routePromise}
        >
          {({route}) => (
            <>
              <RouteContent
                route={route}
                className="space-y-20 sm:space-y-24 lg:space-y-28"
              />
            </>
          )}
        </Await>
      </Suspense>

      <Analytics.CollectionView
        data={{
          collection: {
            id: collection.id,
            handle: collection.handle,
          },
        }}
      />
    </div>
  );
}

const COLLECTION_QUERY = `#graphql
  query CollectionDetails(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $filters: [ProductFilter!]
    $sortKey: ProductCollectionSortKeys!
    $reverse: Boolean
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      seo {
        description
        title
      }
      image {
        id
        url
        width
        height
        altText
      }
      productsWithDefaultFilter:products(
        first: 0,
        filters: {},
      ) {
        filters {
          id
          label
          type
          values {
            id
            label
            count
            input
          }
        }
      }
      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor,
        filters: $filters,
        sortKey: $sortKey,
        reverse: $reverse
      ) {
        filters {
          id
          label
          type
          values {
            id
            label
            count
            input
          }
        }
        nodes {
          ...CommonProductCard
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
   # All common fragments
   ${COMMON_PRODUCT_CARD_FRAGMENT}
` as const;
