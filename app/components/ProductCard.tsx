import clsx from 'clsx';
import {type FC} from 'react';
import {useState, useEffect, useRef} from 'react';
import {flattenConnection, Image, Money, useMoney} from '@shopify/hydrogen';
import ButtonSecondary from './Button/ButtonSecondary';
import {type CommonProductCardFragment} from 'storefrontapi.generated';
import {useGetPublicStoreCdnStaticUrlFromRootLoaderData} from '~/hooks/useGetPublicStoreCdnStaticUrlFromRootLoaderData';
import {AddToCartButton} from './AddToCartButton';
import {Link} from './Link';
import Prices from './Prices';
import {isDiscounted, isNewArrival} from '~/lib/utils';
import {getProductPlaceholder} from '~/lib/placeholders';
import {motion, useAnimationControls} from 'framer-motion';
import {getThumbnailSkeletonByIndex} from './ThumbnailSkeletons';
import ProductStatus from './ProductStatus';
import {useMediaQuery} from 'react-responsive';

interface MoneyV2 {
  amount: string;
  currencyCode: string;
}

interface ProductCardProps {
  product: CommonProductCardFragment;
  label?: string;
  className?: string;
  loading?: HTMLImageElement['loading'];
  quickAdd?: boolean;
  variantKey?: number;
}

/**
 * @param {{
 *   product: ProductCardFragment;
 *   label?: string;
 *   className?: string;
 *   loading?: HTMLImageElement['loading'];
 *   quickAdd?: boolean;
 * }}
 */
const ProductCard: FC<ProductCardProps> = ({
  product,
  label,
  className,
  loading,
  quickAdd,
  variantKey = 0,
}: ProductCardProps) => {
  let cardLabel;

  const cardProduct = product?.variants ? product : getProductPlaceholder();
  if (!cardProduct?.variants?.nodes?.length) return null;
  const firstVariant = flattenConnection(cardProduct.variants)[variantKey];
  if (!firstVariant) return null;
  const {getImageWithCdnUrlByName} =
    useGetPublicStoreCdnStaticUrlFromRootLoaderData();

  const productMedia = flattenConnection(cardProduct.images);
  const {selectedOptions} = firstVariant;

  const variantQueryString = selectedOptions.length
    ? '?' + selectedOptions[0].name + '=' + selectedOptions[0].value
    : '';
  const isAvailable = firstVariant.availableForSale;
  if (label) {
    cardLabel = label;
  } else if (!isAvailable) {
    cardLabel = 'SOLD OUT';
  } else {
    cardLabel = '3 FOR $33';
  }

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

    if (!isHovered && isDesktop) {
      setCurrentImageIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % productMedia.length);
    }, intervalDuration);

    return () => clearInterval(interval);
  }, [isInView, isHovered, isDesktop, productMedia.length, intervalDuration]);

  return ( 
    <motion.div className="flex flex-col gap-2" whileHover={{scale: 1.02}}>
      <Link
        to={`/products/${product.handle}${variantQueryString}`}
        state={{product: product.handle}}
      >
        <div className={clsx('grid gap-4', className)}>
          <motion.div
            ref={cardRef}
            className="card-image aspect-[4/5] pb-1"
            onMouseEnter={() => {
              if (isDesktop) {
                setIsHovered(true);
                setIsInView(true);
              }
            }}
            onMouseLeave={() => {
              if (isDesktop) {
                setIsHovered(false);
                setIsInView(false);
              }
            }}
          >
            <motion.img
              className={`object-cover w-full absolute`}
              src={productMedia[currentImageIndex].url}
              key={productMedia[currentImageIndex].url}
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              transition={{duration: 0.5}}
            />
            <ProductBadge
              status={getProductStatus({
                availableForSale: product.availableForSale,
                compareAtPriceRangeMinVariantPrice:
                  product.compareAtPriceRange.minVariantPrice,
                priceRangeMinVariantPrice: firstVariant.price,
                tags: product.tags
              })}
            />
            <motion.div
              className="h-0.5 w-0 bg-black absolute bottom-0 left-0"
              initial={{width: isInView ? (isDesktop ? (isHovered ? '100%' : 0) : '100%') : 0}}
              animate={{width: isInView && (isDesktop ? isHovered : true) ? '100%' : 0}}
              transition={{
                duration: isInView ? totalDuration / 1000 : 0, // Total duration in seconds if in view, 0 otherwise
                ease: 'linear',
                repeat: isInView ? Infinity : 0,
                repeatType: isInView ? 'loop' : undefined,
                delay: currentImageIndex === 0 ? 0 : -1, // Delay for the first image to start the progress bar animation from 0%
              }}
            />
          </motion.div>
          <div className="grid gap-1">
            <h2 className="w-full uppercase text-lead text-left">
              {product.title + ' (' + selectedOptions[0].value + ')'}
            </h2>
            <div className="flex gap-4">
              <span className="flex gap-4 text-copy">
              <Prices
                price={firstVariant.price}
                // compareAtPrice={
                //   isSale ? product.compareAtPriceRange.minVariantPrice : undefined
                // }
                withoutTrailingZeros={
                  Number(product.priceRange.minVariantPrice.amount || 1) > 99
                }
              />
              </span>
            </div>
          </div>
        </div>
      </Link>
      {quickAdd && firstVariant.availableForSale && (
        <AddToCartButton
          lines={[
            {
              quantity: 1,
              merchandiseId: firstVariant.id,
            },
          ]}
          variant="secondary"
          className="mt-2"
          analytics={{
            products: [productAnalytics],
            totalValue: parseFloat(productAnalytics.price),
          }}
        >
          <span className="flex items-center justify-center gap-2">
            Add to Cart
          </span>
        </AddToCartButton>
      )}
      {quickAdd && !firstVariant.availableForSale && (
        <ButtonSecondary className="mt-2" disabled>
          <span className="flex items-center justify-center gap-2">
            Sold out
          </span>
        </ButtonSecondary>
      )}
    </motion.div>
  );
}
export const ProductBadge = ({
  status,
  className,
}: {
  status: 'Sold out' | 'Sale' | 'New' | '3 FOR $33' | null;
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

  if (status === '3 FOR $33') {
    return (
      <ProductStatus
        className={className}
        color="logoGreen"
        status={status}
        icon="IconDiscount"
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
  product: CommonProductCardFragment;
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

  return `/products/${product.handle}?${searchParams.toString()}`;
}

export const getProductStatus = ({
  availableForSale,
  compareAtPriceRangeMinVariantPrice,
  priceRangeMinVariantPrice,
  tags
}: {
  availableForSale: boolean;
  compareAtPriceRangeMinVariantPrice?: Pick<MoneyV2, 'amount' | 'currencyCode'>;
  priceRangeMinVariantPrice?: Pick<MoneyV2, 'amount' | 'currencyCode'>;
  tags?: Array<string>;
}) => {
  const isSale =
    compareAtPriceRangeMinVariantPrice?.amount &&
    priceRangeMinVariantPrice?.amount &&
    Number(compareAtPriceRangeMinVariantPrice?.amount) >
      Number(priceRangeMinVariantPrice.amount);

  if (!availableForSale) {
    return 'Sold out';
  }

      
  if (tags?.includes('label:3-for-33')) {
    return '3 FOR $33';
  }

  if (isSale && availableForSale) {
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
          <h2 className="nc-ProductCard__title text-base font-semibold transition-colors">
            Product title
          </h2>
          <p
            className={`text-sm text-slate-500 dark:text-slate-400 mt-1 capitalize`}
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
              <span className="text-sm ml-1">
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
