import {Image, type ParsedMetafields} from '@shopify/hydrogen';
import {parseSection} from '~/utils/parseSection';
import {useFetcher} from '@remix-run/react';
import type {
  SectionProductDisplayFragment
} from 'storefrontapi.generated';
import Logo from '~/components/Logo';
import ButtonPrimary from '~/components/Button/ButtonPrimary';
import ButtonSecondary from '~/components/Button/ButtonSecondary';
import ButtonCircle from '~/components/Button/ButtonCircle';
import {Badge, badgeColors} from '~/components/badge';
import {
  ArrowRightIcon,
  CheckCircleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';
import Input from '~/components/MyInput';
import clsx from 'clsx';
import { hexToRgba } from '~/lib/utils';

export function SectionProductDisplay(props: SectionProductDisplayFragment) {


  return (
    <section
      className={`section-image-with-text`}
    >
      <div
        className={clsx(['1' 
        ])}
      >

        {/* IMAGE */}
        <div
          className={clsx([
            'w-full h-full','relative block',
          ])}
        >
        </div>
        {/* CONTENT */}
        <div
          className={clsx([])}
        >
         
         
        </div>

      </div>
    </section>
  );
}

export const SECTION_PRODUCT_DISPLAY_FRAGMENT = `#graphql
  fragment SectionProductDisplay on Metaobject {
    type
    title: field(key: "title") {
      type
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
              ...CommonProductCard
            }
          }
        }
      }
    }
  }
`;
