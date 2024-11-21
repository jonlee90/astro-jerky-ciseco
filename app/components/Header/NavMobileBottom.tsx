import React, { useEffect, useState } from 'react';
import { useLocation } from '@remix-run/react';
import { IconHome, IconJerky, IconBundle, IconReward, IconCart } from '../Icon';
import { motion } from 'framer-motion';
import useWindowScroll from './useWindowScroll';
import { Link } from '../Link';
import { useAside } from '../Aside';
import { CartApiQueryFragment } from 'storefrontapi.generated';

interface NavMobileBottomProps {
  opacity: number; // corrected type from `Number` to `number`
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
}


const NavMobileBottom: React.FC<NavMobileBottomProps> = ({ opacity, isLoggedIn, cart }) => {
  const { open } = useAside();
  const { pathname } = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [cartData, setCartData] = useState<CartApiQueryFragment | null>(null);

  useEffect(() => {
    // Resolve the promises and set state
    isLoggedIn.then(setIsAuthenticated);
    cart.then(setCartData);
  }, [isLoggedIn, cart]);

  const navItems = [
  { path: '/', label: 'Home', icon: IconHome },
  { path: '/collections', link: '/collections/classic-flavors', label: 'Jerky', icon: IconJerky },
  { path: '/bundle', label: 'Bundle', icon: IconBundle },
  { path: '/rewards', label: 'Rewards', icon: IconReward, needsAuth: false },
];
  const activeItemIndex = navItems.findIndex((item) => {
    if (isAuthenticated && pathname === '/rewards' && item.path === '/rewards') {
      return true;
    } else if (item.path === '/rewards' && pathname.includes('/account')) {
      return true;
    }  else if (item.path === pathname && pathname.includes(item.path)) {
      return true;
    } else if (item.path === '/collections' && pathname.includes(item.path)) {
      return true;
    } else {
      return false;
    }
  });

  return (
    <div
      className="header-shadow overflow-hidden bottom-0 md:hidden fixed z-50 w-full h-[68px] bg-contrast/95 border-x border-b border-gray-300 pb-1 transform -translate-x-1/2 left-1/2"
      style={{ opacity }}
    >
      {activeItemIndex >= 0 && (
        <hr
          className="absolute top-0 h-[5px] w-[13%] bg-primary-600 transition-all duration-300 ease-in-out"
          style={{ left: `${activeItemIndex * 20 + 3.5}%` }}
        />
      )}
      <div className="relative grid grid-cols-5 items-center text-center mt-1">
        {navItems.map((item, index) => {
          // Skip rendering the fourth item since we handle it separately
          if (index === 3) return null;
          const urlPath = item.link ? item.link : item.path;
          return (
            <motion.div key={index} whileTap={{ scale: 0.95 }} className="col-span-1 relative">
              <Link
                to={urlPath}
                prefetch="intent"
                className="inline-flex flex-col items-center justify-center w-full"
              >
                <item.icon />
                <span className="text-xs">{item.label}</span>
              </Link>
            </motion.div>
          );
        })}

        {/* Handle the fourth nav item separately */}
        {isAuthenticated !== null && (
          <motion.div whileTap={{ scale: 0.95 }}>
            <Link
              to={isAuthenticated ? '/account' : '/rewards'}
              prefetch="none"
              className="inline-flex flex-col items-center justify-center"
            >
              <IconReward />
              <span className="text-xs">Rewards</span>
            </Link>
          </motion.div>
        )}

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => open('cart')}
          type="button"
          className="inline-flex flex-col relative items-center justify-center w-full col-span-1"
        >
              <IconCart className="w-8 h-8" color="black" />
              <span className="text-xs">Cart</span>
              {cartData && cartData?.totalQuantity > 0 && (
                <div className="left-1/2 transform -translate-x-1/2 top-0.5 bg-primary-600 text-black bg-logo-yellow absolute text-xs font-medium subpixel-antialiased size-4 flex items-center justify-center text-center rounded-full px-[0.125rem] pb-px">
                  <span>{cartData.totalQuantity}</span>
                </div>
              )}
        </motion.button>
      </div>
    </div>
  );
};

export default NavMobileBottom;
