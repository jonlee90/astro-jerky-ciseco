import {
  defer,
  type LinksFunction,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {
  isRouteErrorResponse,
  Links,
  Meta,
  type MetaFunction,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError,
  type ShouldRevalidateFunction,
} from '@remix-run/react';
import {
  useNonce,
  getSeoMeta,
  UNSTABLE_Analytics as Analytics,
  getShopAnalytics,
} from '@shopify/hydrogen';
import {Layout} from '~/components/Layout';
import {seoPayload} from '~/lib/seo.server';
import favicon from '@/assets/favicon.svg';
import {GenericError} from './components/GenericError';
import {NotFound} from './components/NotFound';
import styles from './styles/app.css?url';
import stylesFont from './styles/custom-font.css?url';
import {DEFAULT_LOCALE} from './lib/utils';
import rcSliderStyle from 'rc-slider/assets/index.css?url';
import {COMMON_COLLECTION_ITEM_FRAGMENT} from './data/commonFragments';
import {OkendoProvider, getOkendoProviderData} from '@okendo/shopify-hydrogen';

// This is important to avoid re-fetching root queries on sub-navigations
export const shouldRevalidate: ShouldRevalidateFunction = ({
  formMethod,
  currentUrl,
  nextUrl,
}) => {
  // revalidate when a mutation is performed e.g add to cart, login...
  if (formMethod && formMethod !== 'GET') {
    return true;
  }

  // revalidate when manually revalidating via useRevalidator
  if (currentUrl.toString() === nextUrl.toString()) {
    return true;
  }

  return false;
};

export const links: LinksFunction = () => {
  return [
    {rel: 'stylesheet', href: styles},
    {rel: 'stylesheet', href: stylesFont},
    {rel: 'stylesheet', href: rcSliderStyle},
    {rel: 'preconnect', href: 'https://cdn.shopify.com'},
    {rel: 'preconnect', href: 'https://shop.app'},
    {rel: 'icon', type: 'image/svg+xml', href: favicon},
  ];
};

export async function loader({request, context}: LoaderFunctionArgs) {
  const {storefront, cart, env} = context;
  const {language, country} = storefront.i18n;

  // Load the header, footer and layout data in parallel
  const isLoggedInPromise = context.customerAccount.isLoggedIn();
  const headerPromise = storefront.query(HEADER_QUERY, {
    variables: {
      featuredCollectionsFirst: 1,
      socialsFirst: 10,
      headerMenuHandle: 'main-menu',
      language,
      country,
    },
  });
  const footerPromise = storefront.query(FOOTER_QUERY, {
    variables: {
      footerMenuHandle: 'footer',
      language,
      country,
    },
  });
  const layout = await storefront.query(LAYOUT_QUERY, {
    variables: {
      language,
      country,
    },
  });
  const okendoProviderData = await getOkendoProviderData({
    context,
    subscriberId: context.env.PUBLIC_OKENDO_SUBSCRIBER_ID,
  });
  //

  const seo = seoPayload.root({shop: layout.shop, url: request.url});
  return defer(
    {
      layout: layout || {},
      headerPromise,
      footerPromise,
      shop: getShopAnalytics({
        storefront: context.storefront,
        publicStorefrontId: env.PUBLIC_STOREFRONT_ID,
      }),
      consent: {
        checkoutDomain: env.PUBLIC_CHECKOUT_DOMAIN,
        storefrontAccessToken: env.PUBLIC_STOREFRONT_API_TOKEN,
      },
      isLoggedIn: isLoggedInPromise,
      isLoggedInPromise,
      selectedLocale: storefront.i18n,
      cart: cart.get(),
      okendoProviderData,
      seo,

      /**********  EXAMPLE UPDATE STARTS  ************/
      env,
      publicStoreDomain: env.PUBLIC_STORE_DOMAIN,
      publicStoreSubdomain: env.PUBLIC_SHOPIFY_STORE_DOMAIN,
      publicStoreCdnStaticUrl: env.PUBLIC_STORE_CDN_STATIC_URL,
      publicImageFormatForProductOption:
        env.PUBLIC_IMAGE_FORMAT_FOR_PRODUCT_OPTION,
      publicOkendoSubcriberId: env.PUBLIC_OKENDO_SUBSCRIBER_ID,
      /**********   EXAMPLE UPDATE END   ************/
    },
    {
      headers: {
        'Set-Cookie': await context.session.commit(),
      },
    },
  );
}

export const meta: MetaFunction<typeof loader> = ({data, matches}) => {
  // Pass one or more arguments, preserving properties from parent routes
  return getSeoMeta(...matches.map((match) => (match?.data as any)?.seo));
};

export default function App() {
  const nonce = useNonce();
  const data = useLoaderData<typeof loader>();
  const locale = data.selectedLocale ?? DEFAULT_LOCALE;

  return (
    <html lang={locale.language}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="msvalidate.01" content="A352E6A0AF9A652267361BBB572B8468" />
        <meta name="oke:subscriber_id" content={data.publicOkendoSubcriberId} />

        <Meta />
        <Links />
      </head>
      <body className="bg-white">
        <OkendoProvider
          nonce={nonce}
          okendoProviderData={data.okendoProviderData}
        />
        <Analytics.Provider
          cart={data.cart}
          shop={data.shop}
          consent={data.consent}
        >
          <Layout
            key={`${locale.language}-${locale.country}`}
            layout={data.layout}
          >
            <Outlet />
          </Layout>
        </Analytics.Provider>
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

export function ErrorBoundary({error}: {error: Error}) {
  const nonce = useNonce();
  const routeError = useRouteError();
  const rootData = useLoaderData<typeof loader>();
  const locale = rootData?.selectedLocale ?? DEFAULT_LOCALE;
  const isRouteError = isRouteErrorResponse(routeError);

  let title = 'Error';
  let pageType = 'page';

  if (isRouteError) {
    title = 'Not found';
    if (routeError.status === 404) pageType = routeError.data || pageType;
  }

  return (
    <html lang={locale.language}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>{title}</title>
        <Meta />
        <Links />
      </head>
      <body>
        {rootData?.layout ? (
          <Layout
            layout={rootData?.layout}
            key={`${locale.language}-${locale.country}`}
          >
            {isRouteError ? (
              <>
                {routeError.status === 404 ? (
                  <NotFound type={pageType} />
                ) : (
                  <GenericError
                    error={{message: `${routeError.status} ${routeError.data}`}}
                  />
                )}
              </>
            ) : (
              <GenericError
                error={error instanceof Error ? error : undefined}
              />
            )}
          </Layout>
        ) : (
          <GenericError
            error={error instanceof Error ? error : undefined}
            heading="Error loading the layout data."
            description="We found an error while loading this page. 😵‍💫 <br /> Please double check your environment variables and try again."
          />
        )}
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

const MENU_FRAGMENT = `#graphql
  fragment MenuItem on MenuItem {
    id
    resourceId
    tags
    title
    type
    url
  }
  fragment ChildMenuItem on MenuItem {
    ...MenuItem
  }
  fragment ParentMenuItem on MenuItem {
    ...MenuItem
    items {
      ...ChildMenuItem
    }
  }
  fragment Menu on Menu {
    id
    title
    items {
      ...ParentMenuItem
    }
  }
` as const;

const LAYOUT_QUERY = `#graphql
  query layout(
    $language: LanguageCode
    $country: CountryCode
  ) @inContext(language: $language, country: $country) {
    shop {
      ...Shop
    }
  }
  fragment Shop on Shop {
    id
    name
    description
    primaryDomain {
      url
    }
    brand {
      logo {
        image {
          url
          width
          height
        }
      }
      squareLogo {
        image {
          altText
          height
          width
          url
        }
      }
    }
  }
` as const;

const FOOTER_QUERY = `#graphql
  query FooterMenu(
    $language: LanguageCode
    $country: CountryCode
    $footerMenuHandle: String!
  ) @inContext(language: $language, country: $country) {
    footerMenu: menu(handle: $footerMenuHandle) {
      ...Menu
    }
  }
  ${MENU_FRAGMENT}
` as const;

const HEADER_QUERY = `#graphql
  query HeaderMenu(
    $language: LanguageCode
    $country: CountryCode
    $headerMenuHandle: String!
    $featuredCollectionsFirst: Int!
    $socialsFirst: Int!
  ) @inContext(language: $language, country: $country) {
    headerMenu: menu(handle: $headerMenuHandle) {
      ...Menu
    }
    featuredCollections: collections(first: $featuredCollectionsFirst, sortKey: UPDATED_AT) {
      nodes {
        ...CommonCollectionItem
      }
    }
    socials: metaobjects(type: "ciseco--social", first: $socialsFirst) {
      edges {
        node {
          type
          id
          handle
          title: field(key: "title") {
            type
            key
            value
          }
          description: field(key: "description") {
            type
            key
            value
          }
          icon: field(key: "icon") {
            type
            key
            reference {
              ... on MediaImage {
                image {
                  altText
                  url
                  width
                  height
                }
              }
            }
          }
          link: field(key: "link") {
            type
            key
            value
          }
        }
      }
    }
  }
  ${MENU_FRAGMENT}
  ${COMMON_COLLECTION_ITEM_FRAGMENT}
` as const;
