import React, {useEffect, useState, useRef} from 'react';
import {useLocation, Await, useRouteLoaderData} from '@remix-run/react';
import { IconHome } from '../Icon';
import { IconJerky } from '../Icon';
import { IconBundle } from '../Icon';
import { IconReward } from '../Icon';
import { IconCart } from '../Icon';
import {motion } from 'framer-motion';
import useWindowScroll from './useWindowScroll';
import { Link } from '../Link';
import { RootLoader } from '~/root';
import { useAside } from '../Aside';



const navItems = [
  { path: '/', label: 'Home', icon: IconHome },
  { path: '/collections/classic-flavors', label: 'Jerky', icon: IconJerky },
  { path: '/bundle', label: 'Bundle', icon: IconBundle },
  { path: '/rewards', label: 'Rewards', icon: IconReward, needsAuth: false },
];
const NavMobileBottom = () => {
  const rootData = useRouteLoaderData<RootLoader>('root');
  const {open} = useAside();
  const { pathname } = useLocation();
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

  const isAuthenticated =  rootData?.isLoggedIn;

  const activeItemIndex = navItems.findIndex(
    (item) => (isAuthenticated && item.path === '/rewards') || item.path === pathname
  );
  return (
    <div className="header-shadow overflow-hidden bottom-0 md:hidden fixed z-50 w-full h-14 bg-contrast/80 border-x border-b border-gray-300 pb-1 transform -translate-x-1/2 left-1/2"
          style={{ opacity }}
    >
        {activeItemIndex >= 0 && (
        <hr
          className="absolute top-0 h-1 w-[13%] bg-logo-green transition-all duration-300 ease-in-out"
          style={{ left: `${(activeItemIndex * 20 + 3.5)}%` }}
        />
      )}
      <div className="relative grid grid-cols-5 items-center text-center mt-1">
        {navItems.map((item, index) => {
          // Skip rendering the fourth item since we handle it separately
          if (index === 3) return null;
          return (
            <motion.div key={item.path} whileTap={{  scale: 0.95  }} className="col-span-1 relative">
              <Link 
                to={item.path} 
                prefetch="intent" 
                className="inline-flex flex-col items-center justify-center w-full"
                >
                <item.icon className='' />
                <span className="text-xs">{item.label}</span>
              </Link>
            </motion.div>
          );
        })}

        {/* Handle the fourth nav item separately */}
        <Await resolve={rootData?.isLoggedIn}>
          {(isLoggedIn) => (
          <motion.div whileTap={{ scale: 0.95 }}>
            <Link to={isLoggedIn ?'/account': '/rewards'} prefetch="none" className="inline-flex flex-col items-center justify-center">
              <IconReward />
              <span className="text-xs ">Rewards</span>
            </Link>
          </motion.div>
          )}
        </Await>

        <motion.button whileTap={{  scale: 0.95  }} onClick={() => open('cart')} type="button" className="inline-flex flex-col relative items-center justify-center w-full col-span-1">
          <Await resolve={rootData?.cart}>
            {(cart) => (
              <>
                <IconCart className="w-8 h-8" color="black" />
                <span className="text-xs">Cart</span>
                {cart?.totalQuantity > 0 && (
                  <div className="left-1/2 transform -translate-x-1/2 top-0.5 text-contrast bg-logo-green absolute text-xs font-medium subpixel-antialiased size-4 flex items-center justify-center text-center rounded-full px-[0.125rem] pb-px">
                    <span>{cart.totalQuantity}</span>
                  </div>
                )}
              </>
            )}
          </Await>
        </motion.button>
      </div>
    </div>
  );
};

export default NavMobileBottom;
