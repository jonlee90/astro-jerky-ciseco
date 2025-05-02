import {Image, type ParsedMetafields} from '@shopify/hydrogen';
import {parseSection} from '~/utils/parseSection';
import type {SectionClientsSayFragment} from 'storefrontapi.generated';
import Heading from '~/components/Heading/Heading';
import {useEffect, useRef, useState} from 'react';
import useSnapSlider from '~/hooks/useSnapSlider';
import quotationImg from '@/assets/images/quotation.png?url';
import quotationImg2 from '@/assets/images/quotation2.png?url';
import {StarIcon} from '@heroicons/react/24/solid';
import NextPrev from '~/components/NextPrev/NextPrev';

export function SectionClientsSay(props: SectionClientsSayFragment) {
  const section = parseSection<
    SectionClientsSayFragment,
    {
      heading?: ParsedMetafields['single_line_text_field'];
    }
  >(props);

  const {heading, sub_heading, clients_say} = section;

  const sliderRef = useRef<HTMLDivElement>(null);
  const {scrollToNextSlide, scrollToPrevSlide} = useSnapSlider({sliderRef});
  const [activeIndex, setActiveIndex] = useState(0);
  // Function to calculate the active slide
  const updateActiveIndex = () => {
    if (sliderRef.current) {
      const slider = sliderRef.current;
      const slideWidth = slider.scrollWidth / clients_say?.nodes.length; // Width of each slide
      const currentScroll = slider.scrollLeft; // Current scroll position
      const newIndex = Math.round(currentScroll / slideWidth); // Calculate active index
      setActiveIndex(newIndex);
    }
  };

  useEffect(() => {
    const slider = sliderRef.current;

    if (slider) {
      // Add scroll event listener
      slider.addEventListener('scroll', updateActiveIndex);

      // Cleanup event listener on unmount
      return () => {
        slider.removeEventListener('scroll', updateActiveIndex);
      };
    }
  }, [clients_say?.nodes.length]);
  const renderBg = () => {
    return (
      <div className="hidden md:block">
        <Image
          sizes="100px"
          className="absolute top-9 -left-20"
          data={clients_say?.nodes[1]?.image?.image || {}}
          width={50}
        />
        <Image
          sizes="100px"
          className="absolute bottom-[100px] right-full mr-40"
          data={clients_say?.nodes[3]?.image?.image || {}}
          width={50}
          alt=""
        />
        <Image
          sizes="100px"
          className="absolute top-full left-[140px]"
          data={clients_say?.nodes[6]?.image?.image || {}}
          width={50}
          alt=""
        />
        <Image
          sizes="100px"
          className="absolute -bottom-10 right-[140px]"
          data={clients_say?.nodes[5]?.image?.image || {}}
          width={50}
          alt=""
        />
        <Image
          sizes="100px"
          className="absolute left-full ml-32 bottom-[80px]"
          data={clients_say?.nodes[4]?.image?.image || {}}
          width={50}
          alt=""
        />
        <Image
          sizes="100px"
          className="absolute -right-10 top-10 "
          data={clients_say?.nodes[2]?.image?.image || {}}
          width={50}
          alt=""
        />
      </div>
    );
  };


  return (
    <section className="nc-SectionClientSay overflow-hidden text-white w-full py-20 relative">
      <Image
        className="absolute bottom-10 w-[95px] lg:w-[190px]"
        width={190}
        height={253}
        src="https://cdn.shopify.com/s/files/1/0641/9742/7365/files/chat-left.png"
        alt="Chat Box with images before"
      />

      <Heading 
        fontClass='text-white uppercase text-4xl font-semibold'
        className='z-10 px-5 mb-0'
        desc={sub_heading?.value} isCenter>
        {heading?.value || ''}
      </Heading>
      <div className="relative max-w-2xl mx-auto">
        {/*renderBg()*/}

        <Image
          className="mx-auto"
          data={clients_say?.nodes[0]?.image?.image || {}}
          width={100}
          alt=""
        />
        <div className={`mt-12 lg:mt-16 relative`}>
          <div
            className="relative flex snap-x snap-mandatory overflow-x-auto -mx-2 sm:-mx-4 hiddenScrollbar "
            ref={sliderRef}
          >
            {clients_say?.nodes.map((item) => (
              <div
                key={item.id}
                className="flex flex-col items-center text-center -- mySnapItem snap-start shrink-0 px-2 sm:px-4 w-full"
              >
                <span className="block text-2xl px-20">"{item.content?.value}"</span>
                <span className="block mt-8 text-2xl font-semibold">
                  {item.name?.value}
                </span>
                <div className="flex items-center space-x-0.5 mt-3.5 text-white">
                  <StarIcon className="w-6 h-6" />
                  {Number(item.stars?.value) >= 2 && (
                    <StarIcon className="w-6 h-6" />
                  )}
                  {Number(item.stars?.value) >= 3 && (
                    <StarIcon className="w-6 h-6" />
                  )}
                  {Number(item.stars?.value) >= 4 && (
                    <StarIcon className="w-6 h-6" />
                  )}
                  {Number(item.stars?.value) >= 5 && (
                    <StarIcon className="w-6 h-6" />
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="absolute  w-full top-0">
            <NextPrev
             onClickNext={() => sliderRef.current?.scrollBy({ left: 300, behavior: 'smooth' })}
             onClickPrev={() => sliderRef.current?.scrollBy({ left: -300, behavior: 'smooth' })}
          />
          </div>
          <ul className="flex justify-center items-center space-x-3 mt-10" role="tablist">
            {clients_say?.nodes.map((_, index) => (
              <li
                key={index}
                className={`h-[1px] w-12 flex items-center justify-center rounded-full cursor-pointer bg-white ${
                  activeIndex === index ? '!h-1' : ''
                }`}
                onClick={() => {
                  const slider = sliderRef.current;
                  if (slider) {
                    const slideWidth = slider.scrollWidth / clients_say?.nodes.length;
                    slider.scrollTo({ left: slideWidth * index, behavior: 'smooth' });
                  }
                }}
              >
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Image
        className="absolute right-0 top-24 w-[90px] lg:w-[180px] lg:top-10"
        width={180}
        height={244}
        src="https://cdn.shopify.com/s/files/1/0641/9742/7365/files/chat-right.png"
        alt="Chat Box with images after"
      />
    </section>
  );
}

export const SECTION_CLIENTS_SAY_FRAGMENT = `#graphql
  fragment ClientSay on Metaobject {
    type
    id
    handle
    title: field(key: "title") {
      type
      key
      value
    }
    name: field(key: "name") {
     type
      key
      value
    }
    stars: field(key: "stars") {
     type
      key
      value
    }
    content: field(key: "content") {
     type
      key
      value
    }
    image: field(key: "image") {
      type
      key
      reference {
        ... on MediaImage {
          image {
            altText
            url
            width
            height
          }
        }
      }
    }
  }

  fragment SectionClientsSay on Metaobject {
    type
    heading: field(key: "heading") {
      key
      value
    }
    sub_heading: field(key: "sub_heading") {
      key
      value
    }
    clients_say: field(key: "clients_say") {
      references(first: 10) {
          nodes {
            ...on Metaobject {
              ...ClientSay
            }
        }
       }
    }
  }
`;
