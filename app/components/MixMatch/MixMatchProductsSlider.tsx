import { useRef } from 'react';
import { MixMatchProductCard } from './MixMatchProductCard';
import NextPrevDesktop from '../NextPrev/NextPrevDesktop';
import useSnapSlider from '~/hooks/useSnapSlider';

interface Product {
  id: string;
  product_id?: string;
  availableForSale: boolean;
  image: any;
  handle: string;
  quantity: number;
  title: string;
  tags: string[];
  description: string;
  media: any[];
  size: string;
  okendoStarRatingSnippet?: any;
  flavor_level?: { value: string };
  heat_level?: { value: string };
  sweetness_level?: { value: string };
  dryness_level?: { value: string };
}

interface BundlePack {
  id: string;
  availableForSale: boolean;
  image: any;
  handle: string;
  quantity: number;
  title: string;
  tags: string[];
  description: string;
  media: any[];
  size: string;
  flavor_level?: { value: string };
  price: string;
  compareAtPrice: string;
  small_bag_quantity: number;
  big_bag_quantity: number;
}

interface MixMatchProductsSliderProps {
  title: string;
  products: Product[];
  isSmall: boolean;
  bigBags: Product[];
  smallBags: Product[];
  clickButton: (product: Product, add: boolean, isSmall: boolean) => void;
  currentBundle: BundlePack;
}

export function MixMatchProductsSlider({
  title,
  products = [],
  isSmall,
  bigBags,
  smallBags,
  clickButton,
  currentBundle,
}: MixMatchProductsSliderProps) {
  const sortedProducts = products.slice().sort((a, b) => {
    if (a.availableForSale === b.availableForSale) {
      return 0;
    }
    return a.availableForSale ? -1 : 1;
  });

  const sliderRef = useRef<HTMLDivElement>(null);

  const { scrollToNextSlide, scrollToPrevSlide } = useSnapSlider({ sliderRef });

  return (
    <section
      className='mb-10 relative'
      aria-labelledby={`slider-title-${title.replace(/\s+/g, '-').toLowerCase()}`}
    >
      <h2
        id={`slider-title-${title.replace(/\s+/g, '-').toLowerCase()}`}
        className='text-xl md:text-2xl font-semibold px-5'
      >
        {title}
      </h2>
      <div
        ref={sliderRef}
        className="relative w-full flex px-5 gap-4 lg:gap-8 snap-x snap-mandatory overflow-x-auto scroll-p-l-container hiddenScrollbar"
        role="list"
        aria-label={`Product slider for ${title}`}
        tabIndex={0}
      >
        {sortedProducts.map((product, i) => (
          <MixMatchProductCard
            key={product.id}
            product={product}
            bigBags={bigBags}
            isSmall={isSmall}
            smallBags={smallBags}
            clickButton={clickButton}
            currentBundle={currentBundle}
          />
        ))}
      </div>
      {sortedProducts.length > 4 && (
        <NextPrevDesktop onClickNext={scrollToNextSlide} onClickPrev={scrollToPrevSlide} />
      )}
    </section>
  );
}
