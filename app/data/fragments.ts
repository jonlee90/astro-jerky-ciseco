export const MEDIA_FRAGMENT = `#graphql
  fragment Media on Media {
    __typename
    mediaContentType
    alt
    previewImage {
      url
    }
    ... on MediaImage {
      id
      image {
        id
        url
        width
        height
      }
    }
    ... on Video {
      id
      sources {
        mimeType
        url
      }
    }
    ... on Model3d {
      id
      sources {
        mimeType
        url
      }
    }
    ... on ExternalVideo {
      id
      embedUrl
      host
    }
  }
`;
export const PRODUCT_MIX_FRAGMENT = `#graphql
  fragment ProductMix on Product {
    id
    title
    tags
    handle
    description
    media(first: 7) {
      nodes {
        ...Media
      }
    }
    flavor_level: metafield(namespace: "custom", key:"flavor_level") {
      value
    }
    small_bag_quantity: metafield(namespace: "custom", key:"small_bag_quantity") {
      value
    }
    big_bag_quantity: metafield(namespace: "custom", key:"big_bag_quantity") {
      value
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    variants(first: 2) {
      nodes {
        id
        availableForSale
        image {
          url
          altText
          width
          height
        }
        selectedOptions {
          name
          value
        }
        product {
          handle
          title
        }
      }
    }
  }
  ${MEDIA_FRAGMENT}
`;