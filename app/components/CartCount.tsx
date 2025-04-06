import React, { Suspense, useMemo  } from 'react';
import { useIsHydrated } from '~/hooks/useIsHydrated';
import { Link, useRouteLoaderData } from '@remix-run/react';
import { motion } from 'framer-motion';
import { useLoaderData, Await } from '@remix-run/react';
import { IconCart } from './Icon';
import { useAside } from './Aside';
import { RootLoader } from '~/root';
import { useMediaQuery } from 'react-responsive';
import { useAnalytics } from '@shopify/hydrogen';

interface CartCountProps {
  className?: string;
  opacity: number;
  showCart?: boolean;
}

interface BadgeProps {
  openCart: () => void;
  count: number;
}

const Badge: React.FC<BadgeProps> = ({ openCart, count }) => {
  const isHydrated = useIsHydrated();

  const BadgeCounter = useMemo(
    () => (
      <>
        <IconCart className="size-8" />
        <div
          aria-label={`Cart has ${count} item`}
          className='text-black bg-white absolute top-3 right-2.5 text-sm font-medium subpixel-antialiased size-4 flex items-center justify-center text-center rounded-full'
        >
          <span>{count || 0}</span>
        </div>
      </>
    ),
    [count],
  );

  return isHydrated ? (
    <button
      onClick={openCart}
      className="relative flex items-center justify-center size-14 focus:ring-primary/5"
      aria-controls="CartDrawer"
      aria-label="View Cart"
      role="button"
    >
      {BadgeCounter}
    </button>
  ) : (
    <Link
      to="/cart"
      className="relative flex items-center justify-center size-14 focus:ring-primary/5"
    >
      {BadgeCounter}
    </Link>
  );
};

export const CartCount: React.FC<CartCountProps> = ({ className = '', opacity, showCart = false}) => {
  const rootData = useRouteLoaderData<RootLoader>('root');
  const {publish} = useAnalytics();
//  const isMobile = useMediaQuery({maxWidth: 767});
  const {open} = useAside();

  return (
      <Suspense fallback={<Badge openCart={() => open('cart')} count={0} />}>
        <Await resolve={rootData?.cart}>
          {(cart) => (
            <motion.div
              className={`border-black border rounded-full size-14  ${className} ${cart?.totalQuantity || showCart ? '' : 'hidden'}`}
              style={{opacity}}
            >
              <motion.div
                className={`rounded-full bg-neutral-900 hover:bg-neutral-700`}
                whileTap={{ x: 0, y: 0 }}
                animate={{ x: -3, y: -3 }}
              >
                <Badge
                  openCart={() => {
                    publish('custom_cart_viewed', {cart});
                    open('cart');
                  }}
                  count={cart?.totalQuantity || 0}
                />
              </motion.div>
            </motion.div>
          )}
        </Await>
      </Suspense>
  );
};
