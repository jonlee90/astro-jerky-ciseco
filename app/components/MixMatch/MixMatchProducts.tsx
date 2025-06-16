import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { SwitchTab } from '../Tabs';
import { AddToCartButton } from '../Button/AddToCartButton';
import { MixMatchProductsSlider } from './MixMatchProductsSlider';
import { useAside } from '../Aside';
import { ProductVariant } from '@shopify/hydrogen/storefront-api-types';
import { useAnalytics } from '@shopify/hydrogen';
const progressClass: { [key: number]: string } = {
  1: `grid-cols-1`,
  2: `grid-cols-2`,
  3: `grid-cols-3`,
  4: `grid-cols-4`,
  5: `grid-cols-5`,
  6: `grid-cols-6`,
  7: `grid-cols-7`,
  8: `grid-cols-8`,
  9: `grid-cols-9`,
  10: `grid-cols-10`,
  11: `grid-cols-11`,
  12: `grid-cols-12`,
};

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

interface MixMatchProductsProps {
  bigProducts: Product[];
  smallProducts: Product[];
  currentBundle: BundlePack;
  bundleProducts: Product[];
}

export function MixMatchProducts({ bigProducts, smallProducts, currentBundle, bundleProducts }: MixMatchProductsProps) {
  const {open} = useAside();
  const analytics = useAnalytics();
  const [bigBags, setBigBags] = useState(bigProducts);
  const [smallBags, setSmallBags] = useState(smallProducts);
  const { big_bag_quantity, small_bag_quantity, id} = currentBundle;
  const [isSmall, setIsSmall] = useState(big_bag_quantity === 0);
  const sumBigBags = bigBags.reduce((acc, o) => acc + o.quantity, 0);
  const sumSmallBags = smallBags.reduce((acc, o) => acc + o.quantity, 0);
  const done = big_bag_quantity === sumBigBags && small_bag_quantity === sumSmallBags;


  const cartArray: { merchandiseId: string; quantity: number; selectedVariant: Product; attributes: Array<Object>}[] = [];
  if (done) {
    /*
    bigBags.forEach((item) => {
      cartArray.push({
        merchandiseId: item.id,
        quantity: item.quantity,
        selectedVariant: item,
        attributes: []
      });
    });
    smallBags.forEach((item) => {
      cartArray.push({
        merchandiseId: item.id,
        quantity: item.quantity,
        selectedVariant: item,
        attributes: []
      });
    });
*/
    const allBags = [...smallBags, ...bigBags];
    cartArray.push({
      merchandiseId: id,
      quantity: 1,
      selectedVariant: bundleProducts[0],
      attributes: allBags.filter((item) => item.quantity) // Filter out items with no quantity
                          .map((item) => ({
                            key: item.title + ' ' + item.size,
                            value: item.quantity.toString()
                          }))
    });
  }

  const productsArr = isSmall ? smallBags : bigBags;
  const filterArrByTag = (tag: string) => productsArr.filter((product) => product.tags.includes(tag));
  const bundleInfoProducts = [
    {
      title: 'BEST SELLERS',
      productsArr: filterArrByTag('best_sellers'),
    },
    {
      title: 'HOT & SPICY',
      productsArr: filterArrByTag('hot-spicy'),
    },
    {
      title: 'BBQ',
      productsArr: filterArrByTag('bbq'),
    },
    {
      title: 'PEPPERED',
      productsArr: filterArrByTag('peppered'),
    },
    {
      title: 'CHICKEN',
      productsArr: filterArrByTag('chicken-jerky'),
    },
  ];

  const onToggle = (value: string) => {
    if (big_bag_quantity && small_bag_quantity) {
      setIsSmall(value === 'small');
    }
  };

  const clickButton = (product: Product, add: boolean, isSmall: boolean) => {
    if (add) {
      if (isSmall) {
        setSmallBags(
          smallBags.map((item) => {
            if (item.id === product.id) {
              return { ...item, quantity: item.quantity + 1 };
            } else {
              return item;
            }
          })
        );
      } else {
        if (sumBigBags + 1 === big_bag_quantity && small_bag_quantity) {
          setIsSmall(true);
        }
        setBigBags(
          bigBags.map((item) => {
            if (item.id === product.id) {
              return { ...item, quantity: item.quantity + 1 };
            } else {
              return item;
            }
          })
        );
      }
    } else {
      if (isSmall) {
        setSmallBags(
          smallBags.map((item) => {
            if (item.id === product.id) {
              return { ...item, quantity: item.quantity - 1 };
            } else {
              return item;
            }
          })
        );
      } else {
        setBigBags(
          bigBags.map((item) => {
            if (item.id === product.id) {
              return { ...item, quantity: item.quantity - 1 };
            } else {
              return item;
            }
          })
        );
      }
    }
  };

  const getProgressBar = (count: number, currentCount: number) => {
    const bars = [];
    for (let i = 0; i < count; i++) {
      bars.push(
        <motion.div 
          key={i} 
          className={`border border-gray-300 mix-match-progress-bar ${i < currentCount && 'bg-logo-yellow'}`}
          role="progressbar"
          aria-valuenow={i < currentCount ? i + 1 : 0}
          aria-valuemin={0}
          aria-valuemax={count}
          ></motion.div>
      );
    }
    return bars;
  };

  const handleAddToCart = () => {
    if (!done) return;
    
    // First send the bundle-specific analytics event
    const bundleItems = [...bigBags, ...smallBags].filter(item => item.quantity > 0);
    
    // Publish to the analytics system
    analytics.publish('custom_bundle_added_to_cart', {
      bundle: currentBundle,
      items: bundleItems,
      totalValue: parseFloat(currentBundle.price || "0"),
    });
    
    // Then open the cart
    open('cart');
  };

  return (
    <div className="mb-36">
      <header
        role="banner"
        className={`bg-[#fafaf9] sticky transition top-0 w-full justify-center px-5 py-2 text-center shadow-lightHeader rounded-b-lg z-100`}
        aria-label="Mix and Match Product Selection"
      >
        <div className="max-w-screen-md mx-auto">
          <div className="grid grid-cols-2 my-3">
            <div className="text-left">
              <h1 className="text-xl font-bold">{currentBundle.title}</h1>
            </div>
            <div className="text-right self-center justify-end flex-row-reverse">
              {done || !(big_bag_quantity && small_bag_quantity) ? (
                <AddToCartButton
                  className="relative p-[3px]"
                  lines={cartArray}
                  variant="primary"
                  data-test="add-to-cart"
                  disabled={!done}
                  onClick={handleAddToCart}
                  aria-label="Add completed bundle to cart"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-300 to-primary-500 rounded-full" />
                  <div className="px-8 py-2  bg-black rounded-full relative group transition duration-200 text-white hover:bg-transparent">
                    Add To Cart
                  </div>
                  
                </AddToCartButton>
              ) : (
                <SwitchTab 
                  isSmall={isSmall} 
                  onToggle={(val) => onToggle(val)} 
                  className="!ml-auto !mr-0 h-11"
                  aria-label="Switch between big bags and small bags"
                />
              )}
            </div>
          </div>
          <div className="text-left text-sm">
            {big_bag_quantity ? (
              <div className={isSmall ? 'opacity-70' : 'font-bold'}>
                <motion.div aria-live="polite">{big_bag_quantity} BIG BAGS</motion.div>
                <motion.div className={clsx('grid h-2 rounded-full', progressClass[big_bag_quantity])}>
                  {getProgressBar(big_bag_quantity, sumBigBags)}
                </motion.div>
              </div>
            ) : (
              ''
            )}
            {small_bag_quantity ? (
              <div className={`${isSmall ? 'font-bold' : 'opacity-70'} mt-2`}>
                <motion.div aria-live="polite">{small_bag_quantity} SMALL BAGS</motion.div>
                <motion.div className={clsx('grid h-2 rounded-full', progressClass[small_bag_quantity])}>
                  {getProgressBar(small_bag_quantity, sumSmallBags)}
                </motion.div>
              </div>
            ) : (
              ''
            )}
          </div>
        </div>
      </header>
      <div className="max-w-screen-lg mx-auto mt-8 w-full" role="main">
        {bundleInfoProducts.map(({ title, productsArr }, i) => (
          <MixMatchProductsSlider
            key={i}
            title={title}
            products={productsArr}
            isSmall={isSmall}
            bigBags={bigBags}
            smallBags={smallBags}
            clickButton={clickButton}
            currentBundle={currentBundle}
          />
        ))}
      </div>
    </div>
  );
}
