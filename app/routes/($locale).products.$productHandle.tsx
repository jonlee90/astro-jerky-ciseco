import {useRef, Suspense, useState, useEffect, Fragment} from 'react';
import {
  defer,
  type MetaArgs,
  redirect,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {useLoaderData, Await, useLocation} from '@remix-run/react';
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
import {AddToCartButton} from '~/components/AddToCartButton';
import {seoPayload} from '~/lib/seo.server';
import type {Storefront} from '~/lib/type';
import {routeHeaders} from '~/data/cache';
import {MEDIA_FRAGMENT} from '~/data/fragments';
import Prices from '~/components/Prices';
import {NoSymbolIcon} from '@heroicons/react/24/outline';
import {getProductIcon, getProductStatus, ProductBadge} from '~/components/ProductCard';
import ButtonSecondary from '~/components/Button/ButtonSecondary';
import {COMMON_PRODUCT_CARD_FRAGMENT} from '~/data/commonFragments';
import {SnapSliderProducts} from '~/components/SnapSliderProducts';
import {type SelectedOption} from '@shopify/hydrogen/storefront-api-types';
import {RouteContent} from '~/sections/RouteContent';
import {getSeoMeta} from '@shopify/hydrogen';
import {getLoaderRouteFromMetaobject} from '~/utils/getLoaderRouteFromMetaobject';
import { motion } from 'framer-motion';
import { IconArrowRight, IconFacebook } from '~/components/Icon';
import { IconX } from '~/components/Icon';
import { IconPinterest } from '~/components/Icon';
import { convertToNumber } from '~/lib/utils';
import { useAside } from '~/components/Aside';
import { SlashIcon } from '@heroicons/react/24/solid';
import Nav from '~/components/Nav';
import NavItem from '~/components/NavItem';
import useWindowScroll from '~/components/Header/useWindowScroll';
import { Popover, Transition } from '@headlessui/react';
import { CartCount } from '~/components/CartCount';
import { useIsHydrated } from '~/hooks/useIsHydrated';

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

  if (!productHandle) {
    throw new Error('Expected product handle to be defined');
  }

  const [{shop, product}] = await Promise.all([
    context.storefront.query(PRODUCT_QUERY, {
      variables: {
        handle: productHandle,
        selectedOptions,
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

  // In order to show which variants are available in the UI, we need to query
  // all of them. But there might be a *lot*, so instead separate the variants
  // into it's own separate query that is deferred. So there's a brief moment
  // where variant options might show as available when they're not, but after
  // this deferred query resolves, the UI will update.
  const variants = context.storefront.query(VARIANTS_QUERY, {
    variables: {
      handle: productHandle,
      country: context.storefront.i18n.country,
      language: context.storefront.i18n.language,
    },
  });

  // 3. Query the route metaobject
  const routePromise = getLoaderRouteFromMetaobject({
    params,
    context,
    request,
    handle: 'route-product',
  });

  return {
    variants,
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
  const {product, recommended, variants, routePromise} =
    useLoaderData<typeof loader>();
  const {media, descriptionHtml, tags} =
    product;

  const { pathname, state } = useLocation();
  const isBackButton = pathname.includes('/products/') ? !!state : (pathname.includes('/bundle/') && true);

  const [showBottomAddToCartButton, setShowBottomAddToCartButton] = useState(false);
  const addToCartButtonRef = useRef<HTMLDivElement>(null); 

  const [currentQuantity, setCurrentQuantity] = useState(3);
  const selectedVariant = useOptimisticVariant(product.selectedVariant, variants);
  const isHydrated = useIsHydrated();


  let variantPrice = parseFloat(selectedVariant.price.amount) * currentQuantity;
  let discountAmount = 0;
  let setPrice = 1;
  const setQuantity = 3;
  const sets = Math.floor(currentQuantity / setQuantity);
  const remainingItems = currentQuantity % setQuantity;
  //variantPrice *= currentQuantity;
  // Buy 3 for $33 discount logic
  if(selectedVariant.title == '3oz') {
    setPrice = 33;
    discountAmount = (sets * setQuantity * variantPrice - sets * setPrice);
    variantPrice = (sets * setPrice) + (remainingItems * variantPrice);
  }

  const selectedVariantPrice = {
    amount: variantPrice.toString(),
    currencyCode: "USD"
  };
  const selectedVariantCompareAtPrice = {
    amount: selectedVariant?.compareAtPrice?.amount ? convertToNumber(selectedVariant.compareAtPrice.amount, currentQuantity) : 0,
    currencyCode: "USD"
  };

  
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
    }, [showBottomAddToCartButton]);

if(!isHydrated) {
  return null;
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
        className={`fixed w-full lg:hidden z-20 ${isBackButton ? 'bottom-0' : 'bottom-16'}`}
      >
        <BottomAddToCartButton
          isBackButton={isBackButton}
          selectedVariant={selectedVariant}
          currentQuantity={currentQuantity}
          selectedVariantCompareAtPrice={selectedVariantCompareAtPrice}
          selectedVariantPrice={selectedVariantPrice}
          setCurrentQuantity={setCurrentQuantity}
        />
      </motion.div>
      <main className="2xl:max-w-screen-xl container sm-max:max-w-[640px]">
        <div className="lg:flex">
          {/* Galleries */}
          <div className="w-full lg:w-[55%] relative">
            <ProductGallery
              media={media.nodes}
              className="w-full lg:col-span-2 lg:gap-7"
            />
            {/* LIKE BUTTON WISHLIST
            <LikeButton
              id={id}
              className="absolute top-3 end-3 z-10 !w-10 !h-10"
            />
            */}
          </div>

          {/* Product Details */}
          <div className="w-full lg:w-[45%] pt-10 lg:pt-0 lg:pl-7 xl:pl-9 2xl:pl-10">
            <div className="sticky top-10 grid gap-7 2xl:gap-8">
              
              <Suspense fallback={<></>}>
                <Await
                  errorElement="There was a problem loading related products"
                  resolve={variants}
                >
                  {(resp) => (
                    <ProductForm
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
                  className="grid gap-7 2xl:gap-8 description-container">
                  <h2 className="text-2xl font-semibold">Product Details</h2>
                  <div
                    className="prose prose-sm sm:prose dark:prose-invert sm:max-w-4xl"
                    dangerouslySetInnerHTML={{
                      __html: descriptionHtml || '',
                    }}
                  />
                  <div>
                    <Image
                      loading={'lazy'}
                      data={{
                        url: 'https://cdn.shopify.com/s/files/1/0641/9742/7365/files/pdp-1.jpg',
                        altText: 'Beef Jerky Juicy'
                      }}
                      aspectRatio={undefined}
                      sizes='(min-width: 48em) 60vw, 90vw'
                      className="object-cover rounded-2xl w-full h-full aspect-square fadeIn"
                    />
                  </div>
                </div>
              )}

              <SocialSharing selectedVariant={selectedVariant} />

              
              {/*  */}
              <hr className=" border-slate-200 dark:border-slate-700 mt-3"></hr>
              {/*  */}
              
                <div 
                  className="grid gap-7 2xl:gap-8 description-container">
                  <h2 className="text-2xl font-semibold">NUTRITIONS</h2>
                  <div>
                    <Image
                      loading={'lazy'}
                      data={{
                        url: 'https://cdn.shopify.com/s/files/1/0641/9742/7365/files/nutrition.jpg',
                        altText: 'Beef Jerky Nutrition'
                      }}
                      aspectRatio={undefined}
                      sizes='(min-width: 48em) 60vw, 90vw'
                      className="object-cover rounded-2xl w-full h-full aspect-square fadeIn"
                    />
                  </div>
                  <div>
                    <Image
                      loading={'lazy'}
                      data={{
                        url: 'https://cdn.shopify.com/s/files/1/0641/9742/7365/files/pdp-2.jpg',
                        altText: 'Beef Jerky Ingredients'
                      }}
                      aspectRatio={undefined}
                      sizes='(min-width: 48em) 60vw, 90vw'
                      className="object-cover rounded-2xl w-full h-full aspect-square fadeIn"
                    />
                  </div>
                </div>
              

            </div>
          </div>
        </div>

        <hr className="border-slate-200 dark:border-slate-700 my-8" />
        {/* DETAIL AND REVIEW */}
        <div className="space-y-12 sm:space-y-16">


          


          {/* OTHER SECTION */}
          <Suspense fallback={<Skeleton className="h-32" />}>
            <Await
              errorElement="There was a problem loading related products"
              resolve={recommended}
            >
              {(products) => (
                <>
                  <SnapSliderProducts
                    heading_bold={'YOU MIGHT ALSO LIKE'}
                    products={products.nodes}
                    className=""
                    headingFontClass="text-2xl font-semibold"
                  />
                </>
              )}
            </Await>
          </Suspense>
        </div>
        
        {/* ---------- 6 ---------- 
        <div>
          <Policy
            shippingPolicy={shippingPolicy}
            refundPolicy={refundPolicy}
            subscriptionPolicy={subscriptionPolicy}
          />
        </div>
         */}
      </main>

      {/* 3. Render the route's content sections */}
      <Suspense fallback={<div className="h-32" />}>
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

export function ProductForm({currentQuantity, selectedVariantPrice, selectedVariantCompareAtPrice, setCurrentQuantity, addToCartButtonRef }) {

  const {product} = useLoaderData<typeof loader>();

  const location = useLocation();
  const { collection } = location.state || {};
  /**
   * Likewise, we're defaulting to the first variant for purposes
   * of add to cart if there is none returned from the loader.
   * A developer can opt out of this, too.
   */
  const selectedVariant = product.selectedVariant!;
  const isOutOfStock = !selectedVariant?.availableForSale;

  const status = getProductStatus({
    availableForSale: selectedVariant.availableForSale,
    compareAtPriceRangeMinVariantPrice:
      selectedVariant.compareAtPrice || undefined,
    priceRangeMinVariantPrice: selectedVariant.price,
    size: selectedVariant.title
  });

  const variantsByQuantity = [];
  for(let i = 1; i < 4; i++) {
    const quantity = i > 1 ? 3 * (i - 1) : i;
    variantsByQuantity.push({
      quantity: quantity,
      title: 'Buy ' + quantity + ' Bag' + (i > 1 ? 's' : '')
    });
  }
  const collectionObj = collection ? collection : product.collections.nodes[0];

  return (
    <>
      {/* ---------- HEADING ----------  */}
      <div className='mt-5  grid gap-7 2xl:gap-8'>
      {!!collectionObj && (
          <nav className="mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li>
                <div className="flex items-center text-sm">
                  <Link
                    to={'/'}
                    className="font-medium text-gray-500 hover:text-gray-900"
                  >
                    Home
                  </Link>
                  <SlashIcon className="ml-2 h-5 w-5 flex-shrink-0 text-gray-300 " />
                </div>
              </li>
              <li>
                <div className="flex items-center text-sm">
                  <Link
                    to={'/collections/' + collectionObj.handle}
                    className="font-medium text-gray-500 hover:text-gray-900"
                  >
                    {/* romove html on title */}
                    {collectionObj.title.replace(/(<([^>]+)>)/gi, '')}
                  </Link>
                </div>
              </li>
            </ol>
          </nav>
        )}
        <h1
          className="text-4xl sm:text-5xl font-bold"
          title={product.title}
        >
            {product.title + ' (' + selectedVariant.title + ')'}
        </h1>
      </div>

      
      <Prices
        contentClass="!text-2xl font-semibold"
        price={selectedVariant.price}
        compareAtPrice={selectedVariant.compareAtPrice}
      />

      <div>
        {getProductIcon(product)} {/* Render the icon based on tags */}
      </div>

      <div className='grid gap-7 2xl:gap-8'>
        
        <div className="grid grid-cols-3 items-center gap-1 mb-4 xs:gap-3">
          {
            variantsByQuantity.map(({quantity, title}) => (
              <motion.button
                key={quantity}
                className={clsx(
                  'variant-button flex-auto text-[16px] xs:text-[18px]',
                  quantity === currentQuantity ? 'variant-button-pressed': '',
                )}
                onClick={() => setCurrentQuantity(quantity)}
              >
                {title}
              </motion.button>
            ))
          }
        </div>
        {selectedVariant && (
          <div className="items-stretch gap-4">
            {isOutOfStock ? (
              <ButtonSecondary disabled>
                <NoSymbolIcon className="w-5 h-5" />
                <span className="ms-2">Sold out</span>
              </ButtonSecondary>
            ) : (
              <div 
                ref={addToCartButtonRef}
                className="grid items-stretch gap-4">
                <AddToCartButton3d
                    isSmallButton={false}
                    selectedVariant={selectedVariant}
                    currentQuantity={currentQuantity}
                    selectedVariantCompareAtPrice={selectedVariantCompareAtPrice}
                    selectedVariantPrice={selectedVariantPrice}
                  />
              </div>
            )}
          </div>
        )}
      </div>
      

    

    </>
  );
}
const BottomAddToCartButton = ({ selectedVariant, currentQuantity, selectedVariantPrice, selectedVariantCompareAtPrice, setCurrentQuantity, isBackButton }) => {
  const variantsByQuantity = [];
  const isOutOfStock = !selectedVariant?.availableForSale;


  for (let i = 1; i < 4; i++) {
    const quantity = i > 1 ? 3 * (i - 1) : i;
    variantsByQuantity.push({
      quantity: quantity,
      title: quantity + ' Bag' + (i > 1 ? 's' : '')
    });
  }
  const [activeItem, setActiveItem] = useState(variantsByQuantity?.find((item) => item.quantity == 3));

  if (!selectedVariant) {
    return null;
  }
  return (
    <div 
      className='w-full z-50'
    >
      {isOutOfStock ? (
        <ButtonSecondary disabled>
          <NoSymbolIcon className="w-5 h-5" />
          <span className="ms-2">Sold out</span>
        </ButtonSecondary>
      ) : (
        <div className='py-5 px-3 grid grid-cols-5'>
          <div className='col-span-1'>
            <div className='border-black border'>
              <Popover 
                className="relative flex-shrink-0"
              >
                {({open, close}) => (
                  <div className="popover-container">
                    <Popover.Button
                      className={clsx(
                        `flex gap-2 flex-shrink-0 items-center pdp-quantity-button justify-center  h-[56px] py-2 text-sm border border-black bg-white w-full outline-none`,
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
                      >
                        <div className="overflow-hidden">
                          <div className="relative flex flex-col">
                            {variantsByQuantity.map(({title, quantity}, key) => (
                                <motion.button
                                  key={key}
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
          />
        </div>
      )}
    </div>
  );
};

const AddToCartButton3d = ({selectedVariant, currentQuantity, selectedVariantPrice, selectedVariantCompareAtPrice, isSmallButton = true, isBackButton}) => {
  const {open} = useAside();
  return (
    <div className='col-span-4 flex flex-row'>
        <div className={`text-sm border-black border w-full`}>
          <AddToCartButton
            lines={[
              {
                merchandiseId: selectedVariant.id,
                quantity: currentQuantity,
                selectedVariant: selectedVariant
              },
            ]}
            className={`w-full pdp-add-to-cart-button bg-black text-white py-2 outline-none ${isSmallButton ? 'h-[56px]' : 'h-[60px] text-lead' }`}
            data-test="add-to-cart"
            onClick={() => open('cart')}
          >
            <span className={`flex items-center ml-3 gap-2 font-bold `}>
              <span>Add to Cart - </span>
              <Prices
                contentClass={`inline ${isSmallButton ? 'text-sm' : '' }`}
                price={selectedVariantPrice}
                compareAtPrice={selectedVariantCompareAtPrice}
                compareAtPriceClass={'text-slate-600'}
              />
            </span>
            <IconArrowRight className='absolute right-3 top-1/2 transform -translate-y-1/2' />
          </AddToCartButton>
        </div>
        {isBackButton && (<CartCount opacity={1} className={`cursor-pointer ml-2 h-14 w-14`} />)}
    </div>
  )
}

const SocialSharing = ({selectedVariant}: {selectedVariant: any}) => {
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
        to={`https://www.facebook.com/sharer.php?u=${productLink}`}
        >
        <IconFacebook />
        <span>Share</span>
      </Link>
      <Link className={linkStyle}
        target="_blank"
        to={`https://x.com/intent/post?text=${twitterText}`}
      >
        <IconX />
        <span>Tweet</span>
      </Link>
      <Link className={linkStyle}
        target="_blank"
        to={`https://pinterest.com/pin/create/button/?url=${pinText}`}
      >
        <IconPinterest />
        <span>Pin it</span>
      </Link>
    </div>
  )
}
export const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariantFragment on ProductVariant {
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

export const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
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
      options {
        name
        values
      }
      selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
        ...ProductVariantFragment
      }
      media(first: 7) {
        nodes {
          ...Media
        }
      }
      variants(first: 1) {
        nodes {
          ...ProductVariantFragment
        }
      }
      seo {
        description
        title
      }
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
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

export const VARIANTS_QUERY = `#graphql
  query variants(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      variants(first: 250) {
        nodes {
          ...ProductVariantFragment
        }
      }
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
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
