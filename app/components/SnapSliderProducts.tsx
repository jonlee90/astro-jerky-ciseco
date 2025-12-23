import {useRef, useMemo} from 'react';
import useSnapSlider from '~/hooks/useSnapSlider';
import Heading from '~/components/Heading/Heading';
import ProductCard, {ProductCardSkeleton} from '~/components/ProductCard';
import {getImageLoadingPriority} from '~/lib/const';
import ProductCardLarge, {
  ProductCardLargeSkeleton,
} from '~/components/ProductCardLarge';
import clsx from 'clsx';
import {type ProductFragment} from 'storefrontapi.generated';
import NextPrevDesktop from './NextPrev/NextPrevDesktop';

const SKELETON_COUNT = 5;

export interface Props {
  heading_bold?: string | null;
  heading_light?: string | null;
  sub_heading?: string | null;
  products?: ProductFragment[] | null;
  cardStyle?: '1' | '2' | null;
  className?: string;
  headingFontClass?: string;
  isSkeleton?: boolean;
}

export function SnapSliderProducts(props: Props) {
  const {
    heading_bold,
    heading_light,
    sub_heading,
    products = [],
    cardStyle,
    className = 'container',
    headingFontClass,
    isSkeleton,
  } = props;

  const sliderRef = useRef<HTMLDivElement>(null);
  const {scrollToNextSlide, scrollToPrevSlide} = useSnapSlider({sliderRef});

  const Card = cardStyle === '2' ? ProductCardLarge : ProductCard;
  const CardSkeleton =
    cardStyle === '2' ? ProductCardLargeSkeleton : ProductCardSkeleton;

  const sortedProducts = useMemo(
    () =>
      products?.slice().sort((a, b) => {
        const aAvailable = a.variants?.nodes?.[0]?.availableForSale ?? false;
        const bAvailable = b.variants?.nodes?.[0]?.availableForSale ?? false;
        return aAvailable === bAvailable ? 0 : aAvailable ? -1 : 1;
      }),
    [products],
  );

  return (
    <div 
      className={`nc-SectionSliderProductCard relative ` + className}
      aria-live="polite"
    >
      <Heading
        className="mb-6 mx-5 md:mx-10 xl:mx-0 lg:mb-14 text-neutral-900 text-center justify-self-center" 
        desc={sub_heading || ''}
        rightDescText={heading_light || ''}
        fontClass={headingFontClass}
      >
        {heading_bold || ''}
      </Heading>
      <div
        ref={sliderRef}
        className="relative w-full flex gap-4 lg:gap-14 snap-x snap-mandatory overflow-x-auto scroll-p-l-container hiddenScrollbar"
        role="list"
        aria-label="Product slider"
      >
        <div className="w-0 px-3"></div>
        {isSkeleton &&
          Array.from({length: SKELETON_COUNT}, (_, index) => (
            <div
              key={index}
              className={clsx(
                `mySnapItem snap-start shrink-0 py-3`,
                cardStyle !== '2'
                  ? 'w-[17rem] lg:w-80 xl:w-[25%]'
                  : 'w-full sm:w-96 lg:w-[50%] xl:w-[33.33%]', // card style 2 large
              )}
              role="listitem"
            >
              <CardSkeleton index={index} className="w-full"  aria-hidden="true" />
            </div>
          ))}

        {!isSkeleton &&
          sortedProducts?.map((item, index) => (
            <div
              key={item.id}
              className={clsx(
                `mySnapItem snap-start shrink-0 py-3`,
                cardStyle !== '2'
                  ? 'w-[17rem] lg:w-80 xl:w-[25%] max-w-80'
                  : 'w-full sm:w-96 lg:w-[50%] xl:w-[33.33%]', // card style 2 large
              )}
              role="listitem"
            >
              <Card
                className="w-full"
                product={item}
                loading={getImageLoadingPriority(index)}
                showBadge={false}
              />
            </div>
          ))}
      </div>
          
      <NextPrevDesktop onClickNext={scrollToNextSlide} onClickPrev={scrollToPrevSlide} />
    </div>
  );
}
