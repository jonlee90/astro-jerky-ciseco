import React, { Suspense } from 'react';
import { Await } from '@remix-run/react';
import { motion } from 'framer-motion';
import Logo from '../Logo';
import { useRootLoaderData } from '~/lib/root-data';
import { HeaderMenuDataWrap } from '../Layout';
import { CartCount } from '../CartCount';
import { Link } from '../Link';

interface MenuItem {
  id: string;
  to: string;
  target?: string;
  title: string;
}

interface DesktopHeaderProps {
  openCart: () => void;
}

interface BadgeProps {
  count: number;
}

const Badge: React.FC<BadgeProps> = ({ count }) => (
  <span className="badge">{count}</span>
);



export const DesktopHeader: React.FC<DesktopHeaderProps> = ({ openCart }) => {
  const rootData = useRootLoaderData();
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
            <Await resolve={rootData?.isLoggedIn}>
              {(isLoggedIn) => (
                <>
                  <HeaderMenuDataWrap>
                  {({headerMenu}) => {
                    return (headerMenu?.items || []).map((item) => (
                      <motion.div
                        whileHover="highlight"
                        variants={{
                          highlight: {
                            color: 'rgb(0, 166, 81)'
                          }
                        }} 
                        key={item.id}
                      >
                        <Link
                          key={item.id}
                          to={isLoggedIn && item.to === '/rewards' ? '/account' : item.to}
                          target={item.target}
                          prefetch="intent"
                          className={({ isActive }) =>
                            isActive ? `color-logo-green -mb-px ${linkCss}` : linkCss
                          }
                        >
                          {item.title}
                        </Link>
                      </motion.div>
                    ))
                  }}
                </HeaderMenuDataWrap>
                </>
              )}
            </Await>
          </nav>
        </div>
        <div className="flex items-center gap-1">
          {/* <AccountLink className="relative flex items-center justify-center w-10 h-10 focus:ring-primary/5" /> */}
          <CartCount openCart={openCart} />
        </div>
      </div>
    </header>
  );
};
