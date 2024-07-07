import {Await} from '@remix-run/react';
import {Suspense, useEffect} from 'react';
import {CartForm} from '@shopify/hydrogen';
import type {
  FooterMenuQuery,
  HeaderMenuQuery,
  LayoutQuery,
} from 'storefrontapi.generated';
import {type EnhancedMenu, parseMenu, useIsHomePath} from '~/lib/utils';
import {useCartFetchers} from '~/hooks/useCartFetchers';
import {useRootLoaderData} from '~/lib/root-data';
import MainNav from './Header/MainNav';
import NavMobile from './Header/NavMobile';
import Logo from './Logo';
import Footer from './Footer';
import {Drawer, useDrawer} from './Drawer';
import {CartLoading} from './CartLoading';
import {Cart} from './Cart';

type LayoutProps = {
  children: React.ReactNode;
  layout?: LayoutQuery;
};

export function Layout({children, layout}: LayoutProps) {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <div className="">
          <a href="#mainContent" className="sr-only">
            Skip to content
          </a>
        </div>

        {!!layout && <MyHeader />}

        <main role="main" className="flex-grow">
          {children}
        </main>
      </div>

      {!!layout && <Footer />}
    </>
  );
}

function MyHeader() {
  const isHome = useIsHomePath();

  const {
    isOpen: isCartOpen,
    openDrawer: openCart,
    closeDrawer: closeCart,
  } = useDrawer();

  const {
    isOpen: isMenuOpen,
    openDrawer: openMenu,
    closeDrawer: closeMenu,
  } = useDrawer();

  const addToCartFetchers = useCartFetchers(CartForm.ACTIONS.LinesAdd);

  // toggle cart drawer when adding to cart
  useEffect(() => {
    if (isCartOpen || !addToCartFetchers.length) return;
    openCart();
  }, [addToCartFetchers, isCartOpen, openCart]);

  return (
    <>
      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
      <MobileMenuDrawer isOpen={isMenuOpen} onClose={closeMenu} />
      <div className="nc-Header z-20">
        <MainNav openMenu={openMenu} openCart={openCart} isHome={isHome} />
      </div>
    </>
  );
}

function CartDrawer({isOpen, onClose}: {isOpen: boolean; onClose: () => void}) {
  const rootData = useRootLoaderData();

  return (
    <Drawer
      open={isOpen}
      onClose={onClose}
      heading="Shopping Cart"
      openFrom="right"
    >
      <Suspense fallback={<CartLoading />}>
        <Await resolve={rootData?.cart}>
          {(cart) => {
            return <Cart onClose={onClose} cart={cart} />;
          }}
        </Await>
      </Suspense>
    </Drawer>
  );
}

function MobileMenuDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <Drawer
      open={isOpen}
      onClose={onClose}
      openFrom="left"
      renderHeading={() => <Logo />}
    >
      <NavMobile onClose={onClose} />
    </Drawer>
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
  const {headerPromise, layout, env} = useRootLoaderData();
  const shop = layout?.shop || {};

  const customPrefixes = {BLOG: '', CATALOG: 'products'};
  return (
    <Suspense fallback={fallback}>
      <Await resolve={headerPromise}>
        {(headerData) => {
          const menu = headerData.headerMenu
            ? parseMenu(
                headerData.headerMenu,
                shop.primaryDomain.url,
                env,
                customPrefixes,
              )
            : undefined;

          return children({headerData, headerMenu: menu});
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
  const {
    footerPromise,
    layout: {shop},
    env,
  } = useRootLoaderData();
  const customPrefixes = {BLOG: '', CATALOG: 'products'};
  return (
    <Suspense fallback={null}>
      <Await resolve={footerPromise}>
        {(footerData) => {
          const menu = footerData.footerMenu
            ? parseMenu(
                footerData.footerMenu,
                shop.primaryDomain.url,
                env,
                customPrefixes,
              )
            : undefined;
          return children({footerData, footerMenu: menu});
        }}
      </Await>
    </Suspense>
  );
}
