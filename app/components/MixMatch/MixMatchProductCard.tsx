import React from 'react';
import clsx from 'clsx';
import { flattenConnection, Image, Money, useMoney } from '@shopify/hydrogen';
import { Modal } from '../Modal';
import { IconMinus } from '../Icon';
import { IconAdd } from '../Icon';
import { isDiscounted, isNewArrival } from '~/lib/utils';
import { getProductPlaceholder } from '~/lib/placeholders';
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
  const { bigQuantity, smallQuantity } = currentBundle;
  const currentQuantity = isSmall ? smallQuantity : bigQuantity;
  const productsArr = isSmall ? smallBags : bigBags;
  const { image } = cardProduct;
  const { quantity } = productsArr.find((item) => item.id === cardProduct.id) || { quantity: 0 };
  const sumBags = productsArr.reduce((acc, o) => acc + o.quantity, 0);
  const isAvailable = cardProduct.availableForSale;

  const negativeButtonProps = quantity > 0 && isAvailable ? {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 },
    onClick: () => clickButton(cardProduct, false, isSmall)
  } : { className: "cursor-not-allowed opacity-50" };

  const plusButtonProps = sumBags < currentQuantity && isAvailable ? {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 },
    onClick: () => clickButton(cardProduct, true, isSmall)
  } : { className: "cursor-not-allowed opacity-50" };

  return (
    <motion.div className={clsx('flex flex-col gap-2 w-40 md:w-52', { 'cursor-not-allowed opacity-50': !isAvailable })}>
      <div className='grid gap-2'>
        <div className='grid gap-2'>
          <div className="card-image aspect-[4/5] bg-primary/5">
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
          </div>
          <h2
            className="w-full uppercase text-copy text-left"
          >
            {cardProduct.title + ' (' + cardProduct.size + ')'}
          </h2>
        </div>
        <div className="grid">
          <div className="flex gap-8 justify-center items-center">
            <motion.button {...negativeButtonProps}>
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" className="size-10" viewBox="0 0 24 24">
                <path fill="black" fillRule="evenodd" d="M12 1.25C6.063 1.25 1.25 6.063 1.25 12S6.063 22.75 12 22.75S22.75 17.937 22.75 12S17.937 1.25 12 1.25m-4 10a.75.75 0 0 0 0 1.5h8a.75.75 0 0 0 0-1.5z" clipRule="evenodd" />
              </svg>
            </motion.button>
            <span className="text-xl">{quantity}</span>
            <motion.button {...plusButtonProps}>
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" className="size-10" viewBox="0 0 24 24">
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
