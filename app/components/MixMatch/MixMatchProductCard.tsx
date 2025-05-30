import React from 'react';
import clsx from 'clsx';
import { flattenConnection, Image, Money, useMoney } from '@shopify/hydrogen';
import ProductSoldOut  from '../ProductSoldOut';
import { getProductPlaceholder } from '~/lib/placeholders';
import { motion } from 'framer-motion';
import { getProductIcon } from '../ProductCard';
import ProductLevelIndicator from '../ProductLevelIndicator';
import { getProductCategory } from '../ProductCard';

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

interface MixMatchProductCardProps {
  product: Product;
  loading?: HTMLImageElement['loading'];
  isSmall: boolean;
  bigBags: Product[];
  smallBags: Product[];
  clickButton: (product: Product, add: boolean, isSmall: boolean) => void;
  currentBundle: BundlePack;
}

export function MixMatchProductCard({
  product,
  loading,
  isSmall,
  bigBags,
  smallBags,
  clickButton,
  currentBundle,
}: MixMatchProductCardProps) {
  const cardProduct = product || getProductPlaceholder();
  const { big_bag_quantity, small_bag_quantity } = currentBundle;
  const currentQuantity = isSmall ? small_bag_quantity : big_bag_quantity;
  const productsArr = isSmall ? smallBags : bigBags;
  const { image } = cardProduct;
  const { quantity } = productsArr.find((item) => item.id === cardProduct.id) || { quantity: 0 };
  const sumBags = productsArr.reduce((acc, o) => acc + o.quantity, 0);
  const isAvailable = cardProduct.availableForSale;

  const negativeButtonProps = quantity > 0 && isAvailable ? {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 },
    onClick: () => clickButton(cardProduct, false, isSmall),
    'aria-label': `Remove one ${cardProduct.title} from the bundle`
  } : { 
    className: "cursor-not-allowed opacity-50",
    'aria-disabled': true,
    'aria-label': `Cannot remove ${cardProduct.title}, none added yet.`
   };

  const plusButtonProps = sumBags < currentQuantity && isAvailable ? {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 },
    onClick: () => clickButton(cardProduct, true, isSmall),
    'aria-label': `Add one ${cardProduct.title} to the bundle`,
  } : { 
    className: "cursor-not-allowed opacity-50",
    'aria-disabled': true,
    'aria-label': `Cannot add more ${cardProduct.title}, limit reached.`,
  };
  return (
    <motion.div 
      className={clsx('mySnapItem snap-start shrink-0 py-3 w-52', { 'cursor-not-allowed opacity-50': !isAvailable })}
      role="group"
      aria-labelledby={`product-title-${cardProduct.title}`}
    >
      <div className='grid gap-3'>
        <div className="card-image aspect-[4/5] bg-primary/5 rounded-2xl">
          {image && (
            <Image
              className="object-cover w-full fadeIn"
              sizes="(min-width: 64em) 25vw, (min-width: 48em) 30vw, 45vw"
              aspectRatio="4/5"
              data={image}
              alt={image.altText || `Picture of ${cardProduct.title}`}
              loading={loading}
            />
          )}
          {!isAvailable && (
            <ProductSoldOut/>
          )}
        </div>
        <div>
          <div className='flex flex-row justify-between text-gray-600 text-base'>
            <h2 className="italic">{getProductCategory(product)}</h2>
            <p className=''>{cardProduct.size}</p>
          </div>
          <h2
            id={`card-title-${cardProduct.id}`}
            className="w-full uppercase text-xl font-bold text-left"
          >
            {cardProduct.title.replace(/beef jerky/gi, "")}
          </h2>
        </div>
        <div className=''>
          <ProductLevelIndicator product={product} size={25} levelClass={'h-1 w-3 mr-1'} labelClass='text-sm' /> {/* Render the icon based on tags */}
        </div>
        <div className="grid">
          <div className="flex gap-8 justify-between items-center">
            <motion.button 
              {...negativeButtonProps}
              type="button"
              aria-live="polite"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" className="size-10" viewBox="0 0 24 24" role="img">
                <path fill="black" fillRule="evenodd" d="M12 1.25C6.063 1.25 1.25 6.063 1.25 12S6.063 22.75 12 22.75S22.75 17.937 22.75 12S17.937 1.25 12 1.25m-4 10a.75.75 0 0 0 0 1.5h8a.75.75 0 0 0 0-1.5z" clipRule="evenodd" />
              </svg>
            </motion.button>
            <span 
              id={`quantity-${cardProduct.id}`}
              className="text-xl"
              aria-live="polite"
            >
              {quantity}
            </span>
            <motion.button 
              {...plusButtonProps}
              type="button"
              aria-live="polite"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" className="size-10" viewBox="0 0 24 24" role="img">
                <path fill="black" fillRule="evenodd" d="M12 1.25C6.063 1.25 1.25 6.063 1.25 12S6.063 22.75 12 22.75S22.75 17.937 22.75 12S17.937 1.25 12 1.25M12.75 8a.75.75 0 0 0-1.5 0v3.25H8a.75.75 0 0 0 0 1.5h3.25V16a.75.75 0 0 0 1.5 0v-3.25H16a.75.75 0 0 0 0-1.5h-3.25z" clipRule="evenodd" />
              </svg>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/** @typedef {import('@shopify/hydrogen').ShopifyAnalyticsProduct} ShopifyAnalyticsProduct */
/** @typedef {import('@shopify/hydrogen/storefront-api-types').MoneyV2} MoneyV2 */
/** @typedef {import('@shopify/hydrogen/storefront-api-types').Product} Product */
/** @typedef {import('storefrontapi.generated').ProductCardFragment} ProductCardFragment */
