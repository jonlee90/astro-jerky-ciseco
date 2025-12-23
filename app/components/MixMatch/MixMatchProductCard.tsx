import clsx from 'clsx';
import { Image } from '@shopify/hydrogen';
import ProductSoldOut from '../ProductSoldOut';
import { getProductPlaceholder } from '~/lib/placeholders';
import { motion } from 'framer-motion';
import { getProductCategory } from '../ProductCard';
import ProductLevelIndicator from '../ProductLevelIndicator';
import { IconMinus, IconPlus } from '../Icon';
import { ButtonPressable } from '../Button/ButtonPressable';
import { OkendoStarRating } from '@okendo/shopify-hydrogen';

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

  const canRemove = quantity > 0 && isAvailable;
  const canAdd = sumBags < currentQuantity && isAvailable;

  const negativeButtonProps = canRemove ? {
    onClick: () => clickButton(cardProduct, false, isSmall),
    'aria-label': `Remove one ${cardProduct.title} from the bundle`,
    className: 'border border-black',
    disabled: false
  } : {
    className: "cursor-not-allowed opacity-50",
    disabled: true,
    'aria-label': `Cannot remove ${cardProduct.title}, none added yet.`
  };

  const plusButtonProps = canAdd ? {
    onClick: () => clickButton(cardProduct, true, isSmall),
    'aria-label': `Add one ${cardProduct.title} to the bundle`,
    className: 'border border-black',
    disabled: false
  } : {
    className: "cursor-not-allowed opacity-50",
    disabled: true,
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
            <p className="italic">{getProductCategory(product)}</p>
            <p>{cardProduct.size}</p>
          </div>
          <h2
            id={`card-title-${cardProduct.id}`}
            className="w-full uppercase text-xl font-bold text-center"
          >
            {cardProduct.title.replace(/beef jerky/gi, "")}
          </h2>
          <div className='text-center'>
            <OkendoStarRating
              productId={cardProduct.product_id || ''}
              okendoStarRatingSnippet={cardProduct.okendoStarRatingSnippet}
            />
          </div>
        </div>
        <div>
          <ProductLevelIndicator product={product} size={25} levelClass={'h-1 w-3 mr-1'} labelClass='text-sm' />
        </div>
        <div className="grid">
          <div className="flex gap-8 justify-between items-center">
            <ButtonPressable
              {...negativeButtonProps}
              bgColor='white'
              size='size-10'
            >
              <IconMinus />
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
