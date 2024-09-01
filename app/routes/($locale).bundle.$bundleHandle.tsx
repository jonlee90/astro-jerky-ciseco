import { json } from '@shopify/remix-oxygen';
import { useLoaderData } from '@remix-run/react';
import { flattenConnection } from '@shopify/hydrogen';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BundlePacks } from '~/data/bundleData';
import { MixMatchProducts } from '~/components/MixMatch/MixMatchProducts';
import { PRODUCT_MIX_FRAGMENT } from '~/data/fragments';
import { ProductMixFragment } from 'storefrontapi.generated';

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
}

interface LoaderData {
  bundleHandle: string;
  smallProducts: ProductMixFragment[];
  bigProducts: ProductMixFragment[];
}

export async function loader({ params, context: { storefront } }: { params: any, context: any }) {
  const { bundleHandle } = params;
  const { products } = await storefront.query(API_ALL_PRODUCTS_QUERY, {
    variables: {
      count: 12,
      query: 'tag:classic_flavors',
      sortKey: "BEST_SELLING",
      country: storefront.i18n.country,
      language: storefront.i18n.language,
    },
    cache: storefront.CacheLong(),
  });

  const flattenedProducts = flattenConnection(products);
  const smallProducts: ProductVariant[] = [];
  const bigProducts: ProductVariant[] = [];

  flattenedProducts.map((product: any) => {
    flattenConnection(product.variants).map((variant: any) => {
      const size = variant.selectedOptions[0].value;
      const prod: ProductVariant = {
        id: variant.id,
        availableForSale: variant.availableForSale,
        image: variant.image,
        handle: variant.product.handle,
        quantity: 0,
        title: product.title,
        tags: product.tags,
        description: product.description,
        media: flattenConnection(product.media),
        size
      }
      if (size === '3oz') {
        bigProducts.push(prod);
      } else if (size === '2oz') {
        smallProducts.push(prod);
      }
    });
  });

  return json({
    bundleHandle: bundleHandle,
    smallProducts: smallProducts,
    bigProducts: bigProducts
  });
}

export default function Bundle() {
  const { smallProducts, bigProducts, bundleHandle } = useLoaderData<LoaderData>();
  const currentBundle = BundlePacks.find(pack => pack.id === parseInt(bundleHandle));
  return (
    <MixMatchProducts
      bigProducts={bigProducts}
      smallProducts={smallProducts}
      currentBundle={currentBundle}
    />
  );
}

// @see: https://shopify.dev/api/storefront/current/queries/products
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
