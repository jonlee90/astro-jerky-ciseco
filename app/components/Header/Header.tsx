import {Suspense, useEffect, useRef, useState} from 'react';
import {Await, NavLink, useLocation} from '@remix-run/react';
import {type CartViewPayload, useAnalytics} from '@shopify/hydrogen';
import type {HeaderMenuQuery, CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import NavMobileBottom from './NavMobileBottom';
import { MobileHeader } from './MobileHeader';
import { DesktopHeader } from './DesktopHeader';
import { CartCount } from '../CartCount';
import { AnnouncementBar } from '../AnnouncementBar';
import { FREE_SHIPPING_THRESHOLD } from '~/lib/const';
import { useIsHydrated } from '~/hooks/useIsHydrated';
import { useMediaQuery } from 'react-responsive';
import useWindowScroll from './useWindowScroll';

interface HeaderProps {
  header: HeaderMenuQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
  primaryDomainUrl: string;
}

export function Header({
  header,
  isLoggedIn,
  cart,
  primaryDomainUrl,
  publicStoreDomain
}: HeaderProps) {
  const {headerMenu} = header;
  const { pathname, state } = useLocation();
  const isHydrated = useIsHydrated();
  const isBackButton = isHydrated && (pathname.includes('/products/') ? !!state : (pathname.includes('/bundle/') && true));
  const isCartButton = isHydrated && !!state && pathname.includes('/bundle/') && true;
  const isDesktop = useMediaQuery({minWidth: 767});

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
      {isBackButton && isHydrated ?
        <>
          {/*<motion.button
            onClick={() => navigate(navLink)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95, opacity: 0.6 }}
            style={{opacity}}
            className={`pdp-nav-button transform left-5 ${navLink === '/bundle' ? 'bottom-5' : pathname.includes('/products/') && isDesktop ? 'top-10' : 'bottom-24'}`}
          >
            <IconCaret
              direction='right' 
              className="!size-14 z-50 rounded-full bg-black text-white font-bold p-2"
            />
          </motion.button>*/}

          {isCartButton ? <CartCount opacity={opacity} className={`pdp-nav-button right-5 ${isDesktop ? 'top-10' : 'bottom-5'}`} /> : <></> }
        </>
      :
      <>
        <DesktopHeader 
          isLoggedIn={isLoggedIn}
          headerMenu={headerMenu}
          publicStoreDomain={publicStoreDomain}
          primaryDomainUrl={primaryDomainUrl}
        />
        <MobileHeader />
        <NavMobileBottom 
          opacity={opacity} 
          isLoggedIn={isLoggedIn}
          cart={cart}
        />
      </>
      }
    </>
  );
}

