import React, { Suspense, useMemo  } from 'react';
import { useIsHydrated } from '~/hooks/useIsHydrated';
import { Link } from '@remix-run/react';
import { motion } from 'framer-motion';
import { useLoaderData, Await } from '@remix-run/react';
import { IconCart } from './Icon';

interface CartCountProps {
  openCart: () => void;
  className?: string;
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
        <IconCart className="w-8 h-8" />
        <div
          className='text-contrast bg-white color-logo-green absolute top-3 right-2.5 text-xs font-medium subpixel-antialiased size-4 flex items-center justify-center text-center rounded-full'
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

export const CartCount: React.FC<CartCountProps> = ({ openCart, className = '' }) => {
  const rootData = useLoaderData();

  return (
    <motion.div
      className={`rounded-full bg-logo-green ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95, opacity: 0.6 }}
      onClick={openCart}
    >
      <Suspense fallback={<Badge openCart={openCart} count={0} />}>
        <Await resolve={rootData?.cart}>
          {(cart) => (
            <Badge
              openCart={openCart}
              count={cart?.totalQuantity || 0}
            />
          )}
        </Await>
      </Suspense>
    </motion.div>
  );
};
