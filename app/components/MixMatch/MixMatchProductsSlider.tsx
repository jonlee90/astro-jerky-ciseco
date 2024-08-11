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
  id: number;
  title: string;
  description: string;
  bigQuantity: number;
  smallQuantity: number;
  price: string;
  msrp: string;
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
    <div className='mb-10'>
      <h2 className='text-xl md:text-2xl font-semibold'>{title}</h2>
      <div className="swimlane hiddenScroll gap-12 md:pb-8 md:scroll-px-8 lg:scroll-px-12 pt-4 text-center">
        {products.map((product, i) => (
          <MixMatchProductCard
            key={i}
            product={product}
            bigBags={bigBags}
            isSmall={isSmall}
            smallBags={smallBags}
            clickButton={clickButton}
            currentBundle={currentBundle}
          />
        ))}
      </div>
    </div>
  );
}
