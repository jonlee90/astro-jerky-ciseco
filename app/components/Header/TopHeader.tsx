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
import { IconMenuCircle } from '../Icon';
import { useAside } from '../Aside';

interface TopHeaderProps {
  headerMenu: HeaderMenuQuery['headerMenu'];
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
  primaryDomainUrl: string;
  isBundlePage: boolean;
  isBackButton?: boolean;
  isAnnouncementBarVisible: boolean;
}

export const TopHeader = ({
  headerMenu,
  isLoggedIn,
  publicStoreDomain,
  primaryDomainUrl,
  isBundlePage,
  isBackButton = false,
  isAnnouncementBarVisible,
}: TopHeaderProps) => {
  const isHydrated = useIsHydrated();
  const {open} = useAside();
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
    <>
      {isBundlePage && isBackButton ?
        <BackButton 
          className={!isAnnouncementBarVisible ? 'top-5' : ''}
          isVisible={isVisible} 
        />
      :
      (
        <motion.header
          aria-label="Mobile Header"
          className="sticky h-[61px] bg-contrast text-primary shadow-md flex items-center backdrop-blur-lg z-[95] top-0 justify-center w-full leading-none py-1 px-4 md:px-8"
          initial={{ y: 0 }}
          transition={{ duration: 0.3 }}
          role="banner">
          {/* Desktop Header
          <div
            aria-label="Desktop Header"
            className="bg-contrast/80 text-primary shadow-lightHeader hidden h-24 md:flex sticky transition backdrop-blur-lg z-[90] top-0 w-full px-12 py-8 justify-center"
          >
            <div className="max-w-screen-lg w-full items-center md:flex justify-between leading-none gap-8">
              <Logo className="w-20" />

              <nav className="flex gap-8" role="navigation" aria-label="Main Navigation">
              
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
          */}
          {/* Mobile Header */}
            <>
              <a href="#mainContent" className="sr-only focus:not-sr-only">~
                Skip to content
              </a>

              <div>
                <button
                  className='header-menu-mobile-toggle reset'
                  onClick={() => open('mobile')}
                >
                  <IconMenuCircle className="size-12 cursor-pointer" />
                </button>
              </div>

              <div className="flex items-center justify-center w-full lg:w-[900px] mb-auto">
                <Logo className="w-[50px]" />
              </div>

              <div>
                <CartCount opacity={1} className={`cursor-pointer bg-black`} showCart={true} is3D={false} />
              </div>

              {/*<div className="py-3 xs:ml-5 sm:!ml-10">
                <picture>
                  <img src={'/images/header-text-1-orange.png'} alt="ASTRO" />
                </picture>
              </div>

              <div className="flex items-center justify-center w-full gap-4">
                <Logo className="w-[60px]" />
              </div>

              <div className="py-3 xs:mr-5 sm:!mr-10">
                <picture>
                  <img src={'/images/header-text-2-orange.png'} alt="JERKY" />
                </picture>
              </div>*/}
            </>

        </motion.header>
    
      )}
    
      
    </>
  );
};
