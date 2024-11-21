import {
  type AppLoadContext,
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
  useNavigation,
  useRouteLoaderData
} from '@remix-run/react';
import {
  useNonce,
  getSeoMeta,
  Analytics,
  getShopAnalytics,
  Script,
  useLoadScript,
} from '@shopify/hydrogen';
import {seoPayload} from '~/lib/seo.server';
import favicon from '@/assets/favicon.ico';
import styles from './styles/app.css?url';
import stylesFont from './styles/custom-font.css?url';
import rcSliderStyle from 'rc-slider/assets/index.css?url';
import {COMMON_COLLECTION_ITEM_FRAGMENT} from './data/commonFragments';
import { motion, AnimatePresence } from "framer-motion";
import invariant from 'tiny-invariant';
import { useIsHydrated } from './hooks/useIsHydrated';
import {GoogleTagManager} from '~/components/GoogleTagManager'
import { PageLayout } from './components/PageLayout';

import {DEFAULT_LOCALE, parseMenu} from './lib/utils';

export type RootLoader = typeof loader;

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
    {rel: 'preconnect', href: 'https://astrofreshjerky.com'},
    {rel: 'icon', type: 'image/svg+xml', href: favicon},
  ];
};

export async function loader(args: LoaderFunctionArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);
   // Await the critical data required to render initial state of the page
   const criticalData = await loadCriticalData(args);
 
   return defer({
     ...deferredData,
     ...criticalData
   });
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({request, context}: LoaderFunctionArgs) {
  const {storefront, env} = context;
  const {language, country} = storefront.i18n;

  const [header, layout] = await Promise.all([
    storefront.query(HEADER_QUERY, {
      cache: storefront.CacheLong(),
      variables: {
        featuredCollectionsFirst: 1,
        socialsFirst: 10,
        headerMenuHandle: 'main-menu',
        language,
        country,
      },
    }),
    getLayoutData(context)
  ]);
  const seo = seoPayload.root({shop: layout.shop, url: request.url});

  return {
    layout,
    seo,
    shop: getShopAnalytics({
      storefront,
      publicStorefrontId: env.PUBLIC_STOREFRONT_ID,
    }),
    consent: {
      checkoutDomain: env.PUBLIC_CHECKOUT_DOMAIN,
      storefrontAccessToken: env.PUBLIC_STOREFRONT_API_TOKEN,
      withPrivacyBanner: true,
      // localize the privacy banner
      country: country,
      language:language,
    },
    publicStoreDomain: env.PUBLIC_STORE_DOMAIN,
    selectedLocale: storefront.i18n,
    header
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: LoaderFunctionArgs) {
  const {cart, customerAccount, storefront} = context;
  const {language, country} = storefront.i18n;

 
  const footer = storefront.query(FOOTER_QUERY, {
    cache: storefront.CacheLong(),
    variables: {
      footerMenuHandle: 'footer',
      language,
      country,
    },
  });

  return {
    isLoggedIn: customerAccount.isLoggedIn(),
    cart: cart.get(),
    footer,
  };
}


export const meta: MetaFunction<RootLoader> = ({data, matches}) => {
  // Pass one or more arguments, preserving properties from parent routes
  return getSeoMeta(...matches.map((match) => (match?.data as any)?.seo));
};

const NAVBAR_LOGO = 'https://cdn.shopify.com/s/files/1/0641/9742/7365/files/astro-logo.png?v=1708205146';


export function Layout({children}: {children?: React.ReactNode}) {
  const nonce = useNonce();
  const data = useRouteLoaderData<RootLoader>('root');
  const locale = data?.selectedLocale ?? DEFAULT_LOCALE;
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";
  const isHydrated = useIsHydrated();

  return (
    <html lang={locale.language}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="msvalidate.01" content="A352E6A0AF9A652267361BBB572B8468" />
        <meta name="google-site-verification" content="25YtPW1Ho9GeTDGAmb7ERIzVTKDKWaCkNnpXAs8tlH4" />
        
        <Meta />
        <Links />
        <Script 
          dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                      })(window,document,'script','dataLayer','GTM-5BP4M9R5');`
          }}></Script>
        
      </head>
      <body className="bg-white">
          <noscript>
            <iframe 
              src="https://www.googletagmanager.com/ns.html?id=GTM-5BP4M9R5"
              height="0" 
              width="0" 
              style={{
                display:'none',
                visibility:'hidden'
              }}>
            </iframe>
          </noscript>
        <AnimatePresence>
          {isLoading  && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 flex items-center justify-center bg-white z-50"
              >
                <motion.img
                  src={NAVBAR_LOGO}
                  alt="Loading"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: [0.9, 1.1, 0.9] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="size-20"
                />
              </motion.div>
          )}
        </AnimatePresence>
          {data ? (
            <Analytics.Provider
              cart={data.cart}
              shop={data.shop}
              consent={data.consent}
            >
              <PageLayout
                key={`${locale.language}-${locale.country}`}
                {...data}
              >
                {children}
              </PageLayout>
            </Analytics.Provider>
        ) : (
          children
        )}
         <GoogleTagManager />
       
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      
      </body>
    </html>
  );
}

export default function App() {
  return (
    <Outlet />
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  let errorMessage = 'Unknown error';
  let errorStatus = 500;

  if (isRouteErrorResponse(error)) {
    errorMessage = error?.data?.message ?? error.data;
    errorStatus = error.status;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className="route-error">
      <h1>Oops</h1>
      <h1>{errorStatus}</h1>
      {errorMessage && (
        <fieldset>
          <pre>{errorMessage}</pre>
        </fieldset>
      )}
    </div>
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

async function getLayoutData({storefront, env}: AppLoadContext) {
  const data = await storefront.query(LAYOUT_QUERY, {
    variables: {
      country: storefront.i18n.country,
      language: storefront.i18n.language,
    },
  });

  invariant(data, 'No data returned from Shopify API');

  return data;
}
