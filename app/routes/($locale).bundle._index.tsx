import {
  json,
  type LoaderFunctionArgs,
  type MetaArgs,
} from '@shopify/remix-oxygen';
import { Link } from '~/components/Link';
import { flattenConnection, Money, useMoney, getSeoMeta, Image } from '@shopify/hydrogen';
import clsx from 'clsx';
import { Card, CardHeader, CardBody } from "@material-tailwind/react";
import { motion } from 'framer-motion';
import PageHeader from '~/components/PageHeader';
import { MoneyV2 } from '@shopify/hydrogen/storefront-api-types';
import { useLoaderData } from '@remix-run/react';
import { ProductMixFragment } from 'storefrontapi.generated';
import { PRODUCT_MIX_FRAGMENT } from '~/data/fragments';
import {seoPayload} from '~/lib/seo.server';
import {BundleProductCard} from '~/components/BundleProductCard';
import PageTitleWithBackground from '~/components/PageTitleWithBackground';

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

export async function loader({ request, context: { storefront } }: LoaderFunctionArgs) {
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

  const bundleProducts = flattenConnection(products);
  
  const seo = seoPayload.listBundles({
    bundleProducts,
    url: request.url,
  });

  return json({
    bundleProducts,
    seo
  });
}

export const meta = ({matches}: MetaArgs<typeof loader>) => {
  return getSeoMeta(...matches.map((match) => (match.data as any).seo));
};


export default function AllBundle() {
  const { bundleProducts } = useLoaderData<LoaderData>();
  return (
    <div
      className={'nc-PageBundle pb-20 lg:pb-28 md:container'}
    >
        <PageTitleWithBackground
          title={'Bundle Packs'}
          description={'Mix & Match Between 12 Unique Flavors to Create a Custom Premium Beef Jerky Pack!'}
          backgroundImage={'https://cdn.shopify.com/s/files/1/0641/9742/7365/files/beef-jerky-bundle-background.png'}
          radialGradient="radial-gradient(rgba(0, 0, 0, 0.95) 0%, transparent 95%)"
        />
        <div  
          data-test="product-grid" 
          className="p-5 md:p-0  mt-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid gap-6 border-black"
          aria-label="Bundle products"
        >
          {bundleProducts.map((product) => (
            <BundleProductCard
              key={product.id}
              product={product}
            />
          ))}
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
