import {Await, useLoaderData, useLocation,useNavigate, useRouteLoaderData} from '@remix-run/react';
import {Suspense, useEffect, useRef, useState} from 'react';
import type {
  CartApiQueryFragment,
  FooterMenuQuery,
  HeaderMenuQuery,
} from 'storefrontapi.generated';
import {type EnhancedMenu, parseMenu, useIsHomePath} from '~/lib/utils';
import Footer from './Footer';
import {CartLoading} from './CartLoading';
import {CartMain} from './CartMain';
import { Aside, useAside } from './Aside';
import type { RootLoader } from '~/root';
import { Header, HeaderMenu } from './Header/Header';
import { MotionConfig } from 'framer-motion';
import {Image} from '@shopify/hydrogen';


type LayoutProps = {
  cart: Promise<CartApiQueryFragment | null>;
  footer: Promise<FooterMenuQuery | null>;
  header: HeaderMenuQuery;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
  children?: React.ReactNode;
  layout: any;
};

export function PageLayout({
  cart,
  children = null,
  footer,
  header,
  isLoggedIn,
  publicStoreDomain,
  layout
}: LayoutProps) {
  const primaryDomainUrl = layout?.shop.primaryDomain.url;
  return (
    <Aside.Provider>
      <MotionConfig reducedMotion="user">
        <CartAside cart={cart} />
        <MobileMenuAside header={header} publicStoreDomain={publicStoreDomain} primaryDomainUrl={primaryDomainUrl}/>
          <div>
            <a href="#mainContent" className="sr-only">
              Skip to content
            </a>
          </div>

        {header && (
          <Header 
            header={header}
            cart={cart}
            isLoggedIn={isLoggedIn} 
            primaryDomainUrl={primaryDomainUrl}
            publicStoreDomain={publicStoreDomain}
          />
        )}

        <main role="main" className="flex-grow">
          {children}
        </main>
        <Footer 
          footer={footer}
          header={header}
          primaryDomainUrl={primaryDomainUrl}
          publicStoreDomain={publicStoreDomain}
        />
      </MotionConfig>
    </Aside.Provider>
  );
}


function CartAside({cart}: {cart: LayoutProps['cart']}) {
  return (
    <Aside heading="Shopping Cart" openFrom="right" type="cart">
      <Suspense fallback={<CartLoading />}>
        <Await resolve={cart} errorElement={<p>Error loading cart data</p>}>
          {(cartData) => {
            return <CartMain layout='aside' cart={cartData} />;
          }}
        </Await>
      </Suspense>
    </Aside>
  );
}
function MobileMenuAside({
  header,
  publicStoreDomain,
  primaryDomainUrl
}: {
  header: LayoutProps['header'];
  publicStoreDomain: LayoutProps['publicStoreDomain'];
  primaryDomainUrl: string;
}) {
  return (
    header.mobileSideMenu &&
    publicStoreDomain && (
      <Aside 
        type="mobile"  
        openFrom="left" 
        renderHeading={() => 
        <img
          src='https://cdn.shopify.com/s/files/1/0641/9742/7365/files/Astro_Logo_Alt.png?v=1750022263'
          alt={'Astro Logo'}
          className="size-20 top-5 absolute"
        />
        }
        
      >
        <HeaderMenu
          header={header}
          viewport="mobile"
          publicStoreDomain={publicStoreDomain}
          primaryDomainUrl={primaryDomainUrl}
        />
      </Aside>
    )
  );
}
export function HeaderMenuDataWrap({
  children,
  fallback = null,
}: {
  fallback?: React.ReactNode;
  children: ({
    headerData,
    headerMenu,
  }: {
    headerMenu: EnhancedMenu | null | undefined;
    headerData: HeaderMenuQuery;
  }) => React.ReactNode;
}) {
  const rootData = useRouteLoaderData<RootLoader>('root');

  const headerPromise = rootData?.header;
  const layout = rootData?.layout;
  const env = rootData?.env;

  const shop = layout?.shop;

  const customPrefixes = {BLOG: '', CATALOG: 'products'};
  return (
    <Suspense fallback={fallback}>
      <Await resolve={headerPromise}>
        {(headerData) => {
          const menu =
            headerData?.headerMenu && shop?.primaryDomain?.url && env
              ? parseMenu(
                  headerData.headerMenu,
                  shop?.primaryDomain?.url,
                  env,
                  customPrefixes,
                )
              : undefined;

          return headerData ? children({headerData, headerMenu: menu}) : null;
        }}
      </Await>
    </Suspense>
  );
}

export function FooterMenuDataWrap({
  children,
}: {
  children: ({
    footerData,
    footerMenu,
  }: {
    footerMenu: EnhancedMenu | null | undefined;
    footerData: FooterMenuQuery;
  }) => React.ReactNode;
}) {
  const rootData = useRouteLoaderData<RootLoader>('root');
  const footerPromise = rootData?.footer;
  const layout = rootData?.layout;
  const env = rootData?.env;
  const shop = layout?.shop;

  const customPrefixes = {BLOG: '', CATALOG: 'products'};
  return (
    <Suspense fallback={null}>
      <Await resolve={footerPromise}>
        {(footerData) => {
          const menu =
            footerData?.footerMenu && shop?.primaryDomain?.url && env
              ? parseMenu(
                  footerData.footerMenu,
                  shop.primaryDomain.url,
                  env,
                  customPrefixes,
                )
              : undefined;
          return footerData ? children({footerData, footerMenu: menu}) : null;
        }}
      </Await>
    </Suspense>
  );
}
