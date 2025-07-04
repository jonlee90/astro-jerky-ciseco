import React from 'react';
import clsx from 'clsx';
import { flattenConnection, Image, Money, useMoney } from '@shopify/hydrogen';
import ProductSoldOut  from '../ProductSoldOut';
import { getProductPlaceholder } from '~/lib/placeholders';
import { motion } from 'framer-motion';
import { getProductIcon } from '../ProductCard';
import ProductLevelIndicator from '../ProductLevelIndicator';
import { getProductCategory } from '../ProductCard';
import { IconMinus, IconPlus } from '../Icon';
import { ButtonPressable } from '../Button/ButtonPressable';
import { OkendoStarRating } from '@okendo/shopify-hydrogen';

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
    onClick: () => clickButton(cardProduct, false, isSmall),
    'aria-label': `Remove one ${cardProduct.title} from the bundle`,
    className: 'border border-black'
  } : { 
    className: "cursor-not-allowed opacity-50",
    disabled: true,
    'aria-disabled': true,
    'aria-label': `Cannot remove ${cardProduct.title}, none added yet.`
   };

  const plusButtonProps = sumBags < currentQuantity && isAvailable ? {
    onClick: () => clickButton(cardProduct, true, isSmall),
    'aria-label': `Add one ${cardProduct.title} to the bundle`,
    className: 'border border-black'
  } : { 
    className: "cursor-not-allowed opacity-50",
    disabled: true,
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
            className="w-full uppercase text-xl font-bold text-center"
          >
            {cardProduct.title.replace(/beef jerky/gi, "")}
          </h2>
          <div className='text-center'>
            <OkendoStarRating
              productId={cardProduct?.product_id || ''}
              okendoStarRatingSnippet={cardProduct?.okendoStarRatingSnippet}
            /> 
          </div>
        </div>
        <div className=''>
          <ProductLevelIndicator product={product} size={25} levelClass={'h-1 w-3 mr-1'} labelClass='text-sm' /> {/* Render the icon based on tags */}
        </div>
        <div className="grid">
          <div className="flex gap-8 justify-between items-center">
            <ButtonPressable 
              {...negativeButtonProps}
              bgColor='white'
              size='size-10'
              aria-live="polite"
            >
              <IconMinus/>
            </ButtonPressable>
            <span 
              id={`quantity-${cardProduct.id}`}
              className="text-xl"
              aria-live="polite"
            >
              {quantity}
            </span>
            <ButtonPressable 
              {...plusButtonProps}
              bgColor='white'
              size='size-10'
              aria-live="polite"
            >
              <IconPlus />
            </ButtonPressable>
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
