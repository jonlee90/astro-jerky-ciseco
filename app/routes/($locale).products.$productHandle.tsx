import {useRef, Suspense, useState, useEffect} from 'react';
import {
  defer,
  type MetaArgs,
  redirect,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {useLoaderData, Await, useNavigate, useLocation} from '@remix-run/react';
import {
  type VariantOption,
  Image,
  VariantSelector,
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
} from '@shopify/hydrogen';
import invariant from 'tiny-invariant';
import clsx from 'clsx';
import type {
  ProductQuery,
  ProductVariantFragmentFragment,
} from 'storefrontapi.generated';
import {ProductGallery} from '~/components/ProductGallery';
import {Skeleton} from '~/components/Skeleton';
import {Link} from '~/components/Link';
import {AddToCartButton} from '~/components/AddToCartButton';
import {seoPayload} from '~/lib/seo.server';
import type {Storefront} from '~/lib/type';
import {routeHeaders} from '~/data/cache';
import {MEDIA_FRAGMENT} from '~/data/fragments';
import Prices from '~/components/Prices';
import {NoSymbolIcon} from '@heroicons/react/24/outline';
import {getProductStatus, ProductBadge} from '~/components/ProductCard';
import {useGetPublicStoreCdnStaticUrlFromRootLoaderData} from '~/hooks/useGetPublicStoreCdnStaticUrlFromRootLoaderData';
import ButtonSecondary from '~/components/Button/ButtonSecondary';
import {COMMON_PRODUCT_CARD_FRAGMENT} from '~/data/commonFragments';
import {SnapSliderProducts} from '~/components/SnapSliderProducts';
import {type SelectedOption} from '@shopify/hydrogen/storefront-api-types';
import {RouteContent} from '~/sections/RouteContent';
import {getSeoMeta} from '@shopify/hydrogen';
import {getLoaderRouteFromMetaobject} from '~/utils/getLoaderRouteFromMetaobject';
import { motion } from 'framer-motion';
import { useMediaQuery } from 'react-responsive'
import { IconFacebook } from '~/components/Icon';
import { IconX } from '~/components/Icon';
import { IconPinterest } from '~/components/Icon';
import { convertToNumber } from '~/lib/utils';
import { useAside } from '~/components/Aside';
import { SlashIcon } from '@heroicons/react/24/solid';
import Nav from '~/components/Nav';
import NavItem from '~/components/NavItem';
import useWindowScroll from '~/components/Header/useWindowScroll';
import Logo from '~/components/Logo';

export const headers = routeHeaders;

export async function loader(args: LoaderFunctionArgs) {
  const {params} = args;
  const {productHandle} = params;
  invariant(productHandle, 'Missing productHandle param, check route filename');

  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return defer({...deferredData, ...criticalData});
}

async function loadCriticalData(args: LoaderFunctionArgs) {
  const {params, request, context} = args;
  const {productHandle} = params;
  invariant(productHandle, 'Missing productHandle param, check route filename');

  const selectedOptions = getSelectedProductOptions(request).filter(
    (option) =>
      // Filter out Shopify predictive search query params
      !option.name.startsWith('_sid') &&
      !option.name.startsWith('_pos') &&
      !option.name.startsWith('_psq') &&
      !option.name.startsWith('_ss') &&
      !option.name.startsWith('_v') &&
      // Filter out third party tracking params
      !option.name.startsWith('fbclid'),
  );

  if (!productHandle) {
    throw new Error('Expected product handle to be defined');
  }

  const [{shop, product}] = await Promise.all([
    context.storefront.query(PRODUCT_QUERY, {
      variables: {
        handle: productHandle,
        selectedOptions,
        country: context.storefront.i18n.country,
        language: context.storefront.i18n.language,
      },
    }),
  ]);

  if (!product?.id) {
    throw new Response('product', {status: 404});
  }

  const firstVariant = product.variants.nodes[0];
  const firstVariantIsDefault = Boolean(
    firstVariant.selectedOptions.find(
      (option: SelectedOption) =>
        option.name === 'Title' && option.value === 'Default Title',
    ),
  );

  if (firstVariantIsDefault) {
    product.selectedVariant = firstVariant;
  } else {
    // if no selected variant was returned from the selected options,
    // we redirect to the first variant's url with it's selected options applied
    if (!product.selectedVariant) {
      throw redirectToFirstVariant({product, request});
    }
  }

  const recommended = getRecommendedProducts(context.storefront, product.id);

  // TODO: firstVariant is never used because we will always have a selectedVariant due to redirect
  // Investigate if we can avoid the redirect for product pages with no search params for first variant
  const selectedVariant = product.selectedVariant ?? firstVariant;
  const seo = seoPayload.product({
    product,
    selectedVariant,
    url: request.url,
  });

  return {
    shop,
    product,
    recommended,
    storeDomain: shop.primaryDomain.url,
    seo,
  };
}

function loadDeferredData(args: LoaderFunctionArgs) {
  const {params, request, context} = args;
  const {productHandle} = params;
  invariant(productHandle, 'Missing productHandle param, check route filename');

  // In order to show which variants are available in the UI, we need to query
  // all of them. But there might be a *lot*, so instead separate the variants
  // into it's own separate query that is deferred. So there's a brief moment
  // where variant options might show as available when they're not, but after
  // this deferred query resolves, the UI will update.
  const variants = context.storefront.query(VARIANTS_QUERY, {
    variables: {
      handle: productHandle,
      country: context.storefront.i18n.country,
      language: context.storefront.i18n.language,
    },
  });

  // 3. Query the route metaobject
  const routePromise = getLoaderRouteFromMetaobject({
    params,
    context,
    request,
    handle: 'route-product',
  });

  return {
    variants,
    routePromise,
  };
}

export function redirectToFirstVariant({
  product,
  request,
}: {
  product: ProductQuery['product'];
  request: Request;
}) {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);

  const firstVariant = product!.variants.nodes[0];
  for (const option of firstVariant.selectedOptions) {
    searchParams.set(option.name, option.value);
  }

  url.search = searchParams.toString();

  return redirect(url.href.replace(url.origin, ''), 302);
}

export const meta = ({matches}: MetaArgs<typeof loader>) => {
  return getSeoMeta(...matches.map((match) => (match.data as any).seo));
};

export default function Product() {
  const {product, shop, recommended, variants, routePromise} =
    useLoaderData<typeof loader>();
  const {media, outstanding_features, descriptionHtml, id} =
    product;


  const [currentQuantity, setCurrentQuantity] = useState(3);
  const selectedVariant = useOptimisticVariant(product.selectedVariant, variants);

  let variantPrice = parseFloat(selectedVariant.price.amount);
  let discountAmount = 0;
  let setPrice = 20;
  const setQuantity = 3;
  const sets = Math.floor(currentQuantity / setQuantity);
  const remainingItems = currentQuantity % setQuantity;
  //variantPrice *= currentQuantity;
  // Buy 3 for $33 discount logic
  if(selectedVariant.title == '3oz') {
    setPrice = 33;
  }
  discountAmount = (sets * setQuantity * variantPrice - sets * setPrice);
  variantPrice = (sets * setPrice) + (remainingItems * variantPrice);

  const selectedVariantPrice = {
    amount: variantPrice.toString(),
    currencyCode: "USD"
  };
  const selectedVariantCompareAtPrice = {
    amount: selectedVariant?.compareAtPrice?.amount ? convertToNumber(selectedVariant.compareAtPrice.amount, currentQuantity) : 0,
    currencyCode: "USD"
  };

  
  const isOnSale =
    selectedVariantPrice?.amount &&
    selectedVariantCompareAtPrice?.amount &&
    selectedVariantPrice?.amount < selectedVariantCompareAtPrice?.amount;



  return (
    <div
      className={clsx(
        'product-page mt-5 mb-20 lg:mt-10 pb-20 lg:pb-28 space-y-20',
      )}
    >
      
      <Logo className='w-16 left-1/2  transform -translate-x-1/2 z-50 top-10 absolute' />
      <BottomAddToCartButton
        selectedVariant={selectedVariant}
        currentQuantity={currentQuantity}
        selectedVariantCompareAtPrice={selectedVariantCompareAtPrice}
        selectedVariantPrice={selectedVariantPrice}
        setCurrentQuantity={setCurrentQuantity}
      />
      <main className="2xl:max-w-screen-xl container">
        <div className="lg:flex">
          {/* Galleries */}
          <div className="w-full lg:w-[55%] relative">
            <ProductGallery
              media={media.nodes}
              className="w-full lg:col-span-2 lg:gap-7"
            />
            {/* LIKE BUTTON WISHLIST
            <LikeButton
              id={id}
              className="absolute top-3 end-3 z-10 !w-10 !h-10"
            />
            */}
          </div>

          {/* Product Details */}
          <div className="w-full lg:w-[45%] pt-10 lg:pt-0 lg:pl-7 xl:pl-9 2xl:pl-10">
            <div className="sticky top-10 grid gap-7 2xl:gap-8">
                    <Suspense fallback={<ProductForm />}>
                      <Await
                        errorElement="There was a problem loading related products"
                        resolve={variants}
                      >
                        {(resp) => (
                          <ProductForm
                          />
                        )}
                      </Await>
                    </Suspense>
              {/*  */}
              <hr className=" border-slate-200 dark:border-slate-700 mt-3"></hr>
              {/*  */}

              {!!outstanding_features?.value && (
                <div>
                  <h2 className="text-sm font-medium text-gray-900">
                    Outstanding Features
                  </h2>
                  <div>
                    <div
                      className="prose prose-sm mt-4 text-gray-600"
                      dangerouslySetInnerHTML={{
                        __html: `<ul role="list"> 
                    ${(
                      JSON.parse(
                        outstanding_features?.value || '[]',
                      ) as string[]
                    )
                      .map((item: string) => `<li>${item}</li>`)
                      .join('')} 
                    </ul>`,
                      }}
                    ></div>
                  </div>
                </div>
              )}

          {/* Product description */}
              {!!descriptionHtml && (
                <div className="grid gap-7 2xl:gap-8">
                  <h2 className="text-2xl font-semibold">Product Details</h2>
                  <div
                    className="prose prose-sm sm:prose dark:prose-invert sm:max-w-4xl"
                    dangerouslySetInnerHTML={{
                      __html: descriptionHtml || '',
                    }}
                  />
                </div>
              )}
              <SocialSharing selectedVariant={selectedVariant} />

            </div>
          </div>
        </div>

        <hr className="border-slate-200 dark:border-slate-700 my-8" />
        {/* DETAIL AND REVIEW */}
        <div className="space-y-12 sm:space-y-16">


          


          {/* OTHER SECTION */}
          <Suspense fallback={<Skeleton className="h-32" />}>
            <Await
              errorElement="There was a problem loading related products"
              resolve={recommended}
            >
              {(products) => (
                <>
                  <SnapSliderProducts
                    heading_bold={'YOU MIGHT ALSO LIKE'}
                    products={products.nodes}
                    className=""
                    headingFontClass="text-2xl font-semibold"
                  />
                </>
              )}
            </Await>
          </Suspense>
        </div>
        
        {/* ---------- 6 ---------- 
        <div>
          <Policy
            shippingPolicy={shippingPolicy}
            refundPolicy={refundPolicy}
            subscriptionPolicy={subscriptionPolicy}
          />
        </div>
         */}
      </main>

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
                className="space-y-12 sm:space-y-16"
              />
            </>
          )}
        </Await>
      </Suspense>

      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              vendor: product.vendor,
              variantId: product.selectedVariant?.id || '',
              variantTitle: product.selectedVariant?.title || '',
              quantity: currentQuantity,
              price: variantPrice.toFixed(2),
              discount: discountAmount > 0 ? discountAmount.toFixed(2) : null,
            },
          ],
        }}
      />
    </div>
  );
}

export function ProductForm() {

  const {product} = useLoaderData<typeof loader>();

  /**
   * Likewise, we're defaulting to the first variant for purposes
   * of add to cart if there is none returned from the loader.
   * A developer can opt out of this, too.
   */
  const selectedVariant = product.selectedVariant!;
  const isOutOfStock = !selectedVariant?.availableForSale;

  const status = getProductStatus({
    availableForSale: selectedVariant.availableForSale,
    compareAtPriceRangeMinVariantPrice:
      selectedVariant.compareAtPrice || undefined,
    priceRangeMinVariantPrice: selectedVariant.price,
    size: selectedVariant.title
  });

  const variantsByQuantity = [];
  for(let i = 1; i < 4; i++) {
    const quantity = i > 1 ? 3 * (i - 1) : i;
    variantsByQuantity.push({
      quantity: quantity,
      title: 'Buy ' + quantity + ' Bag' + (i > 1 ? 's' : '')
    });
  }
  const collection = product.collections.nodes[0];
  return (
    <>
      {/* ---------- HEADING ----------  */}
      <div className='mt-5 lg:mt-20 grid gap-7 2xl:gap-8'>
      {!!collection && (
          <nav className="mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li>
                <div className="flex items-center text-sm">
                  <Link
                    to={'/'}
                    className="font-medium text-gray-500 hover:text-gray-900"
                  >
                    Home
                  </Link>
                  <SlashIcon className="ml-2 h-5 w-5 flex-shrink-0 text-gray-300 " />
                </div>
              </li>
              <li>
                <div className="flex items-center text-sm">
                  <Link
                    to={'/collections/' + collection.handle}
                    className="font-medium text-gray-500 hover:text-gray-900"
                  >
                    {/* romove html on title */}
                    {collection.title.replace(/(<([^>]+)>)/gi, '')}
                  </Link>
                </div>
              </li>
            </ol>
          </nav>
        )}
        <h1
          className="text-4xl sm:text-5xl font-bold"
          title={product.title}
        >
            {product.title + ' (' + selectedVariant.title + ')'}
        </h1>

      {/* ---------- PRODUCT PRICE ----------  
        <div className="flex flex-wrap gap-4 lg:gap-5 justify-center lg:justify-start">
          <Prices
            contentClass="!text-2xl "
            price={selectedVariantPrice}
            compareAtPrice={selectedVariantCompareAtPrice}
          />
        </div>
      */}

      </div>
      {/*

      <div className="grid grid-cols-3 items-center gap-1 mb-4 xs:gap-3">
        {
          variantsByQuantity.map(({quantity, title}) => (
            <motion.button
              key={quantity}
              className={clsx(
                'variant-button flex-auto text-[16px] xs:text-[18px]',
                quantity === currentQuantity ? 'variant-button-pressed': '',
                isDesktop ? "variant-button-hover" : '',
            //    isAvailable ? 'opacity-100' : 'opacity-50',
              )}
              onClick={() => setCurrentQuantity(quantity)}
            >
              {title}
            </motion.button>
          ))
        }
      </div>

      */}
      

      {/* ---------- VARIANTS AND COLORS LIST ----------  
      <VariantSelector
        handle={product.handle}
        options={product.options}
        variants={variants}
      >
        {({option}) => {
          if (option.name === 'Color') {
            return <ProductColorOption option={option} />;
          } else {
            return <ProductOtherOption option={option} />;
          }
        }}
      </VariantSelector>
      */}

      {/* ---------- ADD TO CART BUTTOn ----------  
      {selectedVariant && (
        <div className="grid items-stretch gap-4">
          {isOutOfStock ? (
            <ButtonSecondary disabled>
              <NoSymbolIcon className="w-5 h-5" />
              <span className="ms-2">Sold out</span>
            </ButtonSecondary>
          ) : (
            <div className="grid items-stretch gap-4">
                <AddToCartButton
                  lines={
                    selectedVariant
                      ? [
                          {
                            merchandiseId: selectedVariant.id,
                            quantity: currentQuantity,
                            selectedVariant,
                          },
                        ]
                      : []
                  }
                  className="w-full flex-1 add-to-cart-button"
                  data-test="add-to-cart"
                  onClick={() => open('cart')}
                >
                  <span
                    className="flex items-center justify-center gap-2 uppercase font-bold"
                  >
                    <BagIcon className="hidden sm:inline-block w-5 h-5 mb-0.5" />
                    <span>Add to Cart</span>
                  </span>
                </AddToCartButton>
            </div>
          )}
        </div>
      )}

      */}

    </>
  );
}

const BottomAddToCartButton = ({ selectedVariant, currentQuantity, selectedVariantPrice, selectedVariantCompareAtPrice, setCurrentQuantity }) => {
  const variantsByQuantity = [];
  const isOutOfStock = !selectedVariant?.availableForSale;
  
  const {open} = useAside();
  const [opacity, setOpacity] = useState<number>(1);
  const prevScrollY = useRef<number>(0);
  const { y } = useWindowScroll();
  useEffect(() => {
    if (y > prevScrollY.current && y > 150) {
      setOpacity(0.3);
    } else {
      setOpacity(1);
    }
    prevScrollY.current = y;
  }, [y]);

  for (let i = 1; i < 4; i++) {
    const quantity = i > 1 ? 3 * (i - 1) : i;
    variantsByQuantity.push({
      quantity: quantity,
      title: quantity + ' BAG' + (i > 1 ? 'S' : ''),
      icon_svg: ''
    });
  }

  if (!selectedVariant) {
    return null;
  }

  return (
    <div 
      className='fixed bottom-0 w-full z-50 grid lg:grid-cols-2 '
    >
      {isOutOfStock ? (
        <ButtonSecondary disabled>
          <NoSymbolIcon className="w-5 h-5" />
          <span className="ms-2">Sold out</span>
        </ButtonSecondary>
      ) : (
        <>
          <Nav
            className="bg-white w-full justify-end"
            containerClassName="relative flex justify-center w-full text-sm md:text-base border-black border-y"
            opacity={opacity}
          >
            {variantsByQuantity.map((item, index) => (
              <div className='basis-1/3 lg:border-r border-black' key={index}>
                <NavItem
                  isActive={item.quantity === currentQuantity}
                  onClick={() => setCurrentQuantity(item.quantity)}
                  className={`w-full h-11 lg:h-16 ${item.quantity !== currentQuantity ?  'hover:bg-slate-200' : '' }`}
                  radius='rounded-none'
                >
                  <div className="flex items-center justify-center space-x-1.5 sm:space-x-2.5 text-sm">
                    {item.icon_svg && (
                      <span
                        className="inline-block *:w-full *:h-full w-4 h-4 sm:w-5 sm:h-5"
                        dangerouslySetInnerHTML={{ __html: item.icon_svg }}
                      ></span>
                    )}
                    <span>{item.title}</span>
                  </div>
                </NavItem>
              </div>
            ))}
          </Nav>
          <div className='w-full bg-logo-green p-5 hover:bg-primary-400  border-color-logo border-y'>
            <AddToCartButton
              lines={[
                {
                  merchandiseId: selectedVariant.id,
                  quantity: currentQuantity,
                },
              ]}
              className="w-full flex-1"
              data-test="add-to-cart"
              onClick={() => open('cart')}
            >
              <span className="flex items-center justify-center gap-2 uppercase font-bold">
                <span>Add to Cart - </span>
                <Prices
                  contentClass="inline"
                  price={selectedVariantPrice}
                  compareAtPrice={selectedVariantCompareAtPrice}
                  compareAtPriceClass={'text-slate-600'}
                />
              </span>
            </AddToCartButton>
          </div>
        </>
      )}
    </div>
  );
};

const ProductOtherOption = ({option}: {option: VariantOption}) => {
  if (!option.values.length) {
    return null;
  }

  return (
    <div>
      <div className="font-medium text-sm">{option.name}</div>
      <div className="flex flex-wrap gap-3 mt-3">
        {option.values.map(({isActive, isAvailable, value, to}, index) => {
          return (
            <Link
              key={option.name + value}
              to={to}
              preventScrollReset
              prefetch="intent"
              replace
              className={clsx(
                'relative flex items-center justify-center rounded-md border py-3 px-5 sm:px-3 text-sm font-medium uppercase sm:flex-1 cursor-pointer focus:outline-none border-gray-200 ',
                !isAvailable
                  ? isActive
                    ? 'opacity-90 text-opacity-80 cursor-not-allowed'
                    : 'text-opacity-20 cursor-not-allowed'
                  : 'cursor-pointer',
                isActive
                  ? 'bg-slate-900 border-slate-900 text-slate-100'
                  : 'border-slate-300 text-slate-900 hover:bg-neutral-50 ',
              )}
            >
              {!isAvailable && (
                <span
                  className={clsx(
                    'absolute inset-[1px]',
                    isActive ? 'text-slate-100/60' : 'text-slate-300/60',
                  )}
                >
                  <svg
                    className="absolute inset-0 h-full w-full stroke-1"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    stroke="currentColor"
                  >
                    <line
                      x1="0"
                      y1="100"
                      x2="100"
                      y2="0"
                      vectorEffect="non-scaling-stroke"
                    ></line>
                  </svg>
                </span>
              )}
              {/* {!isAvailable && (
                <div
                  className={clsx(
                    'absolute -inset-x-0.5 border-t top-1/2 z-10 rotate-[28deg]',
                    isActive ? 'border-slate-400' : '',
                  )}
                />
              )} */}
              {value}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

const ProductColorOption = ({option}: {option: VariantOption}) => {
  const {getImageWithCdnUrlByName} =
    useGetPublicStoreCdnStaticUrlFromRootLoaderData();

  if (!option.values.length) {
    return null;
  }

  return (
    <div>
      <div className="text-sm font-medium">{option.name}</div>
      <div className="flex flex-wrap gap-3 mt-3">
        {option.values.map(({value, to, isActive, isAvailable}) => (
          <Link
            key={option.name + value}
            to={to}
            preventScrollReset
            prefetch="intent"
            replace
            className={clsx(
              'relative w-8 h-8 md:w-9 md:h-9 rounded-full',
              isActive ? 'ring ring-offset-1 ring-primary-500/60' : '',
              !isAvailable && 'opacity-50 cursor-not-allowed',
            )}
            title={value}
          >
            <span className="sr-only">{value}</span>

            <div className="absolute inset-0.5 rounded-full overflow-hidden z-0">
              <Image
                data={{
                  url: getImageWithCdnUrlByName(value.replaceAll(/ /g, '_')),
                  altText: value,
                  width: 36,
                  height: 36,
                }}
                width={36}
                height={36}
                sizes="(max-width: 640px) 36px, 40px"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>

            {!isAvailable && (
              <div className="absolute inset-x-1 border-t border-dashed top-1/2 rotate-[-30deg]" />
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};


const SocialSharing = ({selectedVariant}: {selectedVariant: any}) => {
  const location = useLocation();
  const currentUrl = `${location.pathname}${location.search}${location.hash}`;

  const linkStyle = 'flex items-center justify-center gap-1';
  const productTitle = selectedVariant.product.title.replaceAll('&', ' and ') + ' (' + selectedVariant.title + ')';
  const productLink = 'https://www.astrofreshjerky.com' + currentUrl;
  const twitterText = productTitle + '&url=' + productLink;
  const pinText = productLink + '&media=' + selectedVariant.image.url;
  return (
    <div className="grid grid-cols-3">
      <Link 
        className={linkStyle}
        target="_blank"
        to={`https://www.facebook.com/sharer.php?u=${productLink}`}
        >
        <IconFacebook />
        <span>Share</span>
      </Link>
      <Link className={linkStyle}
        target="_blank"
        to={`https://x.com/intent/post?text=${twitterText}`}
      >
        <IconX />
        <span>Tweet</span>
      </Link>
      <Link className={linkStyle}
        target="_blank"
        to={`https://pinterest.com/pin/create/button/?url=${pinText}`}
      >
        <IconPinterest />
        <span>Pin it</span>
      </Link>
    </div>
  )
}
export const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariantFragment on ProductVariant {
    id
    availableForSale
    selectedOptions {
      name
      value
    }
    image {
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    compareAtPrice {
      amount
      currencyCode
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
  }
`;

export const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      id
      title
      vendor
      handle
      descriptionHtml
      description
      publishedAt
      collections(first: 1) {
        nodes {
          id
          title
          handle
        }
      }
      outstanding_features: metafield(namespace: "ciseco--product", key:"outstanding_features") {
        id
        value
        namespace
        key
      }
      options {
        name
        values
      }
      selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
        ...ProductVariantFragment
      }
      media(first: 7) {
        nodes {
          ...Media
        }
      }
      variants(first: 1) {
        nodes {
          ...ProductVariantFragment
        }
      }
      seo {
        description
        title
      }
    }
    shop {
      name
      primaryDomain {
        url
      }
      shippingPolicy {
        handle
      }
      refundPolicy {
        handle
      }
      subscriptionPolicy {
        handle
      }
    }
  }
  ${MEDIA_FRAGMENT}
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

export const VARIANTS_QUERY = `#graphql
  query variants(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      variants(first: 250) {
        nodes {
          ...ProductVariantFragment
        }
      }
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  query productRecommendations(
    $productId: ID!
    $count: Int
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    recommended: productRecommendations(productId: $productId) {
      ...CommonProductCard
    }
    additional: products(first: $count, sortKey: BEST_SELLING) {
      nodes {
        ...CommonProductCard
      }
    }
  }
  ${COMMON_PRODUCT_CARD_FRAGMENT}
` as const;

async function getRecommendedProducts(
  storefront: Storefront,
  productId: string,
) {
  const products = await storefront.query(RECOMMENDED_PRODUCTS_QUERY, {
    variables: {productId, count: 12},
  });

  invariant(products, 'No data returned from Shopify API');

  const mergedProducts = (products.recommended ?? [])
    .concat(products.additional.nodes)
    .filter(
      (value, index, array) =>
        array.findIndex((value2) => value2.id === value.id) === index,
    );

  const originalProduct = mergedProducts.findIndex(
    (item) => item.id === productId,
  );

  mergedProducts.splice(originalProduct, 1);

  return {nodes: mergedProducts};
}
