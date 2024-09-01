import React, { Suspense } from 'react';
import { Await, NavLink } from '@remix-run/react';
import { motion } from 'framer-motion';
import Logo from '../Logo';
import { HeaderMenuDataWrap } from '../PageLayout';
import { CartCount } from '../CartCount';
import { Link } from '../Link';
import { RootLoader } from '~/root';
import { HeaderMenuQuery } from 'storefrontapi.generated';
import { getUrlAndCheckIfExternal } from '~/lib/utils';

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
  primaryDomainUrl
}: DesktopHeaderProps) => {
  const linkCss = 'pb-1 uppercase text-2xl font-RobotoSlabRegular font-bold';

  return (
    <header
      role="banner"
      className={`header-shadow bg-contrast/80 text-primary shadow-lightHeader hidden h-24 md:flex sticky transition backdrop-blur-lg z-50 top-0 w-full px-12 py-8 justify-center`}
    >
      <div className="max-w-screen-lg w-full items-center md:flex justify-between leading-none gap-8">
        <Logo className='w-20' />

        <div className="flex gap-12">
          <nav className="flex gap-8">
            {/* Top level menu items */}
            <Await resolve={isLoggedIn}>
              {(isLoggedIn) => (
                <>
                  {(headerMenu?.items || []).map((item) => (
                      <motion.div
                        whileHover="highlight"
                        variants={{
                          highlight: {
                            color: 'rgb(0, 166, 81)'
                          }
                        }} 
                        key={item.id}
                      >
                        <NavLink
                          key={item.id}
                          to={isLoggedIn && item.url === '/rewards' ? '/account' : getUrlAndCheckIfExternal(item.url, publicStoreDomain, primaryDomainUrl)}
                          prefetch="intent"
                          className={({ isActive }) =>
                            isActive ? `color-logo-green -mb-px ${linkCss}` : linkCss
                          }
                        >
                          {item.title}
                        </NavLink>
                      </motion.div>
                    ))
                  }
                </>
              )}
            </Await>
          </nav>
        </div>
        <div className="flex items-center gap-1">
          {/* <AccountLink className="relative flex items-center justify-center w-10 h-10 focus:ring-primary/5" /> */}
          <CartCount opacity={1} />
        </div>
      </div>
    </header>
  );
};
