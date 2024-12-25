import React, { useRef, useState, useEffect } from 'react';
import { MixMatchProductCard } from './MixMatchProductCard';
import { motion } from 'framer-motion';

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
  return (
    <section 
      className='mb-10'
      aria-labelledby={`slider-title-${title.replace(/\s+/g, '-').toLowerCase()}`}
    >
      <h2 
        id={`slider-title-${title.replace(/\s+/g, '-').toLowerCase()}`}
        className='text-xl md:text-2xl font-semibold px-5'
      >
        {title}
      </h2>
      <div 
        className="swimlane hiddenScroll  md:pb-8 md:scroll-px-8 lg:scroll-px-12 pt-4 text-center px-5"
        role="region"
        aria-label={`Product slider for ${title}`}
        tabIndex={0} // Makes the scrollable area keyboard focusable
      >
        {products.map((product, i) => (
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
    </section>
  );
}
