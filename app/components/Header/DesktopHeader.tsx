import { Await, NavLink } from '@remix-run/react';
import { motion } from 'framer-motion';
import Logo from '../Logo';
import { CartCount } from '../CartCount';
import { HeaderMenuQuery } from 'storefrontapi.generated';
import { getUrlAndCheckIfExternal } from '~/lib/utils';
import { useIsHydrated } from '~/hooks/useIsHydrated';
import { Suspense } from 'react';

interface DesktopHeaderProps {
  headerMenu: HeaderMenuQuery['headerMenu'];
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
  primaryDomainUrl: string;
}

export const DesktopHeader = ({
  headerMenu,
  isLoggedIn,
  publicStoreDomain,
  primaryDomainUrl,
}: DesktopHeaderProps) => {
  const isHydrated = useIsHydrated();

  return (
    <header
      role="banner"
      className="header-shadow bg-contrast/80 text-primary shadow-lightHeader hidden h-24 md:flex sticky transition backdrop-blur-lg z-50 top-0 w-full px-12 py-8 justify-center"
    >
      <div className="max-w-screen-lg w-full items-center md:flex justify-between leading-none gap-8">
        <Logo className="w-20" />

        <div className="flex gap-12">
          <nav className="flex gap-8">
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
        </div>
        <div className="flex items-center gap-1">
          {/* Uncomment if needed for user account links */}
          {/* <AccountLink className="relative flex items-center justify-center w-10 h-10 focus:ring-primary/5" /> */}
          <CartCount opacity={1} />
        </div>
      </div>
    </header>
  );
};

function activeLinkStyle({ isActive }: { isActive: boolean }) {
  return {
    color: isActive ? 'rgb(255, 203, 8)' : undefined,
    marginBottom: isActive ? '-1px' : undefined,
    borderBottom: '0px'
  };
}
