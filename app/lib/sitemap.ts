import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';
import type {
  CountryCode,
  LanguageCode,
} from '@shopify/hydrogen/storefront-api-types';

const SITEMAP_INDEX_PREFIX = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
const SITEMAP_INDEX_SUFFIX = `</sitemapindex>`;

const SITEMAP_PREFIX = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`;
const SITEMAP_SUFFIX = `</urlset>`;

type Locale = `${LanguageCode}-${CountryCode}`;

type SITEMAP_INDEX_TYPE =
  | 'pages'
  | 'products'
  | 'collections'
  | 'blogs'
  | 'articles'

/**
 * Generate a sitemap index that links to separate sitemaps for each resource type.
 */
export async function getSitemapIndex({
  storefront,
  request,
  types = ['products', 'pages', 'collections', 'articles'],
  customUrls = [],
}: {
  storefront: LoaderFunctionArgs['context']['storefront'];
  request: Request;
  types?: SITEMAP_INDEX_TYPE[];
  customUrls?: string[];
}) {
  const data = await storefront.query(SITEMAP_INDEX_QUERY, {
    storefrontApiVersion: 'unstable',
  });

  if (!data) {
    throw new Response('No data found', {status: 404});
  }

  const baseUrl = new URL(request.url).origin;

  const body =
    SITEMAP_INDEX_PREFIX +
    types
      .map((type) =>
        getSiteMapLinks(type, data[type].pagesCount.count, baseUrl),
      )
      .join('\n') +
    customUrls
      .map((url) => '<sitemap><loc>' + url + '</loc></sitemap>')
      .join('\n') +
    SITEMAP_INDEX_SUFFIX;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': `max-age=${60 * 60 * 24}`,
    },
  });
}

interface GetSiteMapOptions {
  /** The params object from Remix */
  params: LoaderFunctionArgs['params'];
  /** The Storefront API Client from Hydrogen */
  storefront: LoaderFunctionArgs['context']['storefront'];
  /** A Remix Request object */
  request: Request;
  /** A function that produces a canonical url for a resource. It is called multiple times for each locale supported by the app. */
  getLink: (options: {
    type: string | SITEMAP_INDEX_TYPE;
    baseUrl: string;
    handle?: string;
    locale?: string;
  }) => string;
  /** An array of locales to generate alternate tags */
  locales: string[];
  /** Optionally customize the changefreq property for each URL */
  getChangeFreq?: (options: {
    type: string | SITEMAP_INDEX_TYPE;
    handle: string;
  }) => string;
}

/**
 * Generate a sitemap for a specific resource type.
 */
export async function getSitemap(options: GetSiteMapOptions) {
  const {storefront, request, params, getLink, locales = []} = options;

  if (!params.type || !params.page)
    throw new Response('No data found', {status: 404});

  const type = params.type as keyof typeof QUERIES;

  const query = QUERIES[type];

  if (!query) throw new Response('Not found', {status: 404});

  const data = await storefront.query(query, {
    variables: {
      page: parseInt(params.page, 10),
    },
    storefrontApiVersion: 'unstable',
  });

  const productImagesData = await storefront.query(PRODUCT_IMAGE_QUERY, {
    variables: { first: 100 },
  });

  if (!data?.sitemap?.resources?.items?.length) {
    throw new Response('Not found', {status: 404});
  }

  const baseUrl = new URL(request.url).origin;

  const body =
    SITEMAP_PREFIX +
    data.sitemap.resources.items
      .map((item: {handle: string; updatedAt: string; type?: string}) => {
        const imageNode = productImagesData.products.edges.find(
          (edge: any) => edge.node.handle === item.handle,
        )?.node.featuredImage;

        const imageUrl = imageNode?.url;
        const imageCaption = imageNode?.altText;
        const imageTitle = item.handle.split('-')
                              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                              .join(' ');;

        return renderUrlTag({
          getChangeFreq: options.getChangeFreq,
          url: getLink({
            type: item.type ?? type.replace('products', 'beef-jerky'),
            baseUrl,
            handle: item.handle,
          }).replace('/collections', ''),
          type,
          getLink,
          updatedAt: item.updatedAt,
          handle: item.handle,
          metaobjectType: item.type,
          locales,
          baseUrl,
          imageUrl,
          imageTitle,
          imageCaption
        });
      })
      .join('\n') +
    SITEMAP_SUFFIX;
  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': `max-age=${60 * 60 * 24}`,
    },
  });
}

function getSiteMapLinks(resource: string, count: number, baseUrl: string) {
  let links = ``;

  for (let i = 1; i <= count; i++) {
    links += `<sitemap><loc>${baseUrl}/sitemap/${resource}/${i}.xml</loc></sitemap>`;
  }
  return links;
}

function renderUrlTag({
  url,
  updatedAt,
  locales,
  type,
  getLink,
  baseUrl,
  handle,
  getChangeFreq,
  metaobjectType,
  imageUrl,      // Add image parameters
  imageTitle,
  imageCaption
}: {
  type: SITEMAP_INDEX_TYPE;
  baseUrl: string;
  handle: string;
  metaobjectType?: string;
  getLink: (options: {
    type: string;
    baseUrl: string;
    handle?: string;
    locale?: string;
  }) => string;
  url: string;
  updatedAt: string;
  locales: string[];
  getChangeFreq?: (options: {type: string; handle: string}) => string;
  imageUrl?: string;    // Add optional image-related parameters
  imageTitle?: string;
  imageCaption?: string;
}) {
  return `<url>
  <loc>${url}</loc>
  <lastmod>${updatedAt}</lastmod>
  <changefreq>${
    getChangeFreq
      ? getChangeFreq({type: metaobjectType ?? type, handle})
      : 'daily'
  }</changefreq>
  ${imageUrl && type == 'products' ? `
  <image:image>
    <image:loc>${imageUrl}</image:loc>
    <image:title>${imageTitle ?? ''}</image:title>
    <image:caption>Astro Fresh Jerky ${imageTitle ?? ''} front of bag</image:caption>
  </image:image>` : ''}
</url>
  `.trim();
}

function renderAlternateTag(url: string, locale: string) {
  return `  <xhtml:link rel="alternate" hreflang="${locale}" href="${url}" />`;
}
const PRODUCT_IMAGE_QUERY = `#graphql
    query ProductsWithImages($first: Int!) {
      products(first: $first) {
        edges {
          node {
            handle
            featuredImage {
                  url
            }
          }
        }
      }
    }
` as const;

const PRODUCT_SITEMAP_QUERY = `#graphql
    query SitemapProducts($page: Int!) {
      sitemap(type: PRODUCT) {
        resources(page: $page) {
          items {
            handle
            updatedAt
          }
        }
      }
    }
` as const;

const COLLECTION_SITEMAP_QUERY = `#graphql
    query SitemapCollections($page: Int!) {
      sitemap(type: COLLECTION) {
        resources(page: $page) {
          items {
            handle
            updatedAt
          }
        }
      }
    }
` as const;

const ARTICLE_SITEMAP_QUERY = `#graphql
    query SitemapArticles($page: Int!) {
      sitemap(type: ARTICLE) {
        resources(page: $page) {
          items {
            handle
            updatedAt
          }
        }
      }
    }
` as const;

const PAGE_SITEMAP_QUERY = `#graphql
    query SitemapPages($page: Int!) {
      sitemap(type: PAGE) {
        resources(page: $page) {
          items {
            handle
            updatedAt
          }
        }
      }
    }
` as const;

const BLOG_SITEMAP_QUERY = `#graphql
    query SitemapBlogs($page: Int!) {
      sitemap(type: BLOG) {
        resources(page: $page) {
          items {
            handle
            updatedAt
          }
        }
      }
    }
` as const;


const SITEMAP_INDEX_QUERY = `#graphql
query SitemapIndex {
  products: sitemap(type: PRODUCT) {
    pagesCount {
      count
    }
  }
  collections: sitemap(type: COLLECTION) {
    pagesCount {
      count
    }
  }
  articles: sitemap(type: ARTICLE) {
    pagesCount {
      count
    }
  }
  pages: sitemap(type: PAGE) {
    pagesCount {
      count
    }
  }
  blogs: sitemap(type: BLOG) {
    pagesCount {
      count
    }
  }
}
` as const;

const QUERIES = {
  products: PRODUCT_SITEMAP_QUERY,
  articles: ARTICLE_SITEMAP_QUERY,
  collections: COLLECTION_SITEMAP_QUERY,
  pages: PAGE_SITEMAP_QUERY,
  blogs: BLOG_SITEMAP_QUERY,
};