import React from 'react';
import { Link } from '~/components/Link';
import { flattenConnection, Money, useMoney } from '@shopify/hydrogen';
import clsx from 'clsx';
import { Card, CardHeader, CardBody } from "@material-tailwind/react";
import { motion } from 'framer-motion';
import PageHeader from '~/components/PageHeader';
import { MoneyV2 } from '@shopify/hydrogen/storefront-api-types';
import { json, useLoaderData } from '@remix-run/react';
import { ProductMixFragment } from 'storefrontapi.generated';
import { PRODUCT_MIX_FRAGMENT } from '~/data/fragments';

// Type Definitions
interface ProductVariant {
  id: string;
  availableForSale: boolean;
  image: any;
  handle: string;
  quantity: number;
  title: string;
  tags: string[];
  description: string;
  media: any[];
  size: string;
  flavor_level: string;
  price: string;
  compareAtPrice: string;
}

interface LoaderData {
  bundleProducts: ProductMixFragment[];
}

export async function loader({ context: { storefront } }: { context: any }) {
  const { products } = await storefront.query(API_ALL_PRODUCTS_QUERY, {
    variables: {
      count: 12,
      query: 'tag:bundle',
      sortKey: "PRICE",
      country: storefront.i18n.country,
      language: storefront.i18n.language,
    },
    cache: storefront.CacheLong(),
  });

  const flattenedProducts = flattenConnection(products);

  

  return json({
    bundleProducts: flattenedProducts
  });
}

export default function AllBundle() {
  const { bundleProducts } = useLoaderData<LoaderData>();
  return (
    <div
      className={clsx(
        `nc-PageCollection pt-10 lg:pt-20 pb-20 lg:pb-28 xl:pb-32`,
        'space-y-20 sm:space-y-24 lg:space-y-28',
      )}
    >
      <div className="container">
       <div className="space-y-14 lg:space-y-24">
        <PageHeader
          // remove the html tags on title
          title={'BUNDLE PACK'}
          description={'MIX & MATCH BETWEEN 12 DIFFERENT FLAVORS TO CREATE A CUSTOM ORDER.'}
          hasBreadcrumb={false}
        />
        <div  data-test="product-grid" className="sm-only:p-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid gap-6 border-black">
          {bundleProducts.map(({id, title, handle, description, priceRange, compareAtPriceRange}) => (
            <Link 
              key={id} 
              to={`/bundle/${handle}`} 
              prefetch="intent" 
              state={{ pack: handle }}
            >
              <motion.div 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                className='border-2 rounded-full'
              >
                <Card className="grid grid-cols-1 text-black">
                  <CardHeader floated={false} 
                    shadow={false}
                    color="transparent"
                    className="m-0">
                    <div className="cow-card h-36"></div>
                  </CardHeader>
                  <CardBody className="grid grid-cols-1 gap-2 p-4">
                    <span className="">
                      {title}
                    </span>
                    <span className="opacity-70">
                      {description}
                    </span>
                    <span className="flex gap-4 text-lead">
                      <Money withoutTrailingZeros data={{ amount: priceRange.minVariantPrice.amount, currencyCode: 'USD' }} className="text-red-600" />
                      <CompareAtPrice
                        className="opacity-50"
                        data={{ amount: compareAtPriceRange.minVariantPrice.amount, currencyCode: 'USD' }}
                      />
                    </span>
                  </CardBody>
                </Card>
              </motion.div>
            </Link>
          ))}
        </div>
        </div>
      </div>
    </div>
  );
}

interface CompareAtPriceProps {
  data: MoneyV2;
  className?: string;
}

function CompareAtPrice({ data, className }: CompareAtPriceProps) {
  const { currencyNarrowSymbol, withoutTrailingZerosAndCurrency } = useMoney(data);

  const styles = clsx('strike', className);

  return (
    <span className={styles}>
      {currencyNarrowSymbol}
      {withoutTrailingZerosAndCurrency}
    </span>
  );
}
const API_ALL_PRODUCTS_QUERY = `#graphql
  query MixAllProducts(
    $count: Int
    $country: CountryCode
    $language: LanguageCode
    $sortKey: ProductSortKeys
    $query: String
  ) @inContext(country: $country, language: $language) {
    products(first: $count, sortKey: $sortKey, query: $query) {
      nodes {
        ...ProductMix
      }
    }
  }
  ${PRODUCT_MIX_FRAGMENT}
`;
