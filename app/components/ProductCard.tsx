import clsx from 'clsx';
import {type FC} from 'react';
import {useState, useEffect, useRef} from 'react';
import {flattenConnection, Image, Money, useMoney} from '@shopify/hydrogen';
import ButtonSecondary from './Button/ButtonSecondary';
import {type ProductFragment} from 'storefrontapi.generated';
import {useGetPublicStoreCdnStaticUrlFromRootLoaderData} from '~/hooks/useGetPublicStoreCdnStaticUrlFromRootLoaderData';
import {AddToCartButton} from './Button/AddToCartButton';
import {Link} from './Link';
import Prices from './Prices';
import {isDiscounted, isNewArrival} from '~/lib/utils';
import {getProductPlaceholder} from '~/lib/placeholders';
import {motion, useAnimationControls} from 'framer-motion';
import {getThumbnailSkeletonByIndex} from './ThumbnailSkeletons';
import ProductStatus from './ProductStatus';
import {useMediaQuery} from 'react-responsive';
import { useAside } from './Aside';
import { useVariantUrl } from '~/lib/variants';
import { IconSpicy, IconBbq, IconChicken, IconPepper, IconCow, IconHoney, IconPlus } from "./Icon";
import {OkendoStarRating} from '@okendo/shopify-hydrogen';
import ProductSoldOut from './ProductSoldOut';
import ProductLevelIndicator from './ProductLevelIndicator';
import { ButtonPressable } from './Button/ButtonPressable';
import { AddToCartPressable } from './Button/AddToCartPressableButton';


interface MoneyV2 {
  amount: string;
  currencyCode: string;
}

interface ProductCardProps {
  product: ProductFragment;
  collection?: string;
  className?: string;
  loading?: HTMLImageElement['loading'];
  quickAdd?: boolean;
  variantKey?: number;
  transition?: boolean;
  showBadge?: boolean;
  showProductBadge?: boolean;
  showLevelIndicator?: boolean;
  imageAspectRatio?: string;
}

/**
 * @param {{
 *   product: ProductCardFragment;
 *   collection: Collection;
 *   className?: string;
 *   loading?: HTMLImageElement['loading'];
 *   quickAdd?: boolean;
 *   transition?: boolean;
 *   showBadge?: boolean;
 *   showProductBadge?: boolean;
 *   showLevelIndicator?: boolean;
 *   imageAspectRatio?: string;
 * }}
 */
const ProductCard: FC<ProductCardProps> = ({
  product,
  collection,
  className,
  loading,
  quickAdd = true,
  variantKey = 0,
  transition = true,
  showBadge = true,
  showProductBadge = true,
  showLevelIndicator = true,
  imageAspectRatio = 'aspect-[4/5]',
}: ProductCardProps) => {

  const {open} = useAside();
  const cardProduct = product?.variants ? product : getProductPlaceholder();
  if (!cardProduct?.variants?.nodes?.length) return null;
  const firstVariant = flattenConnection(cardProduct.variants)[variantKey];
  if (!firstVariant) return null;
  const variantUrl = useVariantUrl(
    product.handle,
    firstVariant.selectedOptions,
  );
  const productMedia = flattenConnection(cardProduct.images);
  const {selectedOptions} = firstVariant;
  const isAvailable = firstVariant.availableForSale;

  const productAnalytics = {
    productGid: product.id,
    variantGid: firstVariant.id,
    name: product.title,
    variantName: firstVariant.title,
    brand: product.vendor,
    price: firstVariant.price.amount,
    quantity: 1,
  };

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const isDesktop = useMediaQuery({minWidth: 767});

  const intervalDuration = 2000; // 2 seconds per image
  const totalDuration = intervalDuration * productMedia.length; // Total duration for all images to display
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.intersectionRatio >= 0.9);
      },
      {threshold: [0, 0.9]},
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isInView) {
      setCurrentImageIndex(0);
      return;
    }

    if ((!isHovered && isDesktop) || !transition) {
      setCurrentImageIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % productMedia.length);
    }, intervalDuration);

    return () => clearInterval(interval);
  }, [isInView, isHovered, isDesktop, productMedia.length, intervalDuration]);

  const isSale =
  product.compareAtPriceRange.minVariantPrice &&
  firstVariant.price &&
    Number(product.compareAtPriceRange.minVariantPrice.amount) >
      Number(firstVariant.price.amount);
  return ( 
    <motion.div 
      className='flex flex-col gap-2 relative'
      whileHover={{scale: 1.02}} 
      role="region"
      aria-labelledby={`product-title-${product.handle}`}
      >
      <Link
        to={variantUrl}
        state={{product: product.handle, collection}}
        className="group"
        aria-label={`View details for ${product.title} (${selectedOptions[0].value})`}
      >
        <div className={clsx('grid gap-4', className)}>
          <motion.div
            ref={cardRef}
            className={"card-image pb-1 rounded-2xl " + imageAspectRatio}
            role="img"
            aria-label={product.title}
            onMouseEnter={() => {
              if (isDesktop || !transition) {
                setIsHovered(true);
                setIsInView(true);
              }
            }}
            onMouseLeave={() => {
              if (isDesktop || !transition) {
                setIsHovered(false);
                setIsInView(false);
              }
            }}
          >
            <motion.img
              className={`object-cover w-full absolute`}
              src={productMedia[currentImageIndex].url}
              key={productMedia[currentImageIndex].url}
              alt={productMedia[currentImageIndex].altText || 'Product image'}
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              transition={{duration: 0.5}}
            />
            {!isAvailable && (
              <ProductSoldOut/>
            )}
            {showProductBadge && (
              <ProductBadge
                status={getProductStatus({
                  availableForSale: product.availableForSale,
                  compareAtPriceRangeMinVariantPrice:
                    product.compareAtPriceRange.minVariantPrice,
                  priceRangeMinVariantPrice: firstVariant.price,
                  tags: product.tags,
                  size:firstVariant.title
                })}
              />
            )}
            <motion.div
              className="h-0.5 w-0 bg-black absolute bottom-0 left-0"
              initial={{width: isInView ? (isDesktop || !transition ? (isHovered ? '100%' : 0) : '100%') : 0}}
              animate={{width: isInView && (isDesktop || !transition ? isHovered : true) ? '100%' : 0}}
              transition={{
                duration: isInView ? totalDuration / 1000 : 0, // Total duration in seconds if in view, 0 otherwise
                ease: 'linear',
                repeat: isInView ? Infinity : 0,
                repeatType: isInView ? 'loop' : undefined,
                delay: currentImageIndex === 0 ? 0 : -1, // Delay for the first image to start the progress bar animation from 0%
              }}
            />
          </motion.div>
          <div className="flex gap-2 text-left flex-col">
                <div className='flex flex-row justify-between text-gray-600 text-base'>
                  {/*<h2 className="italic">{getProductCategory(product)}</h2>*/}
                  <span className='items -mt-1'>
                    {getProductIcon(product, 24)} {/* Render the icon based on tags */}
                  </span>
                  {selectedOptions[0].value !== 'Default Title' && (<p>{selectedOptions[0].value}</p>)}
                </div>
              <div>
                <h2 id={`product-title-${product.handle}`} className="w-full uppercase font-bold text-xl">
                  {product.title.replace(/beef jerky/gi, "")}
                </h2>
              </div>
              <div className='flex'>
                <OkendoStarRating
                  productId={product.id}
                  okendoStarRatingSnippet={product.okendoStarRatingSnippet}
                /> 
              
              </div>
            {false && (
              <div className='px-2'>
                <ProductLevelIndicator product={product} size={25} /> {/* Render the icon based on tags */}
              </div>
            )}
            <div>
                <Prices
                contentClass="justify-start"
                  price={firstVariant.price}
                   compareAtPrice={
                     isSale ? product.compareAtPriceRange.minVariantPrice : undefined
                   }
                  withoutTrailingZeros={
                    Number(product.priceRange.minVariantPrice.amount || 1) > 99
                  }
                />
            </div>
            {showBadge && (
              <span className='items -mt-1'>
                {getProductIcon(product)} {/* Render the icon based on tags */}
              </span>
            )}
            {/* 
            <div className='mb-5 sm:mb-0'>
              <p className='text-sm text-secondary-600'>25% Off With Code: <span className='font-bold'>JULY4</span></p>
            </div>
            */}
          </div>
        </div>
      </Link>
      
      {quickAdd && firstVariant.availableForSale && (
        <AddToCartPressable
            analytics={{
              products: [productAnalytics],
              totalValue: parseFloat(productAnalytics.price),
            }}
            lines={[
              {
                quantity: 1,
                merchandiseId: firstVariant.id,
                selectedVariant: firstVariant,
              },
            ]}
            onClick={() => open('cart')}
            className={'absolute right-1 -bottom-2 lg:bottom-0'}
            aria-label="Add to cart button"
            bgColor='white'
          >
          <IconPlus />
        </AddToCartPressable>
      )}
    </motion.div>
  );
}
export const getProductIcon = (product: any, size = 30, className = '') => {
  const { tags, flavor_level, handle} = product;
  const tagsString = tags.join(' ');
  const count = flavor_level ? parseInt(flavor_level.value) : 1;
  const getIconComponent = (index: number) => {
    if (tagsString.includes('hot-spicy')) return <IconSpicy className={className} key={index} size={size} />;
    if (tagsString.includes('bbq')) return <IconHoney className={className} key={index} size={size} />;
    if (tagsString.includes('chicken')) return <IconChicken className={className} key={index} size={size} />;
    if (tagsString.includes('peppered')) return <IconPepper className={className} key={index} size={size} />;
    return <IconCow className={className} key={index} size={size}   />;
  };

  return Array.from({ length: count }, (_, index) => getIconComponent(index));
};

export const getProductCategory = (product: any) => {
  const { tags, flavor_level, handle, size = 30 } = product;
  const tagsString = tags.join(' ');
  const count = flavor_level ? parseInt(flavor_level.value) : 1;

  const getIconComponent = () => {
    if (tagsString.includes('classic_flavors')) return 'Classic';
    if (tagsString.includes('hot-spicy')) return 'Spicy';
    if (tagsString.includes('bbq')) return 'BBQ';
    if (tagsString.includes('chicken')) return 'Chicken';
    if (tagsString.includes('peppered')) return 'Classic';
    return 'Classic';
  };

  return Array.from({ length: count }, (_, index) => getIconComponent());
};

export const ProductBadge = ({
  status,
  className,
}: {
  status: 'Sold out' | 'Sale' | 'New' | '3 FOR $33' | '3 FOR $20' | 'Best Seller' |null;
  className?: string;
}) => {
  if (!status) {
    return null;
  }

  if (status === 'Sold out') {
    return (
      <ProductStatus
        className={className}
        color="zinc"
        status={status}
        icon="NoSymbolIcon"
      />
    );
  }

  /*if (status === '3 FOR $33' || status === '3 FOR $20') {
    return (
      <ProductStatus
        className={className}
        color="logoRed"
        status={status}
        icon="IconDiscount"
      />
    );
  }
*/
  if (status === 'Best Seller') {
    return (
      <ProductStatus
        className={'absolute top-3 end-3 px-2.5 py-1.5 !text-xs md:!text-sm font-bold !rounded-none'}
        color="logoYellow"
        status={status}
      />
    );
  }
  if (status === 'Sale') {
    return (
      <ProductStatus
        className={className}
        color="rose"
        status={status}
        icon="IconDiscount"
      />
    );
  }

  if (status === 'New') {
    return (
      <ProductStatus
        className={className}
        color="green"
        status={status}
        icon="SparklesIcon"
      />
    );
  }

  return null;
};
export function getProductUrlWithSelectedOption({
  product,
  optionSelected,
}: {
  product: ProductFragment;
  optionSelected: {
    name: string;
    value: string;
  };
}) {
  const searchParams = new URLSearchParams();

  const firstVariant = product!.variants.nodes[0];
  for (const option of firstVariant.selectedOptions) {
    searchParams.set(option.name, option.value);
  }

  searchParams.set(optionSelected.name, optionSelected.value);

  return `/beef-jerky/${product.handle}?${searchParams.toString()}`;
}

export const getProductStatus = ({
  availableForSale,
  compareAtPriceRangeMinVariantPrice,
  priceRangeMinVariantPrice,
  tags,
  size
}: {
  availableForSale: boolean;
  compareAtPriceRangeMinVariantPrice?: Pick<MoneyV2, 'amount' | 'currencyCode'>;
  priceRangeMinVariantPrice?: Pick<MoneyV2, 'amount' | 'currencyCode'>;
  tags?: Array<string>;
  size: string;
}) => {
  const isSale =
    compareAtPriceRangeMinVariantPrice?.amount &&
    priceRangeMinVariantPrice?.amount &&
    Number(compareAtPriceRangeMinVariantPrice?.amount) >
      Number(priceRangeMinVariantPrice.amount);

  if (!availableForSale) {
    return 'Sold out';
  }
  

  if (tags?.includes('best_sellers') && size == '3oz') {
    return 'Best Seller';
  }
      
  if (tags?.includes('label:3-for-33') && size == '3oz') {
    return '3 FOR $33';
  }
/*
  if (tags?.includes('label:3-for-33') && size == '2oz') {
    return '3 FOR $20';
  }*/
  if (isSale && tags?.includes('on-sale') && availableForSale) {
    return 'Sale';
  }


  return null;
};


export const ProductCardSkeleton = ({
  className = '',
  index = 0,
}: {
  className?: string;
  index?: number;
}) => {
  const ThumbnailSkeleton = getThumbnailSkeletonByIndex(index);

  return (
    <div
      className={
        `ProductCard relative flex flex-col bg-transparent ` + className
      }
    >
      <div className="relative flex-shrink-0 bg-slate-50 border border-slate-50 dark:bg-slate-300 rounded-3xl overflow-hidden z-1 group ">
        <div className="flex aspect-w-15 aspect-h-16 w-full group-hover:opacity-80 transition-opacity">
          <ThumbnailSkeleton />
        </div>
      </div>

      <div className="space-y-4 px-2.5 pt-5 pb-2.5">
        <div className="flex items-center flex-wrap gap-3">
          {[1, 1, 1, 1].map((_, index) => {
            if (index >= 5) {
              return null;
            }
            return (
              <div
                key={index}
                className={`relative w-4 h-4 rounded-full bg-slate-100 overflow-hidden cursor-pointer`}
              ></div>
            );
          })}
        </div>
        <div>
          <h2 className="nc-ProductCard__title text-lg font-semibold transition-colors">
            Product title
          </h2>
          <p
            className={`text-base text-slate-500 dark:text-slate-400 mt-1 capitalize`}
          >
            Outstanding feature
          </p>
        </div>

        <div className="flex justify-between items-end gap-2">
          <Prices
            price={{
              amount: '100.00',
              currencyCode: 'USD',
            }}
          />
          <>
            <div className="flex">
              <span className="text-base ml-1">
                <span className="line-clamp-1">5.0 (28 reviews)</span>
              </span>
            </div>
          </>
        </div>
      </div>
    </div>
  );
};
export default ProductCard;

/** @typedef {import('@shopify/hydrogen').ShopifyAnalyticsProduct} ShopifyAnalyticsProduct */
/** @typedef {import('@shopify/hydrogen/storefront-api-types').MoneyV2} MoneyV2 */
/** @typedef {import('@shopify/hydrogen/storefront-api-types').Product} Product */
/** @typedef {import('storefrontapi.generated').ProductCardFragment} ProductCardFragment */
