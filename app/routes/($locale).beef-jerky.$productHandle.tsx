import {useRef, Suspense, useState, useEffect, Fragment, type RefObject} from 'react';
import {
  defer,
  type MetaArgs,
  redirect,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {useLoaderData, Await, useLocation, useRouteLoaderData} from '@remix-run/react';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  Image
} from '@shopify/hydrogen';
import invariant from 'tiny-invariant';
import clsx from 'clsx';
import type {
  ProductQuery,
} from 'storefrontapi.generated';
import {ProductGallery} from '~/components/ProductGallery';
import {Skeleton} from '~/components/Skeleton';
import {Link} from '~/components/Link';
import {AddToCartButton} from '~/components/Button/AddToCartButton';
import {seoPayload} from '~/lib/seo.server';
import type {Storefront} from '~/lib/type';
import {routeHeaders} from '~/data/cache';
import {MEDIA_FRAGMENT} from '~/data/fragments';
import Prices from '~/components/Prices';
import {NoSymbolIcon} from '@heroicons/react/24/outline';
import {COMMON_PRODUCT_CARD_FRAGMENT} from '~/data/commonFragments';
import {SnapSliderProducts} from '~/components/SnapSliderProducts';
import {type SelectedOption} from '@shopify/hydrogen/storefront-api-types';
import {RouteContent} from '~/sections/RouteContent';
import {getSeoMeta} from '@shopify/hydrogen';
import {getLoaderRouteFromMetaobject} from '~/utils/getLoaderRouteFromMetaobject';
import { motion } from 'framer-motion';
import { IconArrowRight, IconCheck, IconFacebook } from '~/components/Icon';
import { IconX } from '~/components/Icon';
import { IconPinterest } from '~/components/Icon';
import { convertToNumber } from '~/lib/utils';
import { useAside } from '~/components/Aside';
import LoadingScreen from '~/components/LoadingScreen';
import { Popover, Transition } from '@headlessui/react';
import { CartCount } from '~/components/CartCount';
import { useIsHydrated } from '~/hooks/useIsHydrated';
import ProductLevelIndicator from '~/components/ProductLevelIndicator';
import { RootLoader } from '~/root';
import {
  OKENDO_PRODUCT_REVIEWS_FRAGMENT,
  OKENDO_PRODUCT_STAR_RATING_FRAGMENT,
} from '../data/commonFragments';
import {
  OkendoReviews,
  OkendoStarRating,
} from '@okendo/shopify-hydrogen';
import type {ProductFragment} from 'storefrontapi.generated';

export const headers = routeHeaders;

export async function loader(args: LoaderFunctionArgs) {
  const {params} = args;
  const {productHandle} = params;
  invariant(productHandle, 'Missing productHandle param, check route filename');

  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return defer({...deferredData, ...criticalData});
}

async function loadCriticalData(args: LoaderFunctionArgs) {
  const {params, request, context} = args;
  const {productHandle} = params;
  invariant(productHandle, 'Missing productHandle param, check route filename');

  const selectedOptions = getSelectedProductOptions(request).filter(
    (option) =>
      // Filter out Shopify predictive search query params
      !option.name.startsWith('_sid') &&
      !option.name.startsWith('_pos') &&
      !option.name.startsWith('_psq') &&
      !option.name.startsWith('_ss') &&
      !option.name.startsWith('_v') &&
      // Filter out third party tracking params
      !option.name.startsWith('fbclid'),
  );
  const defaultOption = [{
    name: 'Size',
    value: '3oz'
  }];

  const [{shop, product}] = await Promise.all([
    context.storefront.query(PRODUCT_QUERY, {
      variables: {
        handle: productHandle,
        selectedOptions: selectedOptions.length > 0 ? selectedOptions : defaultOption,
        country: context.storefront.i18n.country,
        language: context.storefront.i18n.language,
      },
    }),
  ]);

  if (!product?.id) {
    throw new Response('product', {status: 404});
  }


  const firstVariant = product.variants.nodes[0];
  const firstVariantIsDefault = Boolean(
    firstVariant.selectedOptions.find(
      (option: SelectedOption) =>
        option.name === 'Title' && option.value === 'Default Title',
    ),
  );

  if (firstVariantIsDefault) {
    product.selectedVariant = firstVariant;
  } else {
    // if no selected variant was returned from the selected options,
    // we redirect to the first variant's url with it's selected options applied
    if (!product.selectedVariant) {
      throw redirectToFirstVariant({product, request});
    }
  }

  const recommended = getRecommendedProducts(context.storefront, product.id);

  // TODO: firstVariant is never used because we will always have a selectedVariant due to redirect
  // Investigate if we can avoid the redirect for product pages with no search params for first variant
  const selectedVariant = product.selectedVariant ?? firstVariant;
  const seo = seoPayload.product({
    product,
    selectedVariant,
    url: request.url,
  });

  return {
    shop,
    product,
    recommended,
    storeDomain: shop.primaryDomain.url,
    seo,
  };
}

function loadDeferredData(args: LoaderFunctionArgs) {
  const {params, request, context} = args;
  const {productHandle} = params;
  invariant(productHandle, 'Missing productHandle param, check route filename');

  // 3. Query the route metaobject
  const routePromise = getLoaderRouteFromMetaobject({
    params,
    context,
    request,
    handle: 'route-product',
  });

  return {
    routePromise,
  };
}

export function redirectToFirstVariant({
  product,
  request,
}: {
  product: ProductQuery['product'];
  request: Request;
}) {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);

  const firstVariant = product!.variants.nodes[0];
  for (const option of firstVariant.selectedOptions) {
    searchParams.set(option.name, option.value);
  }

  url.search = searchParams.toString();

  return redirect(url.href.replace(url.origin, ''), 302);
}

export const meta = ({matches}: MetaArgs<typeof loader>) => {
  return getSeoMeta(...matches.map((match) => (match.data as any).seo));
};

export default function Product() {
  const {product, recommended, routePromise} =
    useLoaderData<typeof loader>();
  const {media, descriptionHtml, tags} =
    product;

  const { pathname, state } = useLocation();
  const isBackButton = pathname.includes('/beef-jerky/') ? !!state : (pathname.includes('/bundle/') && true);
  const isPack = pathname.includes('bags');

  const [showBottomAddToCartButton, setShowBottomAddToCartButton] = useState(false);
  const addToCartButtonRef = useRef<HTMLDivElement>(null); 

  const [currentQuantity, setCurrentQuantity] = useState(isPack ? 1 : 3);
  const selectedVariant = useOptimisticVariant(product.selectedVariant, product.variants.nodes);
  const isHydrated = useIsHydrated();
  const isOutOfStock = !selectedVariant?.availableForSale;


  let variantPrice = parseFloat(selectedVariant.price.amount) * currentQuantity;
  let discountAmount = 0;
  let setPrice = 1;
  const setQuantity = 3;
  const sets = Math.floor(currentQuantity / setQuantity);
  const remainingItems = currentQuantity % setQuantity;
  //variantPrice *= currentQuantity;
  // Buy 3 for $33 discount logic
  if(selectedVariant.title === '3oz') {
    setPrice = 33;
    discountAmount = (sets * setQuantity * variantPrice - sets * setPrice);
    variantPrice = (sets * setPrice) + (remainingItems * variantPrice);
  }

  const selectedVariantPrice = {
    amount: variantPrice.toString(),
    currencyCode: "USD"
  };
  const selectedVariantCompareAtPrice = {
    amount: selectedVariant?.compareAtPrice?.amount ? convertToNumber(selectedVariant.compareAtPrice.amount, currentQuantity) : '0',
    currencyCode: "USD"
  };

  
  const productCheck = ['High Protein', '100% USA Angus Beef', 'Real Ingredients'];

  const handleScroll = () => {
    const addToCartButtonElement = addToCartButtonRef.current;
    if (addToCartButtonElement) {
      const addToCartButtonPosition = addToCartButtonElement.getBoundingClientRect().top;
      const shouldShow = addToCartButtonPosition <= 10;
      // Only update isSticky when there's an actual change
      if (shouldShow !== showBottomAddToCartButton) {
        setShowBottomAddToCartButton(shouldShow);
      }
    }
  };

    // Add scroll event listener
    useEffect(() => {
      window.addEventListener('scroll', handleScroll);
      // Cleanup on unmount
      return () => window.removeEventListener('scroll', handleScroll);
    }, []); // Empty dependency array to avoid infinite loop

if(!isHydrated) {
  return <LoadingScreen isLoading={true} />; // Avoid mismatches during hydration
}
    
  return (
    <div
      className={clsx(
        'product-page mt-5 mb-20 lg:mt-10 pb-28 ',
      )}
    >
     
      <motion.div
        initial={{ y: '100%' }}
        animate={showBottomAddToCartButton ? { y: 0, opacity: 1 } : { y: '100%', opacity: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        tabIndex={-1} // Make it focusable
        aria-hidden={!showBottomAddToCartButton} // Hide from screen readers when not visible
        className={`fixed w-full lg:hidden z-20 ${isBackButton ? 'bottom-0' : 'bottom-0'}`}
      >
        {!isOutOfStock &&(
          <BottomAddToCartButton
            isBackButton={isBackButton}
            selectedVariant={selectedVariant}
            currentQuantity={currentQuantity}
            selectedVariantCompareAtPrice={selectedVariantCompareAtPrice}
            selectedVariantPrice={selectedVariantPrice}
            setCurrentQuantity={setCurrentQuantity}
          />
        )}
      </motion.div>
        <section 
          aria-label='Product section'
          className="lg:flex 2xl:max-w-screen-xl mx-auto container sm-max:max-w-[640px]"
          >
          {/* Galleries */}
          <div 
            aria-label="Product images"
            className="w-full lg:w-[55%] relative">
            {media?.nodes?.length > 0 ? (
            <ProductGallery
              media={media.nodes}
              className="w-full lg:col-span-2 lg:gap-7"
              aspectRatio={'2/3'}
            />
            ) : (
              <Skeleton className="h-32" />
            )}
            {/* LIKE BUTTON WISHLIST
            <LikeButton
              id={id}
              className="absolute top-3 end-3 z-10 !w-10 !h-10"
            />
            */}
          </div>

          {/* Product Details */}
          <div 
            aria-label="Product Details"
            className="w-full lg:w-[45%] pt-10 lg:pt-0 lg:pl-7 xl:pl-9 2xl:pl-10">
            <div className="sticky top-10 grid gap-8">
              
              <Suspense fallback={<div>Loading...</div>}>
                <Await
                  errorElement="There was a problem loading related products"
                  resolve={product}
                >
                  {(resp) => (
                    <ProductForm
                      product={resp}
                      addToCartButtonRef={addToCartButtonRef}
                      currentQuantity={currentQuantity}
                      selectedVariantCompareAtPrice={selectedVariantCompareAtPrice}
                      selectedVariantPrice={selectedVariantPrice}
                      setCurrentQuantity={setCurrentQuantity}
                    />
                  )}
                </Await>
              </Suspense>

          {/* Product description */}
              {!!descriptionHtml && (
                <div 
                  aria-labelledby="product-details"
                  className="grid gap-7 2xl:gap-8 description-container text-lg">
                  <h2 id="product-details" className="sr-only">Product Details</h2>
                  <div
                    className="sm:max-w-4xl"
                    dangerouslySetInnerHTML={{
                      __html: descriptionHtml || '',
                    }}
                  />
                  <div 
                    aria-labelledby="product-check-heading"
                    className="w-full">
                    <h2 id="product-check-heading" className="sr-only">Product Check List</h2>
                    <ul
                      role='list' 
                      className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-1 gap-3 font-bold'>
                      {productCheck.map((v, i) => <li key={i} className='flex text-xl items-end'><IconCheck className='mr-1 w-7 h-7' /> {v}</li>)}
                    </ul>
                  </div>
                  <Image
                    loading={'lazy'}
                    data={{
                      url: 'https://cdn.shopify.com/s/files/1/0641/9742/7365/files/pdp-2.jpg',
                      altText: 'Astro beef jerky next to ingredients like pepper, garlic, onion, and jalapeno'
                    }}
                    aspectRatio={undefined}
                    sizes='(min-width: 48em) 60vw, 90vw'
                    className="object-cover rounded-2xl fadeIn"
                  />
                </div>
              )}

              <section
                  aria-label="Share this product in social media" >
                <SocialSharing 
                  selectedVariant={selectedVariant} 
                />
              </section>
              
              {/*  */}
              {/*  */}
              {/*
              <hr className=" border-slate-200 dark:border-slate-700 mt-3"></hr>
                <section 
                  aria-label="Nutrition facts"
                  className="grid gap-7 2xl:gap-8 description-container">
                  <h2 className="text-2xl font-semibold">NUTRITIONS</h2>
                  <div>
                    <Image
                      loading={'lazy'}
                      data={{
                        url: 'https://cdn.shopify.com/s/files/1/0641/9742/7365/files/nutrition.jpg',
                        altText: 'Astro Beef Jerky Nutrition Facts'
                      }}
                      aspectRatio={undefined}
                      sizes='(min-width: 48em) 60vw, 90vw'
                      className="object-cover rounded-2xl w-full h-full fadeIn"
                    />
                  </div>
                </section>
               */}

               

            </div>
          </div>
        </section>


        <hr className="border-slate-200 dark:border-slate-700 my-8" />
              {/* Product reviews */}
              
        <section
          aria-label="Product reviews"
          className='container'>
              <ProductReviews product={product} />
        </section>

        <hr className="border-slate-200 dark:border-slate-700 my-8" />
     


          


        <section
          aria-label="You might also like these list of Beef Jerkies">
          {/* OTHER SECTION */}
          <Suspense fallback={<Skeleton className="h-32" />}>
            <Await
              errorElement="There was a problem loading related products"
              resolve={recommended}
            >
              {(products) => (
                  <SnapSliderProducts
                    heading_bold={'YOU MIGHT ALSO LIKE'}
                    products={products.nodes.filter(node => node.tags.includes('beef-jerky'))}
                    className=''
                    headingFontClass="text-3xl md:text-4xl font-semibold"
                  />
              )}
            </Await>
          </Suspense>
        </section>
        
        {/* ---------- 6 ---------- 
        <div>
          <Policy
            shippingPolicy={shippingPolicy}
            refundPolicy={refundPolicy}
            subscriptionPolicy={subscriptionPolicy}
          />
        </div>
         */}

      {/* 3. Render the route's content sections */}
      <Suspense fallback={<div>Loading...</div>}>
        <Await
          errorElement="There was a problem loading route's content sections"
          resolve={routePromise}
        >
          {({route}) => (
            <>
              <RouteContent
                route={route}
                className="space-y-12 sm:space-y-16"
              />
            </>
          )}
        </Await>
      </Suspense>

      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              vendor: product.vendor,
              variantId: product.selectedVariant?.id || '',
              variantTitle: product.selectedVariant?.title || '',
              quantity: currentQuantity,
              price: variantPrice.toFixed(2),
              discount: discountAmount > 0 ? discountAmount.toFixed(2) : null,
            },
          ],
        }}
      />
    </div>
  );
}

interface ProductFormProps {
  product: ProductQuery['product'];
  currentQuantity: number;
  selectedVariantPrice: {amount: string; currencyCode: string};
  selectedVariantCompareAtPrice: {amount: number | string; currencyCode: string};
  setCurrentQuantity: (quantity: number) => void;
  addToCartButtonRef: React.RefObject<HTMLDivElement>;
}

export function ProductForm({product, currentQuantity, selectedVariantPrice, selectedVariantCompareAtPrice, setCurrentQuantity, addToCartButtonRef }: ProductFormProps) {


  const { pathname } = useLocation();
  const isPack = pathname.includes('bags');
  /**
   * Likewise, we're defaulting to the first variant for purposes
   * of add to cart if there is none returned from the loader.
   * A developer can opt out of this, too.
   */
  const selectedVariant = product.selectedVariant!;
  const isOutOfStock = !selectedVariant?.availableForSale;

  const bagOrPack = isPack ? 'Pack' : 'Bag';
/*
  const { collection } = location.state || {};
  const status = getProductStatus({
    availableForSale: selectedVariant.availableForSale,
    compareAtPriceRangeMinVariantPrice:
      selectedVariant.compareAtPrice || undefined,
    priceRangeMinVariantPrice: selectedVariant.price,
    size: selectedVariant.title
  });
*/
  const variantsByQuantity = [];
  for(let i = 1; i < 4; i++) {
    const quantity = i > 1 ? 3 * (i - 1) : i;
    variantsByQuantity.push({
      quantity: quantity,
      title: 'Buy ' + quantity + ' ' + bagOrPack + (i > 1 ? 's' : '')
    });
  }
  //const collectionObj = collection ? collection : {handle: 'best-beef-jerky-flavors', title: 'Our Best Beef Jerky Flavors'};

  return (
    <>
      {/* ---------- HEADING ----------  */}
      <div className='lg:mt-5  grid gap-7 2xl:gap-8'>
      {/*!!collectionObj && (
          <nav className="mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-1">
              <li className="flex items-center text-sm xl:text-base">
                <Link
                  to={'/'}
                  className="font-medium text-gray-500 hover:text-gray-900"
                  aria-label="Navigate to Home page"
                >
                  Home
                </Link>
                <IconCaret direction='left' className="ml-2 h-5 w-5 flex-shrink-0 text-gray-300 " />
              </li>
              <li className="flex items-center text-sm xl:text-base">
                <Link
                  to={'/' + collectionObj.handle}
                  className="font-medium text-gray-500 hover:text-gray-900"
                  aria-label={`Go to ${collectionObj.title.replace(/(<([^>]+)>)/gi, '')}`}
                >
                  {collectionObj.title.replace(/(<([^>]+)>)/gi, '')}
                </Link>
                <IconCaret direction='left' className="ml-2 h-5 w-5 flex-shrink-0 text-gray-300 " />
              </li>
              <li className="flex items-center text-sm xl:text-base" aria-current="page">
                {product.title}
              </li>
            </ol>
          </nav>
        )*/}
        <h1
          className="text-4xl sm:text-5xl font-bold px-2 text-center"
          title={product.title}
          aria-label={`Product title: ${product.title} (${selectedVariant.title})`}
        >
            {product.title + (selectedVariant.title !== 'Default Title' ? ' (' + selectedVariant.title + ')' : '')}
        </h1>
      </div>

      <div className='flex justify-center'>
        <OkendoStarRating
          productId={product.id}
          okendoStarRatingSnippet={product.okendoStarRatingSnippet}
        /> 
        <span className='ml-2'>Reviews</span>
      </div>
      
      <Prices
        priceClass="!text-3xl mx-auto"
        price={selectedVariant.price}
        compareAtPrice={selectedVariant.compareAtPrice}
      />

      {!isPack && (
        <div>
          <ProductLevelIndicator product={product}  /> {/* Render the icon based on tags */}
        </div>
      )}
      <div className='grid gap-7 2xl:gap-8'>
        
        <div 
          className="grid grid-cols-3 items-center gap-1 mb-4 xs:gap-3"
          role="group"
          aria-label="Select quantity"
        >
          {
            variantsByQuantity.map(({quantity, title}, i) => (
              <motion.button
                key={i}
                className={clsx(
                  'variant-button flex-auto text-[16px] xs:text-[18px] ',
                  quantity === currentQuantity ? 'variant-button-pressed': 'hover:bg-primary-100',
                )}
                onClick={() => setCurrentQuantity(quantity)}
                aria-label={`Buy ${quantity} ${bagOrPack + (quantity > 1 ? 's' : '')}`}
                aria-pressed={quantity === currentQuantity}
              >
                {title}
              </motion.button>
            ))
          }
        </div>
        {/* 
        <div>
          <p className='text-secondary-600'>Additional 25% Off With Code: <span className='font-bold'>JULY4</span></p>
        </div>
        */}
        {selectedVariant && (
          <div className="items-stretch gap-4">
            <div 
              ref={addToCartButtonRef}
              className="grid items-stretch gap-4"
              role="region"
              aria-label="Add to cart section">
              <AddToCartButton3d
                  isSmallButton={false}
                  selectedVariant={selectedVariant}
                  currentQuantity={currentQuantity}
                  selectedVariantCompareAtPrice={selectedVariantCompareAtPrice}
                  selectedVariantPrice={selectedVariantPrice}
                  isOutOfStock={isOutOfStock}
                />
            </div>
          </div>
        )}
      </div>
      

    

    </>
  );
}
interface BottomAddToCartButtonProps {
  selectedVariant: ProductQuery['product']['selectedVariant'];
  currentQuantity: number;
  selectedVariantPrice: {amount: string; currencyCode: string};
  selectedVariantCompareAtPrice: {amount: number | string; currencyCode: string};
  setCurrentQuantity: (quantity: number) => void;
  isBackButton: boolean;
}

const BottomAddToCartButton = ({ selectedVariant, currentQuantity, selectedVariantPrice, selectedVariantCompareAtPrice, setCurrentQuantity, isBackButton }: BottomAddToCartButtonProps) => {
  const variantsByQuantity = [];
  const isOutOfStock = !selectedVariant?.availableForSale;


  for (let i = 1; i < 4; i++) {
    const quantity = i > 1 ? 3 * (i - 1) : i;
    variantsByQuantity.push({
      quantity: quantity,
      title: quantity + ' Bag' + (i > 1 ? 's' : '')
    });
  }
  if (!selectedVariant) {
    return null;
  }
  const [activeItem, setActiveItem] = useState(variantsByQuantity?.find((item) => item.quantity === currentQuantity));

  // Update `activeItem` whenever `currentQuantity` changes
  useEffect(() => {
    const foundItem = variantsByQuantity.find(
      (item) => item.quantity === currentQuantity
    );
    if(foundItem !== activeItem) {
      setActiveItem(foundItem);
    }
  }, [currentQuantity, activeItem, variantsByQuantity]);

  return (
    <div 
      className='w-full z-50'
    >
      <div className='py-5 px-3 grid grid-cols-5'>
          <div className='col-span-1'>
            <div className='border-black border'>
              <Popover 
                className="relative flex-shrink-0"
              >
                {({open, close}) => (
                  <div className="popover-container">
                    <Popover.Button
                      aria-label="Quantity update"
                      aria-expanded={open}
                      aria-controls="quantity-menu"
                      className={clsx(
                        `flex gap-2 flex-shrink-0 items-center pdp-quantity-button justify-center  h-[56px] py-2 text-base border border-black bg-white w-full outline-none`,
                         open
                          ? 'pdp-quantity-button-active'
                          : '',
                      )}
                    >
                      <span className="flex-shrink-0">
                        {(activeItem || variantsByQuantity[0]).title || '3 Bags'}
                      </span>
                    </Popover.Button>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="opacity-0 translate-y-1"
                      enterTo="opacity-100 translate-y-0"
                      leave="transition ease-in duration-150"
                      leaveFrom="opacity-100 translate-y-0"
                      leaveTo="opacity-0 translate-y-1"
                    >
                      <Popover.Panel 
                        className="popover-panel absolute z-40 mb-3 bottom-14 right-0 sm:px-0"
                        id="quantity-menu"
                        role="menu"
                      >
                        <div className="overflow-hidden">
                          <div className="relative flex flex-col">
                            {variantsByQuantity.map(({title, quantity}, key) => (
                                <motion.button
                                  key={key}
                                  role="menuitem"
                                  aria-label={`Select ${quantity} ${
                                    quantity === 1 ? 'bag' : 'bags'
                                  }`}
                                  className='items-center justify-center  h-[50px] py-2 text-sm w-full border border-black mt-1 shadow-xl bg-white'
                                  onClick={() => {
                                    setCurrentQuantity(quantity);
                                    setActiveItem(variantsByQuantity?.find((item) => item.quantity === quantity))
                                    close(); 
                                  }}
                                >
                                  {title}
                                </motion.button>
                            ))}
                          </div>
                        </div>
                      </Popover.Panel>
                    </Transition>
                  </div>
                )}
              </Popover>
            </div>
          </div>
          <AddToCartButton3d
            isBackButton={isBackButton}
            selectedVariant={selectedVariant}
            currentQuantity={currentQuantity}
            selectedVariantCompareAtPrice={selectedVariantCompareAtPrice}
            selectedVariantPrice={selectedVariantPrice}
            isOutOfStock={isOutOfStock}
          />
        </div>
    </div>
  );
};

interface AddToCartButton3dProps {
  selectedVariant: ProductQuery['product']['selectedVariant'];
  currentQuantity: number;
  selectedVariantPrice: {amount: string; currencyCode: string};
  selectedVariantCompareAtPrice: {amount: number | string; currencyCode: string};
  isOutOfStock: boolean;
  isSmallButton?: boolean;
  isBackButton?: boolean;
}

const AddToCartButton3d = ({selectedVariant, currentQuantity, selectedVariantPrice, selectedVariantCompareAtPrice, isOutOfStock, isSmallButton = true, isBackButton = true}: AddToCartButton3dProps) => {
  const {open} = useAside();
  const isPack = selectedVariant?.product?.title?.includes('The Classic Pack') ?? false;
  return (
    <div className='col-span-4 flex flex-row gap-3 items-center'>
        <div className={`text-base border-black border w-full`}>
          <AddToCartButton
            lines={[
              {
                merchandiseId: selectedVariant.id,
                quantity: currentQuantity,
                selectedVariant: selectedVariant,
                attributes: isPack ? [
                  {
                    key: 'Sweet and Spicy Beef Jerky 3oz',
                    value: '1'
                  },
                  {
                      key: 'Honey Teriyaki Beef Jerky 3oz',
                      value: '1'
                  },
                  {
                      key: 'Supernova Hot Beef Jerky 3oz',
                      value: '1'
                  }
                ] : []
              },
            ]}
            className={`w-full pdp-add-to-cart-button text-sm relative ${isOutOfStock ? 'bg-neutral-800' : 'bg-black'} hover:bg-neutral-800 text-white py-2 outline-none ${isSmallButton ? 'h-[56px]' : 'h-[60px] text-lead' }`}
            data-test="add-to-cart"
            disabled={isOutOfStock}
            onClick={() => open('cart')}
          >
            {isOutOfStock ? 
            <>
              <span className={`flex items-center ml-3 gap-2 font-bold `}>
                SOLD OUT - Will Restock Soon
              </span>
              <NoSymbolIcon className="size-8 absolute right-3 top-1/2 transform -translate-y-1/2" />
            </>
            : 
            <>
              <span className={`flex items-center ml-3 gap-2 font-bold`}>
                <span>Add to Cart - </span>
                <Prices
                  contentClass={`inline ${isSmallButton ? '!text-sm' : '' }`}
                  price={selectedVariantPrice}
                  compareAtPrice={selectedVariantCompareAtPrice}
                  compareAtPriceClass={'text-slate-600'}
                />
              </span>
              <IconArrowRight className='absolute right-3 top-1/2 transform -translate-y-1/2' />
            </>
            }
            
          </AddToCartButton>
        </div>
        {isBackButton && (<CartCount opacity={1} className={`cursor-pointer md:hidden`} />)}
    </div>
  )
}

interface SocialSharingProps {
  selectedVariant: NonNullable<ProductQuery['product']['selectedVariant']>;
}

const SocialSharing = ({selectedVariant}: SocialSharingProps) => {
  const location = useLocation();
  const currentUrl = `${location.pathname}${location.search}${location.hash}`;

  const linkStyle = 'flex items-center justify-center gap-1';
  const productTitle = selectedVariant.product.title.replaceAll('&', ' and ') + ' (' + selectedVariant.title + ')';
  const productLink = 'https://www.astrofreshjerky.com' + currentUrl;
  const twitterText = productTitle + '&url=' + productLink;
  const pinText = productLink + '&media=' + selectedVariant.image.url;
  return (
    <div className="grid grid-cols-3">
      <Link 
        className={linkStyle}
        target="_blank"
        rel="noopener noreferrer"
        to={`https://www.facebook.com/sharer.php?u=${productLink}`}
        aria-label={`Share ${productTitle} on Facebook`}
        >
        <IconFacebook />
        <span>Share</span>
      </Link>
      <Link className={linkStyle}
        target="_blank"
        rel="noopener noreferrer"
        to={`https://x.com/intent/post?text=${twitterText}`}
        aria-label={`Tweet about ${productTitle} on X`}
      >
        <IconX />
        <span>Tweet</span>
      </Link>
      <Link className={linkStyle}
        target="_blank"
        rel="noopener noreferrer"
        to={`https://pinterest.com/pin/create/button/?url=${pinText}`}
        aria-label={`Pin ${productTitle} on Pinterest`}
      >
        <IconPinterest />
        <span>Pin it</span>
      </Link>
    </div>
  )
}

const ProductReviews = ({product}: {product: ProductFragment}) => {
  const rootData = useRouteLoaderData<RootLoader>('root');
  const publicOkendoSubcriberId = rootData?.publicOkendoSubcriberId;

  if (!product?.id || !publicOkendoSubcriberId) {
    return null;
  }

  return (
    <>

      <div className="product-page__reviews scroll-mt-nav" id="reviews">
        {/* HEADING */}
        {product?.okendoReviewsSnippet ? (
          <h2 className="text-2xl font-semibold text-center sm:text-left">
            <span>Reviews</span>
          </h2>
        ) : null}

        <div className="product-page__reviews-widget">
          <OkendoReviews
            productId={product?.id}
            okendoReviewsSnippet={product?.okendoReviewsSnippet}
          />
        </div>
      </div>
    </>
  );
};

export const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    id
    availableForSale
    selectedOptions {
      name
      value
    }
    image {
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    compareAtPrice {
      amount
      currencyCode
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
  }
`;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
      id
      title
      vendor
      handle
      descriptionHtml
      description
      publishedAt
      tags
      collections(first: 1) {
        nodes {
          title
          handle
        }
      }
      flavor_level: metafield(namespace: "custom", key:"flavor_level") {
        value
      }
      heat_level: metafield(namespace: "custom", key:"heat_level") {
        value
      }
      sweetness_level: metafield(namespace: "custom", key:"sweetness_level") {
        value
      }
      dryness_level: metafield(namespace: "custom", key:"dryness_level") {
        value
      }
      reviews_rating_count: metafield(namespace: "reviews", key:"rating_count") {
        id
        value
        namespace
        key
      }
      reviews_rating: metafield(namespace: "reviews", key:"rating") {
        id
        value
        namespace
        key
      }
      outstanding_features: metafield(namespace: "ciseco--product", key:"outstanding_features") {
        id
        value
        namespace
        key
      }
      options {
        name
        values
      }
      selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
        ...ProductVariant
      }
      media(first: 4) {
        nodes {
          ...Media
        }
      }
      variants(first: 1) {
        nodes {
          ...ProductVariant
        }
      }
      seo {
        description
        title
      }
      ...OkendoStarRatingSnippet
		  ...OkendoReviewsSnippet
  }
  ${PRODUCT_VARIANT_FRAGMENT}
  ${OKENDO_PRODUCT_STAR_RATING_FRAGMENT}
	${OKENDO_PRODUCT_REVIEWS_FRAGMENT}
` as const;


export const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
    shop {
      name
      primaryDomain {
        url
      }
      shippingPolicy {
        handle
      }
      refundPolicy {
        handle
      }
      subscriptionPolicy {
        handle
      }
    }
  }
  ${MEDIA_FRAGMENT}
  ${PRODUCT_FRAGMENT}
` as const;


const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  query productRecommendations(
    $productId: ID!
    $count: Int
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    recommended: productRecommendations(productId: $productId) {
      ...CommonProductCard
    }
    additional: products(first: $count, sortKey: BEST_SELLING) {
      nodes {
        ...CommonProductCard
      }
    }
  }
  ${COMMON_PRODUCT_CARD_FRAGMENT}
` as const;

async function getRecommendedProducts(
  storefront: Storefront,
  productId: string,
) {
  const products = await storefront.query(RECOMMENDED_PRODUCTS_QUERY, {
    variables: {productId, count: 12},
  });

  invariant(products, 'No data returned from Shopify API');

  const mergedProducts = (products.recommended ?? [])
    .concat(products.additional.nodes)
    .filter(
      (value, index, array) =>
        array.findIndex((value2) => value2.id === value.id) === index,
    );

  const originalProduct = mergedProducts.findIndex(
    (item) => item.id === productId,
  );

  mergedProducts.splice(originalProduct, 1);

  return {nodes: mergedProducts};
}
