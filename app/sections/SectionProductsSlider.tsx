import type {SectionProductsSliderFragment} from 'storefrontapi.generated';
import { SnapGridProducts } from '~/components/SnapGridProducts';
import {SnapSliderProducts} from '~/components/SnapSliderProducts';
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';

// import required modules
import { EffectCoverflow, Navigation } from 'swiper/modules';
import ProductCard, { getProductCategory, getProductIcon } from '~/components/ProductCard';
import { IconBbq, IconCaret, IconHoney, IconPepper, IconSpicy } from '~/components/Icon';
import NextPrev from '~/components/NextPrev/NextPrev';
import Heading from '~/components/Heading/Heading';
import { motion } from 'framer-motion';
import { flattenConnection } from '@shopify/hydrogen';
import { useState } from 'react';
import { OkendoStarRating } from '@okendo/shopify-hydrogen';
import Prices from '~/components/Prices';
import ButtonPrimary from '~/components/Button/ButtonPrimary';
import { Link } from '~/components/Link';
import ProductSwiper from '~/components/ProductSwiper';
import NextPrevPressable from '~/components/NextPrev/NextPrevPressable';
import { ButtonPressable } from '~/components/Button/ButtonPressable';
import {
  OKENDO_PRODUCT_STAR_RATING_FRAGMENT,
} from '../data/commonFragments';

export function SectionProductsSlider(props: SectionProductsSliderFragment) {
  const {heading_bold, heading_light, sub_heading, body, collection, style} =
    props;
  const products = collection?.reference?.products?.nodes;
  const [swiperInstance, setSwiperInstance] = useState<any>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  // Get the active product
  const activeProduct = products?.[activeIndex];
  

  const firstVariant = flattenConnection(activeProduct?.variants)[0];
  const {selectedOptions} = firstVariant;
  const isSale = activeProduct?.compareAtPriceRange.minVariantPrice &&
                  firstVariant.price &&
                    Number(activeProduct.compareAtPriceRange.minVariantPrice.amount) >
                      Number(firstVariant.price.amount);
  return (
    <section 
      id="product-slider" 
      aria-labelledby="product-slider-heading"
      aria-label="Products slider"
      className='sm:container'
    >
      <h2 id="product-slider-heading" className="sr-only">
        {heading_bold?.value || 'Products'}
      </h2>
    {style?.value == '2' ?
     <>
     <SnapSliderProducts
        heading_bold={heading_bold?.value}
        heading_light={heading_light?.value}
        sub_heading={sub_heading?.value}
        products={products}
        cardStyle={1}
        isSkeleton={!collection}
        className={'w-full mx-auto'}
      />
            {/*
      <SnapGridProducts
      heading_bold={heading_bold?.value}
      sub_heading={sub_heading?.value}
      products={products}
      className={'w-full mx-auto'}

     />
     */}
     </>
     :
     <>
      <Heading
        className={'mb-12 lg:mb-14 text-center !justify-center text-neutral-900 dark:text-neutral-50 mx-5 md:mx-10 xl:mx-0'}
        desc={
          <span>{sub_heading?.value} (And <IconSpicy size={24} />, And <IconHoney size={24} />, And <IconPepper size={24} />) </span>
        }
      >
        {heading_bold?.value}
      </Heading>
    
      <ProductSwiper
        items={products}
        renderSlide={(product) => (
          <motion.img
            className={`object-cover w-full absolute card-image`}
            src={product.images.edges[3].node.url}
            alt={product.images.edges[3].node.altText || 'Product image'}
          />
        )}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        onSwiper={setSwiperInstance}
      />
      <div className='absolute w-full left-1/2 -translate-x-1/2 lg:w-2/3'>
          <NextPrevPressable
              className='z-10'
              stroke="black"
              onClickNext={() => swiperInstance.slideNext()}
              onClickPrev={() => swiperInstance.slidePrev()}
              activeIndex={activeIndex}
              totalItems={products?.length || 0}
            />  
        </div>
        <div className="flex gap-3 flex-col items-center justify-center text-center w-full mt-4">
          <h2 id={`product-title-${activeProduct?.handle}`} className="w-full uppercase font-bold text-2xl">
            {activeProduct?.title.replace(/beef jerky/gi, "")}
          </h2>
         <div className='flex'>
            <OkendoStarRating
              productId={activeProduct?.id || ''}
              okendoStarRatingSnippet={activeProduct?.okendoStarRatingSnippet}
            /> 
          </div>
        <div>
            <Prices
            contentClass="justify-start"
              price={firstVariant.price}
              compareAtPrice={
                isSale ? activeProduct.compareAtPriceRange.minVariantPrice : undefined
              }
              withoutTrailingZeros={
                Number(activeProduct?.priceRange.minVariantPrice.amount || 1) > 99
              }
            />
        </div>
        <div>
            
        </div>
        <div>
          <ButtonPressable
            href={`/beef-jerky/${activeProduct?.handle}`}
            size="h-12 w-56 lg:w-60 lg:h-14"
            className="mx-auto text-white border-black border"
            buttonClass="grid grid-cols-8 py-3 px-8  lg:py-3.5"
            aria-label="Shop Now"
          >
            {getProductIcon(activeProduct, 24, 'fill-white')}
            <span className='col-span-7 uppercase'>View Details</span>
          </ButtonPressable>
          
        </div>
        <div>
          <p className='text-sm text-secondary-600'>25% Off With Code: <span className='font-bold'>JULY4</span></p>
        </div>
      </div>
     </>
     
      }

  
      
    </section>
  );
}

export const SECTION_PRODUCTS_SLIDER_FRAGMENT = `#graphql
  fragment SectionProductsSlider on Metaobject {
    type
    heading_bold: field(key: "heading_bold") {
      key
      value
    }
    heading_light: field(key: "heading_light") {
      key
      value
    }
    sub_heading: field(key: "sub_heading") {
      key
      value
    }
    body: field(key: "body") {
      key
      value
    }
    style: field(key: "style") {
      key
      value
    }
   
    collection: field(key: "collection") {
      type
      key
      reference {
        ... on Collection {
          id
          handle
          title
          description
          products(
            first: 10, 
          ) {
            nodes {
              ...CommonProductCard,
              flavor_level: metafield(namespace: "custom", key:"flavor_level") {
                value
              }
              ...OkendoStarRatingSnippet
            }
          }
        }
      }
    }
  }
  ${OKENDO_PRODUCT_STAR_RATING_FRAGMENT}
`;