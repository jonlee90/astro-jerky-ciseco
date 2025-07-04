import React, { useRef, useState, useEffect } from 'react';
import { MixMatchProductCard } from './MixMatchProductCard';
import { motion } from 'framer-motion';
import NextPrevDesktop  from '../NextPrev/NextPrevDesktop';
import useSnapSlider from '~/hooks/useSnapSlider';

interface Product {
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
  flavor_level: string;
  price: string;
  compareAtPrice: string;
  small_bag_quantity: any;
  big_bag_quantity: any;
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
  const sortedProducts = products?.slice().sort((a, b) => {
    const aAvailable = a.availableForSale;
    const bAvailable = b.availableForSale;
    return aAvailable === bAvailable ? 0 : aAvailable ? -1 : 1;
  });

  const sliderRef = useRef<HTMLDivElement>(null);

  const {scrollToNextSlide, scrollToPrevSlide} = useSnapSlider({sliderRef});

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
        tabIndex={0} // Makes the scrollable area keyboard focusable
      >
        {sortedProducts.map((product, i) => (
          <MixMatchProductCard
            key={product.id || i}
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
