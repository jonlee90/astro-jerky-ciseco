import React, {type FC} from 'react';
import {parseSection} from '~/utils/parseSection';
import {Image, type ParsedMetafields} from '@shopify/hydrogen';
import type {
  HeroItemFragment,
  SectionHeroFragment,
} from 'storefrontapi.generated';
import ButtonPrimary from '~/components/Button/ButtonPrimary';
import { ButtonPressable } from '~/components/Button/ButtonPressable';
import { IconCow } from '~/components/Icon';

export function SectionHero(props: SectionHeroFragment) {
  const heroItem = props.hero_item?.reference
    ? parseSection<
        HeroItemFragment,
        {
          heading?: ParsedMetafields['list.single_line_text_field'];
          sub_heading?: ParsedMetafields['list.single_line_text_field'];
          vertical_image?: ParsedMetafields['list.file_reference'];
          horizontal_image?: ParsedMetafields['list.file_reference'];
        }
      >(props.hero_item?.reference)
    : null;

  if (!heroItem) {
    return null;
  }

  const {cta_button, heading, horizontal_image, sub_heading, vertical_image} =
    heroItem;

  return (
    <section className="section-hero-slider overflow-hidden mx-auto">
      <div className="nc-SectionHero relative overflow-hidden bg-slate-100 ">
        {/* BG */}
        <div>
          {horizontal_image?.image && (
            <Image
              sizes="110vw"
              className="hidden h-full w-full object-cover lg:block"
              data={horizontal_image?.image}
            />
          )}

          {vertical_image?.image && (
            <Image
              sizes="850px"
              className="block h-full w-full lg:hidden"
              data={vertical_image?.image}
            />
          )}
          {!!cta_button?.href?.value && (
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2">
              <ButtonPressable
                  href={cta_button?.href?.value || ''}
                  size="h-12 w-56 lg:w-60 lg:h-14"
                  className="mx-auto text-black border-black  border"
                  buttonClass="grid grid-cols-8 py-3 px-8  lg:py-3.5 bg-primary-600 hover:!bg-primary-900"
                >
                    <IconCow className="size-6 text-white col-span-1 fill-black" />
                  <span className='col-span-7 uppercase font-bold'>{cta_button?.text?.value}</span>
                </ButtonPressable>
            </div>
          )}
        </div>

        {/* CONTENT 
        <div className="flex lg:items-center">
          <div className="relative">
            <div className="flex max-w-lg flex-col items-start space-y-5 xl:max-w-2xl xl:space-y-8 ">
              {sub_heading?.value && (
                <span className="font-semibold text-neutral-900 sm:text-xl md:text-2xl">
                  {sub_heading?.value}
                </span>
              )}
              {heading?.value && (
                <h2
                  className="text-3xl font-bold !leading-[115%] text-black sm:text-4xl md:text-5xl xl:text-6xl 2xl:text-7xl "
                  dangerouslySetInnerHTML={{__html: heading?.value}}
                />
              )}
              {!!cta_button?.href?.value && (
                <div className="absolute z-50">
                  <ButtonPressable
                      href={cta_button?.href?.value || ''}
                      size="h-12 w-56 lg:w-60 lg:h-14"
                      className="mx-auto text-white border-black border"
                      buttonClass="grid grid-cols-8 py-3 px-8  lg:py-3.5"
                    >
                      <span className='col-span-7'>{cta_button?.text?.value}</span>
                    </ButtonPressable>
                </div>
              )}
            </div>
          </div>
        </div>*/}
      </div>
    </section>
  );
}

export const SECTION_HERO_FRAGMENT = `#graphql
  fragment SectionHero on Metaobject {
    type
    hero_item: field(key: "hero_item") {
      reference {
          ... on Metaobject {
            ...HeroItem
          }
      }
    }
  }
`;
