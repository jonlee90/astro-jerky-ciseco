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
  showHeading?: boolean;
  classOverride?: string;
  isPacksPage?: boolean;
}

export function SnapGridProducts(props: Props) {
  const {
    heading_bold,
    sub_heading = '', 
    products = [],
    className = 'container',
    headingFontClass,
    showHeading = true,
    classOverride = 'grid grid-cols-2 lg:grid-cols-3 gap-5 md:gap-10 lg:gap-x-15 mx-5 xl:mx-0',
    isPacksPage = false,
  } = props;



  return (
    <div className={`nc-SectionGridProductCard ` + className}>
      {showHeading && (
        <>
          <Heading
            className={'mb-12 lg:mb-14 text-neutral-900 dark:text-neutral-50 mx-5 md:mx-10 xl:mx-0 text-center'}
            fontClass={headingFontClass}
            desc={sub_heading || ''}
          >
            {heading_bold}
          </Heading>
        </>
        )
      }
      <div
        className={clsx(
          classOverride
        )}
        role="list"
        aria-label="Product grid"
      >

      {products?.map((product, i) => {
          return (
            <>
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
                  showProductBadge={true}
                  className='gap-0'
                  showBadge={showHeading}
                  imageAspectRatio={isPacksPage  ? "aspect-[1/1]" : "aspect-[4/5]"}
                />
                
              {i == 0 && isPacksPage && (
                <div
                className="block mt-4 text-lg"
                >
                  <p className="mt-6">Start your flavor journey with our <strong data-start="442" data-end="458">Classic Pack</strong>, featuring three of our best-selling stars: <strong data-start="503" data-end="520">Sweet &amp; Spicy</strong>, <strong data-start="522" data-end="540">Honey Teriyaki</strong>, and <strong data-start="546" data-end="563">Supernova Hot</strong>. Whether you're into bold heat or crave that sweet-savory balance, this trio is a no-brainer for first-timers and jerky veterans alike.</p>
                </div>
              )}
              </motion.div>
            </>
          );
        })}

    </div>
    </div>
  );
}
