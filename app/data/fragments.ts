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
    description
    media(first: 7) {
      nodes {
        ...Media
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