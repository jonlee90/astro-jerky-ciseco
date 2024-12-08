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
import BackButton from './BackButton';

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
  const isBackButton = isHydrated && (pathname.includes('/beef-jerky/') ? !!state : (pathname.includes('/bundle/') && true));
  const isBundlePage = isHydrated && !!state && pathname.includes('/bundle/') && true;
  const isDesktop = useMediaQuery({minWidth: 767});

  const [opacity, setOpacity] = useState<number>(1);
  const prevScrollY = useRef<number>(0);
  const { y } = useWindowScroll();
  useEffect(() => {
    if (y > prevScrollY.current && y > 150 && opacity !== 0.4) {
      setOpacity(0.4);
    } else if (y <= prevScrollY.current && opacity !== 1) {
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
      
      <DesktopHeader 
            isLoggedIn={isLoggedIn}
            headerMenu={headerMenu}
            publicStoreDomain={publicStoreDomain}
            primaryDomainUrl={primaryDomainUrl}
          />
          
    
      {!isBundlePage && (<MobileHeader isBackButton={isBackButton} />)}
      {isHydrated && (
        <>
          {isBackButton || isBundlePage  ? (
            <>
            {isBundlePage && (
              <>
                <CartCount
                  opacity={opacity}
                  className={`pdp-nav-button right-5 ${isDesktop ? 'top-10' : 'bottom-5'}`}
                />
                {isBackButton && (
                  <BackButton isVisible={!isBackButton} />
                )}
              </>
            )}
            </>
          ) : (
            <NavMobileBottom opacity={opacity} isLoggedIn={isLoggedIn} cart={cart} />
          )}
        </>
      )}
    </>
  );
}

