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
import NextPrev from './NextPrev/NextPrev';
import NextPrevDesktop from './NextPrev/NextPrevDesktop';

export interface Props {
  heading_bold?: string | null;
  heading_light?: string | null;
  sub_heading?: string | null;
  products?: CommonProductCardFragment[] | null;
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

  return (
    <div 
      className={`nc-SectionSliderProductCard relative ` + className}
      aria-live="polite"
    >
      <Heading
        className={'mb-8 text-neutral-900 dark:text-neutral-50 px-4 md:justify-center'}
        fontClass={headingFontClass}
        rightDescText={heading_light}
      >
        {heading_bold}
      </Heading>
      <div
        ref={sliderRef}
        className="relative w-full flex gap-4 lg:gap-14 snap-x snap-mandatory overflow-x-auto scroll-p-l-container hiddenScrollbar"
        role="list"
        aria-label="Product slider"
      >
        <div className="w-0 px-3"></div>
        {isSkeleton &&
          [1, 1, 1, 1, 1].map((_, index) => (
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
          products?.map((item, index) => (
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
              />
            </div>
          ))}
      </div>
          
      <NextPrevDesktop onClickNext={scrollToNextSlide} onClickPrev={scrollToPrevSlide} />
    </div>
  );
}
