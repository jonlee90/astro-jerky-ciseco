// utils/collectionLoader.ts
import { defer } from "@shopify/remix-oxygen";
import invariant from "tiny-invariant";
import { COMMON_PRODUCT_CARD_FRAGMENT } from "~/data/commonFragments";
import { seoPayload } from "~/lib/seo.server";
import { getLoaderRouteFromMetaobject } from "~/utils/getLoaderRouteFromMetaobject";
import { getPaginationAndFiltersFromRequest } from "~/utils/getPaginationAndFiltersFromRequest";

export async function loadCollectionData({
  collectionHandle,
  params,
  request,
  context,
}: {
  collectionHandle: string;
  params: Record<string, string>;
  request: Request;
  context: any;
}) {
  const locale = context.storefront.i18n;

  invariant(collectionHandle, "Missing collectionHandle param");
  const routePromise = getLoaderRouteFromMetaobject({
    params,
    context,
    request,
    handle: "route-collection",
  });

  const { paginationVariables, filters, sortKey, reverse } =
    getPaginationAndFiltersFromRequest(request);

  const { collection } = await context.storefront.query(COLLECTION_QUERY, {
    variables: {
      ...paginationVariables,
      handle: collectionHandle,
      filters,
      sortKey,
      reverse,
      country: locale.country,
      language: locale.language,
    },
  });

  if (!collection) {
    throw new Response("Collection not found", { status: 404 });
  }

  const seo = seoPayload.collection({ collection, url: request.url });

  const defaultPriceFilter = collection.productsWithDefaultFilter.filters.find(
    (filter) => filter.id === "filter.v.price"
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