import {useRef} from 'react';
import useSnapSlider from '~/hooks/useSnapSlider';
import Heading from '~/components/Heading/Heading';
import ProductCard, {ProductCardSkeleton} from '~/components/ProductCard';
import {getImageLoadingPriority} from '~/lib/const';
import ProductCardLarge, {
  ProductCardLargeSkeleton,
} from '~/components/ProductCardLarge';
import clsx from 'clsx';
import {type CommonProductCardFragment} from 'storefrontapi.generated';
import { ProductsGrid } from './ProductsGrid';
import { motion } from 'framer-motion';

export interface Props {
  heading_bold?: string | null;
  heading_light?: string | null;
  sub_heading?: string | null;
  products?: any[] | null;
  cardStyle?: '1' | '2' | null;
  className?: string;
  headingFontClass?: string;
  isSkeleton?: boolean;
}

export function SnapGridProducts(props: Props) {
  const {
    heading_bold,
    products = [],
    className = 'container',
    headingFontClass,
  } = props;



  return (
    <div className={`nc-SectionGridProductCard ` + className}>
      <Heading
        className={'mb-12 lg:mb-14 text-neutral-900 dark:text-neutral-50 mx-5 md:mx-10 xl:mx-0 '}
        fontClass={headingFontClass}
      >
        {heading_bold}
      </Heading>
      <div
        className={clsx(
          'grid grid-cols-2 lg:grid-cols-3 gap-5 md:gap-10 lg:gap-x-15 mx-5 xl:mx-0'
        )}
        role="list"
        aria-label="Product grid"
      >

      {products?.map((product, i) => {
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
              role="listitem"
            >
              <ProductCard
                product={product}
                loading={getImageLoadingPriority(i)}
                variantKey={0}
                transition={false}
              />
            </motion.div>
          );
        })}
    </div>
    </div>
  );
}
