import { LoaderFunctionArgs, MetaArgs } from '@shopify/remix-oxygen';
import { useLoaderData } from '@remix-run/react';
import { flattenConnection, getSeoMeta } from '@shopify/hydrogen';
import { MixMatchProducts } from '~/components/MixMatch/MixMatchProducts';
import { PRODUCT_MIX_FRAGMENT } from '~/data/fragments';
import { seoPayload } from '~/lib/seo.server';

import type {
  MixAllProductsQuery,
  ProductMixFragment,
} from 'storefrontapi.generated';

interface MixMatchProduct {
  id: string;
  product_id: string;
  availableForSale: boolean;
  image: ProductMixFragment['variants']['nodes'][0]['image'];
  handle: string;
  quantity: number;
  title: string;
  tags: string[];
  description: string;
  media: any[];
  size: string;
  flavor_level?: { value: string };
  heat_level?: { value: string };
  sweetness_level?: { value: string };
  dryness_level?: { value: string };
  small_bag_quantity: number;
  big_bag_quantity: number;
  price: string;
  compareAtPrice: string;
  okendoStarRatingSnippet?: any;
}

interface LoaderData {
  bundleHandle: string;
  smallProducts: MixMatchProduct[];
  bigProducts: MixMatchProduct[];
  bundleProducts: MixMatchProduct[];
}

export async function loader({ params, request, context: { storefront } }: LoaderFunctionArgs) {
  const { bundleHandle } = params;

  if (!bundleHandle) {
    throw new Response('Bundle handle is required', { status: 400 });
  }

  const { products } = await storefront.query<MixAllProductsQuery>(API_ALL_PRODUCTS_QUERY, {
    variables: {
      count: 25,
      sortKey: "BEST_SELLING",
      country: storefront.i18n.country,
      language: storefront.i18n.language,
    },
    cache: storefront.CacheLong(),
  });

  const flattenedProducts = flattenConnection(products);
  const smallProducts: MixMatchProduct[] = [];
  const bigProducts: MixMatchProduct[] = [];
  const bundleProducts: MixMatchProduct[] = [];

  flattenedProducts.forEach((product) => {
    const variants = flattenConnection(product.variants);

    variants.forEach((variant) => {
      const sizeOption = variant.selectedOptions[0];
      if (!sizeOption) return;

      const size = sizeOption.value;
      const prod: MixMatchProduct = {
        id: variant.id,
        product_id: product.id,
        availableForSale: variant.availableForSale,
        image: variant.image,
        handle: variant.product.handle,
        quantity: 0,
        title: product.title,
        tags: product.tags,
        description: product.description,
        media: flattenConnection(product.media),
        size,
        flavor_level: product.flavor_level,
        heat_level: product.heat_level,
        sweetness_level: product.sweetness_level,
        dryness_level: product.dryness_level,
        small_bag_quantity: product.small_bag_quantity ? parseInt(product.small_bag_quantity.value, 10) : 0,
        big_bag_quantity: product.big_bag_quantity ? parseInt(product.big_bag_quantity.value, 10) : 0,
        price: product.priceRange.minVariantPrice.amount,
        compareAtPrice: product.compareAtPriceRange.minVariantPrice.amount,
        okendoStarRatingSnippet: product.okendoStarRatingSnippet
      };

      if (size === '3oz') {
        bigProducts.push(prod);
      } else if (size === '2oz') {
        smallProducts.push(prod);
      }

      if (bundleHandle === variant.product.handle) {
        bundleProducts.push(prod);
      }
    });
  });

  const seo = seoPayload.bundle({
    bundleHandle,
    url: request.url,
  });

  return {
    bundleHandle,
    smallProducts,
    bigProducts,
    bundleProducts,
    seo
  };
}

export const meta = ({matches}: MetaArgs<typeof loader>) => {
  return getSeoMeta(...matches.map((match) => (match.data as any).seo));
};

export default function Bundle() {
  const { smallProducts, bigProducts, bundleHandle, bundleProducts } = useLoaderData<typeof loader>();
  const currentBundle = bundleProducts.find(bundle => bundle.handle === bundleHandle);

  if (!currentBundle) {
    throw new Response('Bundle not found', { status: 404 });
  }

  return (
    <MixMatchProducts
      bigProducts={bigProducts}
      smallProducts={smallProducts}
      currentBundle={currentBundle}
      bundleProducts={bundleProducts}
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
