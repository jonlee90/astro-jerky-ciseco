import React, { Suspense, useMemo  } from 'react';
import { useIsHydrated } from '~/hooks/useIsHydrated';
import { Link, useRouteLoaderData } from '@remix-run/react';
import { motion } from 'framer-motion';
import { useLoaderData, Await } from '@remix-run/react';
import { IconCart } from './Icon';
import { useAside } from './Aside';
import { RootLoader } from '~/root';
import { useMediaQuery } from 'react-responsive';

interface CartCountProps {
  className?: string;
  opacity: number;
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
          className='text-black bg-white absolute top-3 right-2.5 text-xs font-medium subpixel-antialiased size-4 flex items-center justify-center text-center rounded-full'
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

export const CartCount: React.FC<CartCountProps> = ({ className = '', opacity}) => {
  const rootData = useRouteLoaderData<RootLoader>('root');
//  const isMobile = useMediaQuery({maxWidth: 767});
  const {open} = useAside();

  return (
      <Suspense fallback={<Badge openCart={() => open('cart')} count={0} />}>
        <Await resolve={rootData?.cart}>
          {(cart) => (
            <motion.div
              className={`rounded-full bg-logo-yellow ${className} ${!cart?.totalQuantity && 'hidden'}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95, opacity: 0.6 }}
              onClick={() => open('cart')}
              style={{opacity}}
            >
              <Badge
                openCart={() => open('cart')}
                count={cart?.totalQuantity || 0}
              />
            </motion.div>
          )}
        </Await>
      </Suspense>
  );
};
