import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { SwitchTab } from '../Tabs/SwtchTab';
import { AddToCartButton } from '../AddToCartButton';
import { MixMatchProductsSlider } from './MixMatchProductsSlider';
import { useAside } from '../Aside';
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
  id: number;
  title: string;
  description: string;
  bigQuantity: number;
  smallQuantity: number;
  price: string;
  msrp: string;
}

interface MixMatchProductsProps {
  bigProducts: Product[];
  smallProducts: Product[];
  currentBundle: BundlePack;
}

export function MixMatchProducts({ bigProducts, smallProducts, currentBundle }: MixMatchProductsProps) {
  const {open} = useAside();
  const [bigBags, setBigBags] = useState(bigProducts);
  const [smallBags, setSmallBags] = useState(smallProducts);
  const { bigQuantity, smallQuantity } = currentBundle;
  const [isSmall, setIsSmall] = useState(bigQuantity === 0);
  const sumBigBags = bigBags.reduce((acc, o) => acc + o.quantity, 0);
  const sumSmallBags = smallBags.reduce((acc, o) => acc + o.quantity, 0);
  const done = bigQuantity === sumBigBags && smallQuantity === sumSmallBags;

  const cartArray: { merchandiseId: string; quantity: number; selectedVariant: Product; }[] = [];
  if (done) {
    bigBags.forEach((item) => {
      cartArray.push({
        merchandiseId: item.id,
        quantity: item.quantity,
        selectedVariant: item
      });
    });
    smallBags.forEach((item) => {
      cartArray.push({
        merchandiseId: item.id,
        quantity: item.quantity,
        selectedVariant: item
      });
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
      title: 'CHICKEN',
      productsArr: filterArrByTag('chicken'),
    },
    {
      title: 'PEPPERED',
      productsArr: filterArrByTag('peppered'),
    },
  ];

  const onToggle = (value: string) => {
    if (bigQuantity && smallQuantity) {
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
        if (sumBigBags + 1 === bigQuantity && smallQuantity) {
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
        <motion.div key={i} className={`border border-gray-300 mix-match-progress-bar ${i < currentCount && 'bg-logo-green'}`}></motion.div>
      );
    }
    return bars;
  };

  const analyticsData = {
    products: cartArray.map((item) => ({
      productGid: item.merchandiseId,
      quantity: item.quantity,
    })),
    totalValue: cartArray.reduce((total, item) => total + item.quantity, 0), // Assuming each item has a price of 1 for simplicity
  };

  return (
    <div className="mb-36">
      <header
        role="banner"
        className={`bg-[#fafaf9] sticky transition top-0 w-full justify-center px-5 py-2 text-center header-shadow rounded-b-lg z-40`}
      >
        <div className="max-w-screen-md mx-auto">
          <div className="grid grid-cols-2 my-3">
            <div className="text-left">
              <h1 className="text-lead">{currentBundle.title}</h1>
            </div>
            <div className="text-right self-center justify-end flex-row-reverse">
              {done || !(bigQuantity && smallQuantity) ? (
                <AddToCartButton
                  className="px-4 py-3 rounded-full w-[166px] relative bg-logo-red text-white text-sm shadow-2xl transition duration-200 border-red-500 disabled:opacity-50 disabled:pointer-events-none"
                  lines={cartArray}
                  variant="primary"
                  data-test="add-to-cart"
                  analytics={analyticsData}
                  disabled={!done}
                  onClick={() => open('cart')}
                >
                  Add To Cart
                </AddToCartButton>
              ) : (
                <SwitchTab isSmall={isSmall} onToggle={(val) => onToggle(val)} className="!ml-auto !mr-0" />
              )}
            </div>
          </div>
          <div className="text-left text-xs">
            {bigQuantity ? (
              <div className={isSmall ? 'opacity-70' : 'font-bold'}>
                <motion.div>{bigQuantity} BIG BAGS</motion.div>
                <motion.div className={clsx('grid h-2 rounded-full', progressClass[bigQuantity])}>
                  {getProgressBar(bigQuantity, sumBigBags)}
                </motion.div>
              </div>
            ) : (
              ''
            )}
            {smallQuantity ? (
              <div className={`${isSmall ? 'font-bold' : 'opacity-70'} mt-2`}>
                <motion.div>{smallQuantity} SMALL BAGS</motion.div>
                <motion.div className={clsx('grid h-2 rounded-full', progressClass[smallQuantity])}>
                  {getProgressBar(smallQuantity, sumSmallBags)}
                </motion.div>
              </div>
            ) : (
              ''
            )}
          </div>
        </div>
      </header>
      <div className="max-w-screen-lg mx-auto mt-8 container">
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
        {/*<motion.button
          className="sticky bottom-5 left-1/2 transform -translate-x-1/2 z-50 border border-black "
        >
          Add Small Bags
              </motion.button>*/}
      </div>
    </div>
  );
}
