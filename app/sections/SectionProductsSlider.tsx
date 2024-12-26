import type {SectionProductsSliderFragment} from 'storefrontapi.generated';
import { SnapGridProducts } from '~/components/SnapGridProducts';
import {SnapSliderProducts} from '~/components/SnapSliderProducts';

export function SectionProductsSlider(props: SectionProductsSliderFragment) {
  const {heading_bold, heading_light, sub_heading, body, collection, style} =
    props;
  const products = collection?.reference?.products;

  return (
    <section 
      id="product-slider" 
      aria-labelledby="product-slider-heading"
      aria-label="Products slider"
    >
      <h2 id="product-slider-heading" className="sr-only">
        {heading_bold?.value || 'Products'}
      </h2>
    {heading_bold?.value == 'Best Sellers' ?
     <SnapGridProducts
      heading_bold={heading_bold?.value}
      products={products?.nodes}
      className={'w-full mx-auto'}

     />
     :
      <SnapSliderProducts
        heading_bold={heading_bold?.value}
        heading_light={heading_light?.value}
        sub_heading={sub_heading?.value}
        products={products?.nodes}
        cardStyle={style?.value as '1' | '2'}
        isSkeleton={!collection}
        className={'w-full mx-auto'}
      />
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
              ...CommonProductCard
            }
          }
        }
      }
    }
  }
`;
