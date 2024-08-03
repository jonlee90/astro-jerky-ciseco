import {Await, useLoaderData, useLocation,useNavigate, useRouteLoaderData} from '@remix-run/react';
import {Suspense, useEffect} from 'react';
import {CartForm} from '@shopify/hydrogen';
import type {
  CartApiQueryFragment,
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
import NavMobileBottom from './Header/NavMobileBottom';
import { AnnouncementBar } from './AnnouncementBar';
import { FREE_SHIPPING_THRESHOLD } from '~/lib/const';
import { MobileHeader } from './Header/MobileHeader';
import { DesktopHeader } from './Header/DesktopHeader';
import { ButtonAnimation } from './Button/ButtonAnimation';
import { IconCaret } from './Icon';
import { CartCount } from './CartCount';

type LayoutProps = {
  children: React.ReactNode;
  layout?: LayoutQuery;
};
interface PageLayoutProps {
  cart: Promise<CartApiQueryFragment | null>;
}
export function Layout({children, layout}: LayoutProps) {
  const { pathname, state } = useLocation();
  const isBackButton = pathname.includes('/products/') ? !!state : (pathname.includes('/bundle/') && true);
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

      {!!layout && !isBackButton && <Footer />}
    </>
  );
}

function MyHeader() {
  const { pathname, state } = useLocation();
  const rootData = useRouteLoaderData('root');
  const navigate = useNavigate();
  const navLink = pathname.includes('/bundle/') && !state ? '/bundle' : -1;
  const isBackButton = pathname.includes('/products/') ? !!state : (pathname.includes('/bundle/') && true);

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
      <AnnouncementBar content={`FREE SHIPPING ON $${FREE_SHIPPING_THRESHOLD} OR MORE`}/>
        <Suspense fallback={<></>}>
          <Await resolve={rootData?.cart}>
              {(cart) => (
                <CartDrawer isOpen={isCartOpen} onClose={closeCart} cart={cart} />
              )}
          </Await>
        </Suspense>
      {/*
        <MainNav openMenu={openMenu} openCart={openCart} isHome={isHome} />
      */}
      {isBackButton ?
        <>
          <ButtonAnimation
              onClick={() => navigate(navLink)} 
              className="pdp-nav-button transform left-5"
          >
            <IconCaret
              direction='right' 
              className="!size-14 z-50 rounded-full bg-black text-white font-bold p-2"
            />
          </ButtonAnimation>
          
          <Suspense fallback={<></>}>
            <Await resolve={rootData?.cart}>
              {(cart) => (
                cart?.totalQuantity > 0 && <CartCount openCart={openCart} className='pdp-nav-button right-5' />  
              )}
            </Await>
          </Suspense>
        </>
      :
      <>
        <MobileMenuDrawer isOpen={isMenuOpen} onClose={closeMenu} />
        <DesktopHeader openCart={openCart} />
        <MobileHeader openMenu={openMenu} />
        <NavMobileBottom openCart={openCart} />
      </>
      }
    </>
  );
}

function CartDrawer({isOpen, onClose, cart}: {isOpen: boolean; onClose: () => void; cart: CartApiQueryFragment}) {
  return (
    <Drawer
      open={isOpen}
      onClose={onClose}
      heading="Shopping Cart"
      openFrom="right"
    >
     
    <Suspense fallback={<></>}>
     <Await resolve={cart}>
        {(cart) => <Cart onClose={onClose} cart={cart as CartApiQueryFragment} />}
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
