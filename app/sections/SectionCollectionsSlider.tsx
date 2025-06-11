import type {SectionCollectionsSliderFragment} from 'storefrontapi.generated';
import {parseSection} from '~/utils/parseSection';
import type {ParsedMetafields} from '@shopify/hydrogen';
import Heading from '~/components/Heading/Heading';
import {useEffect, useRef, useState} from 'react';
import {Image} from '@shopify/hydrogen';
import useSnapSlider from '~/hooks/useSnapSlider';
import CollectionItem, {
  CollectionItemSkeleton,
  type TMyCommonCollectionItem,
} from '~/components/CollectionItem';
import { motion } from 'framer-motion';
import NextPrevDesktop from '~/components/NextPrev/NextPrevDesktop';
import ButtonPrimary from '~/components/Button/ButtonPrimary';
import { Link } from '~/components/Link';
import { IconCow } from '~/components/Icon';
import { getProductIcon } from '~/components/ProductCard';
import ProductSwiper from '~/components/ProductSwiper';
import NextPrev from '~/components/NextPrev/NextPrev';
import NextPrevPressable from '~/components/NextPrev/NextPrevPressable';

export function SectionCollectionsSlider(
  props: SectionCollectionsSliderFragment,
) {
  const section = parseSection<
    SectionCollectionsSliderFragment,
    {
      heading_bold?: ParsedMetafields['single_line_text_field'];
      heading_light?: ParsedMetafields['single_line_text_field'];
      sub_heading?: ParsedMetafields['single_line_text_field'];
    }
  >(props);

  const {id, heading_bold, heading_light, button_text, sub_heading} = section;

  return (
    <section 
      className="featured-collection" 
      key={id} 
      aria-labelledby={`slider-heading-${id}`}
    >
      <CollectionSlider
        isSkeleton={!props.collections}
        heading_bold={heading_bold?.parsedValue || ''}
        heading_light={heading_light?.parsedValue || ''}
        sub_heading={sub_heading?.parsedValue || ''}
        collections={props.collections?.references?.nodes || []}
        button_text={button_text?.value}
        sectionId={id}
      />
    </section>
  );
}

export const CollectionSlider = ({
  heading_bold,
  heading_light,
  sub_heading,
  button_text,
  collections = [],
  headingFontClass,
  isSkeleton,
  sectionId,
}: {
  heading_bold?: string;
  heading_light?: string;
  sub_heading?: string;
  collections?: TMyCommonCollectionItem[];
  button_text?: string;
  headingFontClass?: string;
  isSkeleton?: boolean;
  sectionId: string;
}) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [currentActive, setCurrentActive] = useState<TMyCommonCollectionItem | null>(() => collections[0].image); // State to track the active element

  const [swiperInstance, setSwiperInstance] = useState<any>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeCollection, setActiveCollection] = useState(collections[0] || null);

  const {scrollToNextSlide, scrollToPrevSlide} = useSnapSlider({sliderRef});
  useEffect(() => {
    // Ensure slider is focusable
    if (sliderRef.current) {
      sliderRef.current.setAttribute('tabindex', '0');
    }
  }, []);
  const listOfImages = collections.filter(Boolean).map((item) => (
    item.image
  ));
  const handleHoverOrTap = (item) => {
    setCurrentActive(item.image); // Update the currentActive state
  };

  
  return (
    <div className={`nc-DiscoverMoreSlider lg:container`}>
      <Heading
        id={`slider-heading-${sectionId}`}
        className="mb-12 mx-5 md:mx-10 xl:mx-0 lg:mb-14 text-neutral-900 text-center justify-self-center"
        desc={sub_heading || ''}
        rightDescText={heading_light || ''}
        fontClass={headingFontClass}
      >
        {heading_bold || ''}
      </Heading>
      <div className="relative">
    {heading_light ? (
       <>
      <ProductSwiper
        items={collections}
        renderSlide={(collection) => (
          <motion.img
            className={`object-cover w-full absolute card-image`}
            src={collection.image.url}
            alt={collection.image.altText || 'Product image'}
          />
        )}
        onSlideChange={(swiper) => {
          setActiveCollection(collections[swiper.activeIndex]);
          setActiveIndex(swiper.activeIndex);
        }}
        onSwiper={setSwiperInstance}
        initialSlide={2}
        spaceBetween={50}
        slidesPerView={2}
        className={'max-w-full'}
        breakpoints = {{
          640: {slidesPerView: 2},
          1024: {slidesPerView: 3},
        }}
        coverflowEffect ={{
          rotate: 0,
          modifier: 4,
          slideShadows: false,
        }}
      />
      <div className='absolute w-full left-1/2 -translate-x-1/2 lg:w-2/3'>
          <NextPrevPressable
              className='z-10'
              stroke="black"
              onClickNext={() => swiperInstance.slideNext()}
              onClickPrev={() => swiperInstance.slidePrev()}
              activeIndex={activeIndex}
            />  
        </div>
        <div className="flex gap-3 flex-col items-center justify-center text-center w-full mt-4">
          <h2 id={`product-title-${activeCollection?.handle}`} className="w-3/5 uppercase font-bold text-2xl">
            {activeCollection?.title?.replace(" Jerky", "").replace("Beef", "").replace("Best", "All")}
          </h2>
        <div>
            
        </div>
        <div>
          <Link
            to={`/${activeCollection?.handle}`}
            className='group border !border-neutral-900 !bg-neutral-900 hover:!bg-neutral-700 focus:!ring-neutral-600 text-slate-50 py-3 px-4 lg:py-3.5 lg:px-7 mx-auto items-center justify-center rounded-full grid grid-cols-6 text-lead disabled:bg-opacity-90'
            aria-label="Shop Now"
          >
            {getProductIcon({tags: [activeCollection.handle]}, 24, 'fill-white')}
            <span className='col-start-3 col-span-3 uppercase'>Shop Now</span>
            </Link>
        </div>
      </div>
       {/*<div className='flex flex-col lg:flex-row-reverse'>
      <div className='lg:w-1/2 p-10 lg:border-2 !border-l-0'>
          <Image
            className="inset-0 h-full object-cover rounded-2xl mx-auto"
            data={currentActive || listOfImages[0]}
            width={'1000px'}
            height={'1000px'}
          />
      </div>

      <div className='lg:w-1/2 flex flex-col h-[50vh] lg:h-[40vw] overflow-visible'>
      {
        collections.filter(Boolean).map((item, index) => (
          <motion.div
            key={`${item.id}`}
            className={`z-10 grid grid-cols-9 items-center text-base sm:text-xl px-5 font-semibold ${currentActive === item.image ? `${index === 0 ? 'bg-logo-red' : (index === 1 ? 'bg-amber-900' : (index === 2 ? 'bg-gray-900' : 'bg-orange-600'))} text-white z-20 ` : 'md:border-r-2'} ${index !== 0 ? 'border-t-2' : ''}`}
            role="listitem"
            style={{ flexGrow: 1 }}
            onHoverStart={() => handleHoverOrTap(item)}
            onTapStart={() => handleHoverOrTap(item)}
          >
            <span className={`col-span-1 mr-8 ${currentActive === item.image ? 'underline' : ''}`}>
              {'0' + (index + 1)}
            </span>
            <span className='col-span-4 xl:col-span-5'>
              {item.title.replace("Beef", "")}
            </span>
            {currentActive === item.image && (<ButtonPrimary className='col-span-4 xl:col-span-3 !text-xs !bg-white hover:!bg-neutral-300 focus:!ring-neutral-400 border-black border' aria-label="Shop Now">
              <Link
                to={`/${item.handle}`}
                className='grid grid-cols-8 w-full text-black'
              >
                {getProductIcon({tags: [item.handle], size: 20})}
                <span className='col-span-7 font-bold content-center'>SHOP NOW</span>
                </Link>
              </ButtonPrimary>)}
          </motion.div>
        ))
      }
      </div>
    </div>*/}
      </>
   
    ): (
      <>
      <div
          ref={sliderRef}
          className="relative w-full flex gap-4 lg:gap-8 snap-x snap-mandatory overflow-x-auto scroll-p-l-container hiddenScrollbar"
          role="list"
          aria-label="Collection slider"
        >
          <div className="w-0 px-3 xl:hidden"></div>
          {isSkeleton
            ? [1, 1, 1, 1, 1].map((_, index) => (
                <div
                  key={index}
                  className="mySnapItem snap-start shrink-0 last:pr-4 lg:last:pr-10"
                  role="listitem"
                >
                  <div className="w-64 sm:w-96 flex">
                    <CollectionItemSkeleton 
                      key={index}
                      aria-hidden="true" />
                  </div>
                </div>
              ))
            : collections.filter(Boolean).map((item, index) => (
                <div
                  key={`${item.id}`}
                  className="mySnapItem snap-start shrink-0 last:pr-4 lg:last:pr-10"
                  role="listitem"
                >
                  <div className="w-64 sm:w-96 flex">
                    <CollectionItem 
                      item={item} 
                      button_text={button_text} 
                    />
                  </div>
                </div>
              ))}
        </div>
        <NextPrevDesktop
          onClickNext={scrollToNextSlide} 
          onClickPrev={scrollToPrevSlide} />
      </>
    )}
        
      </div>
    </div>
  );
};

export const SECTION_COLLECTIONS_SLIDER_FRAGMENT = `#graphql
  fragment SectionCollectionsSlider on Metaobject {
    type
    id
    heading_bold: field(key: "heading_bold") {
      type
      key
      value
    }
    heading_light: field(key: "heading_light") {
      type
      key
      value
    }
    sub_heading: field(key: "sub_heading") {
      type
      key
      value
    }
    button_text: field(key: "button_text") {
      type
      key
      value
    }
    collections: field(key: "collections") {
      references(first: 10) {
        nodes {
          ... on Collection {
            ...CommonCollectionItem
          }
        }
      }
    }
  } 
`;
