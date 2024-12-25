import React, { useEffect, useState } from 'react';
import { useLocation } from '@remix-run/react';
import { IconHome, IconJerky, IconBundle, IconReward, IconCart } from '../Icon';
import { motion } from 'framer-motion';
import useWindowScroll from './useWindowScroll';
import { Link } from '../Link';
import { useAside } from '../Aside';
import { CartApiQueryFragment } from 'storefrontapi.generated';
import { CartCount } from '../CartCount';

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
  { path: '/collections', link: '/best-beef-jerky-flavors', label: 'Jerky', icon: IconJerky },
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
    } else if (pathname.includes('jerky') && item.path != '/') {
      return true;
    } else {
      return false;
    }
  });

  return (
    <nav
      role="navigation"
      aria-label="Bottom Mobile Navigation"
      className="shadow-lightHeader-top overflow-hidden bottom-0 md:hidden fixed z-50 w-full h-[75px] bg-contrast/95 border-x border-b border-gray-300 pb-1 transform -translate-x-1/2 left-1/2"
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
          const isActive = index === activeItemIndex;
          return (
            <motion.div key={index} whileTap={{ scale: 0.95 }} className="col-span-1 relative">
              <Link
                to={urlPath}
                prefetch="intent"
                className="inline-flex flex-col items-center justify-center w-full"
                aria-label={`Navigate to ${item.label} page`}
                aria-current={isActive ? 'page' : undefined}
              >
                <item.icon />
                <span className="text-sm">{item.label}</span>
              </Link>
              {isActive && <SpotlightEffect />}
            </motion.div>
          );
        })}

        {/* Handle the fourth nav item separately */}
        {isAuthenticated !== null && (
          <motion.div 
            className='relative'
            whileTap={{ scale: 0.95 }}>
            <Link
              to={isAuthenticated ? '/account' : '/rewards'}
              prefetch="none"
              className="inline-flex flex-col items-center justify-center"
              aria-current={activeItemIndex == 3 ? 'page' : undefined}
            >
              <IconReward />
              <span className="text-sm">Rewards</span>
            </Link>
            {activeItemIndex == 3 && <SpotlightEffect />}
          </motion.div>
        )}

        <div
          className='justify-items-center'
        >
          <CartCount opacity={1} className={`cursor-pointer md:hidden`} showCart={true} />
        </div>
      </div>
    </nav>
  );
};

function SpotlightEffect() {
  return (
    <div
      className="absolute size-16 -top-2 left-1/2 -translate-x-1/2 bg-[radial-gradient(ellipse,_rgba(230,183,7,0.9)_0%,_transparent_70%)] pointer-events-none opacity-70"
    ></div>
    )
}

export default NavMobileBottom;
