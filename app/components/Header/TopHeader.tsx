import React, { useState, useRef, useEffect, Suspense } from 'react';
import { Await, NavLink } from '@remix-run/react';
import { motion } from 'framer-motion';
import Logo from '../Logo';
import { CartCount } from '../CartCount';
import { HeaderMenuQuery } from 'storefrontapi.generated';
import { getUrlAndCheckIfExternal } from '~/lib/utils';
import { useIsHydrated } from '~/hooks/useIsHydrated';
import useWindowScroll from './useWindowScroll';
import BackButton from './BackButton';

interface TopHeaderProps {
  headerMenu: HeaderMenuQuery['headerMenu'];
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
  primaryDomainUrl: string;
  isBundlePage: boolean;
  isBackButton?: boolean;
}

export const TopHeader = ({
  headerMenu,
  isLoggedIn,
  publicStoreDomain,
  primaryDomainUrl,
  isBundlePage,
  isBackButton = false,
}: TopHeaderProps) => {
  const isHydrated = useIsHydrated();
  const [isVisible, setIsVisible] = useState(true);
  const { y } = useWindowScroll();
  const prevScrollY = useRef(0);

  useEffect(() => {
    if (y > prevScrollY.current && y > 150 && isVisible) {
      setIsVisible(false); // Scrolling down
    } else if (y <= 150 && !isVisible) {
      setIsVisible(true); // Scrolling up
    }
    prevScrollY.current = y;
  }, [y, isVisible]);

  return (
    <header
    role="banner">
      {/* Desktop Header */}
      <div
        aria-label="Desktop Header"
        className="bg-contrast/80 text-primary shadow-lightHeader hidden h-24 md:flex sticky transition backdrop-blur-lg z-[90] top-0 w-full px-12 py-8 justify-center"
      >
        <div className="max-w-screen-lg w-full items-center md:flex justify-between leading-none gap-8">
          <Logo className="w-20" />

          <nav className="flex gap-8" role="navigation" aria-label="Main Navigation">
            {/* Top level menu items */}
            {isHydrated && (
              <Suspense fallback={null}>
                <Await resolve={isLoggedIn}>
                  {(isLoggedIn) => (
                    <>
                      {(headerMenu?.items || []).map((item) => (
                        <motion.div
                          whileHover="highlight"
                          variants={{
                            highlight: {
                              color: 'rgb(255, 203, 8)',
                            },
                          }}
                          key={item.id}
                        >
                          <NavLink
                            to={
                              isLoggedIn && item.url === '/rewards'
                                ? '/account'
                                : getUrlAndCheckIfExternal(
                                    item.url,
                                    publicStoreDomain,
                                    primaryDomainUrl
                                  )
                            }
                            className="pb-1 uppercase text-2xl font-RobotoSlabRegular font-bold"
                            style={activeLinkStyle}
                          >
                            {item.title}
                          </NavLink>
                        </motion.div>
                      ))}
                    </>
                  )}
                </Await>
              </Suspense>
            )}
          </nav>

          <div className="flex items-center gap-1">
            <CartCount opacity={1} showCart={true} />
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      {!isBundlePage && (
        <motion.div
          aria-label="Mobile Header"
          className="bg-contrast text-primary h-16 shadow-md flex md:hidden items-center sticky backdrop-blur-lg z-[95] top-0 justify-center w-full leading-none px-4 md:px-8"
          initial={{ y: 0 }}
          animate={{ y: isVisible ? 0 : -100 }}
          transition={{ duration: 0.3 }}
        >
          <a href="#mainContent" className="sr-only focus:not-sr-only">
            Skip to content
          </a>

          <div className="py-3 xs:ml-5 sm:!ml-10">
            <picture>
              <img src={'/images/header-text-1-orange.png'} alt="ASTRO" />
            </picture>
          </div>

          <div className="flex items-center justify-center w-full gap-4">
            <Logo className="w-16" />
          </div>

          <div className="py-3 xs:mr-5 sm:!mr-10">
            <picture>
              <img src={'/images/header-text-2-orange.png'} alt="JERKY" />
            </picture>
          </div>
        </motion.div>
      )}

      {isBackButton && <BackButton isVisible={isVisible} />}
    </header>
  );
};

function activeLinkStyle({ isActive }: { isActive: boolean }) {
  return {
    color: isActive ? 'rgb(255, 203, 8)' : undefined,
    marginBottom: isActive ? '-1px' : undefined,
    borderBottom: '0px',
  };
}
