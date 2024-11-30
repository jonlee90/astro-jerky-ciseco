import clsx from 'clsx';
import ProductCard from './ProductCard';
import {getImageLoadingPriority} from '~/lib/const';
import {CommonProductCardFragment} from 'storefrontapi.generated';
import { Collection } from '@shopify/hydrogen/storefront-api-types';
import { motion, useInView, Variants } from 'framer-motion';

export function ProductsGrid({
  nodes,
  className = 'mt-8 lg:mt-10',
  isSmall = false,
  collection
}: {
  nodes?: CommonProductCardFragment[];
  className?: string;
  isSmall?: boolean;
  collection: Collection;
}) {
  const variantKey = isSmall ? 1 : 0;
  // Sort products so that available products come first
  return (
    <div
      className={clsx(
        'grid sm:grid-cols-2 lg:grid-cols-3 gap-x-28 gap-y-10 mx-5',
        className,
      )}
    >

      {nodes?.map((product, i) => {
          return (
            <motion.div
              key={i}
              initial={{ 
                opacity: i == 0 ?  1 : 0 , 
                y:  i == 0 ?  0 : 200
              }}
              whileInView={{ 
                opacity: 1,
                y: 0,
                transition: {
                  type: "spring",
                  bounce: 0.3,
                  duration: 0.5
                }
              }}
              viewport={{ once: true, amount: 0 }}
            >
              <ProductCard
                product={product}
                loading={getImageLoadingPriority(i)}
                variantKey={variantKey}
                collection={collection}
              />
            </motion.div>
          );
        })}
        <section aria-label="Collection Description" className=' sm:col-span-2 lg:col-span-3 mt-10'>
          <h3>High Protein {collection.title}</h3>
          <p className="block mt-4 text-neutral-500 dark:text-neutral-400 text-sm sm:text-base">
            {collection.description}
          </p>
        </section>
    </div>
  );
}
