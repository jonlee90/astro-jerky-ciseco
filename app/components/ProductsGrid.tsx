import clsx from 'clsx';
import ProductCard from './ProductCard';
import {getImageLoadingPriority} from '~/lib/const';
import {ProductFragment} from 'storefrontapi.generated';
import { Collection } from '@shopify/hydrogen/storefront-api-types';
import { motion, useInView, Variants } from 'framer-motion';

export function ProductsGrid({
  nodes,
  className = 'mt-8 lg:mt-10',
  isSmall = false,
  collection,
  classOverride = 'grid sm:grid-cols-2 lg:grid-cols-3 gap-x-28 gap-y-10 mx-5',
}: {
  nodes?: ProductFragment[];
  className?: string;
  isSmall?: boolean;
  collection: Collection;
  classOverride?: string;
}) {
  const variantKey = isSmall ? 1 : 0;
  // Sort products so that available products come first
  return (
    <div
      className={clsx(
        classOverride,
        className,
      )}
      id="product-grid"
      tabIndex={-1}
      aria-describedby="product-grid-description"
    >
      <p id="product-grid-description" className="sr-only">
        Use Tab to navigate through the products.
      </p>
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
                tabIndex={-1}
                product={product}
                loading={getImageLoadingPriority(i)}
                variantKey={variantKey}
                collection={collection}
              />
            </motion.div>
          );
        })}
    </div>
  );
}
