import type {SectionCollectionsSliderFragment} from 'storefrontapi.generated';
import {parseSection} from '~/utils/parseSection';
import type {ParsedMetafields} from '@shopify/hydrogen';
import Heading from '~/components/Heading/Heading';
import {useEffect, useRef} from 'react';
import useSnapSlider from '~/hooks/useSnapSlider';
import CollectionItem, {
  CollectionItemSkeleton,
  type TMyCommonCollectionItem,
} from '~/components/CollectionItem';
import NextPrev from '~/components/NextPrev/NextPrev';
import NextPrevDesktop from '~/components/NextPrev/NextPrevDesktop';

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
  const {scrollToNextSlide, scrollToPrevSlide} = useSnapSlider({sliderRef});
  useEffect(() => {
    // Ensure slider is focusable
    if (sliderRef.current) {
      sliderRef.current.setAttribute('tabindex', '0');
    }
  }, []);
  return (
    <div className={`nc-DiscoverMoreSlider xl:container`}>
      <Heading
        id={`slider-heading-${sectionId}`}
        className="mb-12 mx-5 md:mx-10 xl:mx-0 lg:mb-14 text-neutral-900 dark:text-neutral-50"
        desc={sub_heading || ''}
        rightDescText={heading_light || ''}
        fontClass={headingFontClass}
      >
        {heading_bold || ''}
      </Heading>
      <div className="relative">
    
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
