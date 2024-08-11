import {Await, useLoaderData, useLocation,useNavigate, useRouteLoaderData} from '@remix-run/react';
import {Suspense, useEffect, useRef, useState} from 'react';
import {CartForm} from '@shopify/hydrogen';
import type {
  CartApiQueryFragment,
  FooterMenuQuery,
  HeaderMenuQuery,
  LayoutQuery,
} from 'storefrontapi.generated';
import {type EnhancedMenu, parseMenu, useIsHomePath} from '~/lib/utils';
import {useCartFetchers} from '~/hooks/useCartFetchers';
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
import { Aside, useAside } from './Aside';
import type { RootLoader } from '~/root';
import { motion } from 'framer-motion';
import { useIsHydrated } from '~/hooks/useIsHydrated';
import useWindowScroll from './Header/useWindowScroll';

type LayoutProps = {
  layout: LayoutQuery;
  children?: React.ReactNode;
  cart: Promise<CartApiQueryFragment | null>;
};

export function Layout({children, layout, cart}: LayoutProps) {
  const { pathname, state } = useLocation();
  const isBackButton = pathname.includes('/products/') ? !!state : (pathname.includes('/bundle/') && true);
  return (
    <Aside.Provider>
      <CartAside cart={cart} />
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
    </Aside.Provider>
  );
}

function MyHeader() {
  const { pathname, state } = useLocation();
  const navigate = useNavigate();
  const navLink = pathname.includes('/bundle') && !!state ? '/bundle' : -1;
  const isHydrated = useIsHydrated();
  const isBackButton = isHydrated && (pathname.includes('/products/') ? !!state : (pathname.includes('/bundle/') && true));

  const [opacity, setOpacity] = useState<number>(1);
  const prevScrollY = useRef<number>(0);
  const { y } = useWindowScroll();
  useEffect(() => {
    if (y > prevScrollY.current && y > 150) {
      setOpacity(0.4);
    } else {
      setOpacity(1);
    }
    prevScrollY.current = y;
  }, [y]);

  return (
    <>
      <AnnouncementBar content={`FREE SHIPPING ON $${FREE_SHIPPING_THRESHOLD} OR MORE`}/>
      {/*
        <MainNav openMenu={openMenu} openCart={openCart} isHome={isHome} />
      */}
      {isBackButton ?
        <>
          <motion.button
            onClick={() => navigate(navLink)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95, opacity: 0.6 }}
            style={{opacity}}
            className={`pdp-nav-button transform left-5 ${navLink === '/bundle' ? 'bottom-5' : 'top-10'}`}
          >
            <IconCaret
              direction='right' 
              className="!size-14 z-50 rounded-full bg-black text-white font-bold p-2"
            />
          </motion.button>

          <CartCount opacity={opacity} className={`pdp-nav-button right-5 ${navLink === '/bundle' ? 'bottom-5' : 'top-10'}`} />  
        </>
      :
      <>
        <DesktopHeader />
        <MobileHeader />
        <NavMobileBottom opacity={opacity} />
      </>
      }
    </>
  );
}

function CartAside({cart}: {cart: CartApiQueryFragment}) {
  const {close} = useAside();
  return (
    <Aside heading="Shopping Cart" openFrom="right" type="cart">
      <Suspense fallback={<CartLoading />}>
        <Await resolve={cart}>
          {(cart) => {
            return <Cart onClose={close} cart={cart || null} />;
          }}
        </Await>
      </Suspense>
    </Aside>
  );
}
function MobileMenuAside() {
  const {close} = useAside();
  return (
    <Aside openFrom="left" renderHeading={() => <Logo />} type="mobile">
      <NavMobile onClose={close} />
    </Aside>
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

  const headerPromise = rootData?.headerPromise;
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
  const footerPromise = rootData?.footerPromise;
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
