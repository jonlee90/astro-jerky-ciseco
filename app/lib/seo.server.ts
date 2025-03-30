import {type SeoConfig} from '@shopify/hydrogen';
import type {
  Article,
  Blog,
  Collection,
  Page,
  Product,
  ProductVariant,
  ShopPolicy,
  Image,
} from '@shopify/hydrogen/storefront-api-types';
import type {
  Article as SeoArticle,
  BreadcrumbList,
  Blog as SeoBlog,
  CollectionPage,
  Offer,
  Organization,
  Product as SeoProduct,
  WebPage,
} from 'schema-dts';

import type {ShopFragment, ProductMixFragment} from 'storefrontapi.generated';

function root({
  shop,
  url,
}: {
  shop: ShopFragment;
  url: Request['url'];
}): SeoConfig {
  return {
    title: shop?.name || 'Astro Fresh Jerky',
    titleTemplate: '%s | High Protein Snacks - Astro Fresh Jerky',
    description: truncate(shop?.description ?? "Handcrafted premium beef jerky made using 100% USA Angus Beef in LA since 2013. Family owned and made using high quality beef and spice."),
    handle: '@AstroFreshJerky',
    url,
    robots: {
      noIndex: false,
      noFollow: false,
    },
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: shop.name || 'Astro Fresh Jerky',
      description: shop?.description || 'Handcrafted premium beef jerky made using 100% USA Angus Beef in LA since 2013. Family owned and made using high quality beef and spice.',
      logo: shop.brand?.logo?.image?.url,
      sameAs: [
        'https://twitter.com/astrofreshjerky',
        'https://facebook.com/astrofreshjerky',
        'https://instagram.com/astrofreshjerky',
        'https://pinterest.com/astrofreshjerky',
      ],
      url,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${url}search?q={search_term}`,
        query: "required name='search_term'",
      },
    },
  };
}

function home(): SeoConfig {
  return {
    title: 'Home',
    titleTemplate: "Astro Fresh Jerky: Beef Jerky, Protein Snacks, Chicken Jerky, Meat Snacks",
    description: "Handcrafted premium beef jerky made using 100% USA Angus Beef in LA since 2013. Family owned and made using high quality beef and spice.",
    robots: {
      noIndex: false,
      noFollow: false,
    },
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Astro Fresh Jerky',
      description: 'Handcrafted premium beef jerky made using 100% USA Angus Beef in LA since 2013. Family owned and made using high quality beef and spice.',
      publisher: {
        '@type': 'Organization',
        name: 'Astro Fresh Jerky',
        logo: {
          '@type': 'ImageObject',
          url: 'https://cdn.shopify.com/s/files/1/0641/9742/7365/files/astro-logo.png', // Your website logo URL
        }
      }
    },
  };
}

function stores(): SeoConfig {
  return {
    title: 'Stores',
    titleTemplate: '%s | Astro Fresh Jerky',
    description: 'All Astro Fresh Jerky stores',
    robots: {
      noIndex: false,
      noFollow: false,
    },
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Stores',
    },
  };
}

type SelectedVariantRequiredFields = Pick<ProductVariant, 'sku'> & {
  image?: null | Partial<Image>;
};

type ProductRequiredFields = Pick<
  Product,
  'title' | 'description' | 'vendor' | 'seo'
> & {
  variants: {
    nodes: Array<
      Pick<
        ProductVariant,
        'sku' | 'price' | 'selectedOptions' | 'availableForSale'
      >
    >;
  };
};

function productJsonLd({
  product,
  selectedVariant,
  url,
}: {
  product: ProductRequiredFields;
  selectedVariant: SelectedVariantRequiredFields;
  url: Request['url'];
}): SeoConfig['jsonLd'] {
  const origin = new URL(url).origin;
  const variants = product.variants.nodes;
  const description = truncate(
    product?.seo?.description ?? product?.description,
  );
  const offers: Offer[] = (variants || []).map((variant) => {
    const variantUrl = new URL(url);
    for (const option of variant.selectedOptions) {
      variantUrl.searchParams.set(option.name, option.value);
    }
    const availability = variant.availableForSale
      ? 'https://schema.org/InStock'
      : 'https://schema.org/OutOfStock';

    return {
      '@type': 'Offer',
      availability,
      price: parseFloat(variant.price.amount),
      priceCurrency: variant.price.currencyCode,
      sku: variant?.sku ?? '',
      url: variantUrl.toString(),
    };
  });
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Products',
          item: `${origin}/products`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: product.title,
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      brand: {
        '@type': 'Brand',
        name: product.vendor,
      },
      description,
      image: [selectedVariant?.image?.url ?? ''],
      name: product.title,
      offers,
      sku: selectedVariant?.sku ?? '',
      url,
    },
  ];
}

function product({
  product,
  url,
  selectedVariant,
}: {
  product: ProductRequiredFields;
  selectedVariant: SelectedVariantRequiredFields;
  url: Request['url'];
}): SeoConfig {
  const description = truncate(
    product?.seo?.description ?? product?.description ?? '',
  );
  return {
    title: product?.seo?.title ?? product?.title,
    titleTemplate: '%s - Astro Fresh Jerky',
    description,
    url,
    media: selectedVariant?.image,
    jsonLd: productJsonLd({product, selectedVariant, url}),
  };
}

type CollectionRequiredFields = Omit<
  Collection,
  'products' | 'descriptionHtml' | 'metafields' | 'image' | 'updatedAt'
> & {
  products: {nodes: Pick<Product, 'handle'>[]};
  image?: null | Pick<Image, 'url' | 'height' | 'width' | 'altText'>;
  descriptionHtml?: null | Collection['descriptionHtml'];
  updatedAt?: null | Collection['updatedAt'];
  metafields?: null | Collection['metafields'];
};

function collectionJsonLd({
  url,
  collection,
}: {
  url: Request['url'];
  collection: CollectionRequiredFields;
}): SeoConfig['jsonLd'] {
  const siteUrl = new URL(url);
  const itemListElement: CollectionPage['mainEntity'] =
    collection.products.nodes.map((product, index) => {
      return {
        '@type': 'ListItem',
        position: index + 1,
        url: `/beef-jerky/${product.handle}`,
      };
    });

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Collections',
          item: `${siteUrl.host}/collections`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: collection.title,
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: collection?.seo?.title ?? collection?.title ?? '',
      description: truncate(
        collection?.seo?.description ?? collection?.description ?? '',
      ),
      image: collection?.image?.url,
      url: `/collections/${collection.handle}`,
      mainEntity: {
        '@type': 'ItemList',
        itemListElement,
      },
    },
  ];
}

function collection({
  collection,
  url,
}: {
  collection: CollectionRequiredFields;
  url: Request['url'];
}): SeoConfig {
  return {
    title: collection?.seo?.title ?? collection?.title,
    description: truncate(
      collection?.seo?.description ?? collection?.description ?? '',
    ),
    titleTemplate: '%s | High Protein Snacks - Astro Fresh Jerky',
    media: {
      type: 'image',
      url: collection?.image?.url,
      height: collection?.image?.height,
      width: collection?.image?.width,
      altText: collection?.image?.altText,
    },
    jsonLd: collectionJsonLd({collection, url}),
  };
}

type CollectionListRequiredFields = {
  nodes: Omit<CollectionRequiredFields, 'products'>[];
};

function collectionsJsonLd({
  url,
  collections,
}: {
  url: Request['url'];
  collections: CollectionListRequiredFields;
}): SeoConfig['jsonLd'] {
  const itemListElement: CollectionPage['mainEntity'] = collections.nodes.map(
    (collection, index) => {
      return {
        '@type': 'ListItem',
        position: index + 1,
        url: `/collections/${collection.handle}`,
      };
    },
  );

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Collections',
    description: 'All collections',
    url,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement,
    },
  };
}

function listCollections({
  collections,
  url,
}: {
  collections: CollectionListRequiredFields;
  url: Request['url'];
}): SeoConfig {
  return {
    title: 'Collections',
    titleTemplate: 'Best Beef Jerky Flavors | High Protein Snacks - Astro Fresh Jerky',
    description: 'Try our best handcrafted beef jerky flavors, made with 100% USA Angus Beef.',
    url,
    jsonLd: collectionsJsonLd({collections, url}),
  };
}
function listBundles({
  bundleProducts,
  url,
}: {
  bundleProducts: any;
  url: Request['url'];
}): SeoConfig {
  return {
    title: 'Bundle Packs',
    titleTemplate: 'Bundle Packs | High Protein Snacks - Astro Fresh Jerky',
    description: 'Mix & Match between 12 different beef jerky flavors to create a custom order',
    url,
    jsonLd: bundlesJsonLd({bundleProducts, url}),
  };
}
function bundlesJsonLd({
  url,
  bundleProducts,
}: {
  url: Request['url'];
  bundleProducts: any;
}): SeoConfig['jsonLd'] {
  const itemListElement = bundleProducts.map(
    (bundle, index) => {
      return {
        '@type': 'ListItem',
        position: index + 1,
        url: `/bundle/${bundle.handle}`,
      };
    },
  );

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Bundles',
    description: 'All Bundles',
    url,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement,
    },
  };
}
function bundle({
  bundleHandle,
  url
}: {
  bundleHandle: string;
  url: Request['url'];
}): SeoConfig {
const title = bundleHandle.split('-') // Split the string on hyphens
.map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
.join(' '); // Join the words with a space;

  return {
    title: title,
    titleTemplate: '%s | High Protein Snacks - Astro Fresh Jerky',
    description: 'Mix & Match between 12 different Beef Jerky flavors to create a custom order.',
    url
  };
}

function article({
  article,
  url,
}: {
  article: Pick<
    Article,
    'title' | 'contentHtml' | 'seo' | 'publishedAt' | 'excerpt'
  > & {
    image?: null | Pick<
      NonNullable<Article['image']>,
      'url' | 'height' | 'width' | 'altText'
    >;
  };
  url: Request['url'];
}): SeoConfig {
  return {
    title: article?.seo?.title ?? article?.title,
    description: truncate(article?.seo?.description ?? ''),
    titleTemplate: '%s | Astro Fresh Jerky',
    url,
    media: {
      type: 'image',
      url: article?.image?.url,
      height: article?.image?.height,
      width: article?.image?.width,
      altText: article?.image?.altText,
    },
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      alternativeHeadline: article.title,
      articleBody: article.contentHtml,
      datePublished: article?.publishedAt,
      description: truncate(
        article?.seo?.description || article?.excerpt || '',
      ),
      headline: article?.seo?.title || '',
      image: article?.image?.url,
      url,
    },
  };
}

function blog({
  blog,
  url,
}: {
  blog: Pick<Blog, 'seo' | 'title'>;
  url: Request['url'];
}): SeoConfig {
  return {
    title: blog?.seo?.title,
    description: truncate(blog?.seo?.description || ''),
    titleTemplate: '%s | Astro Fresh Jerky',
    url,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: blog?.seo?.title || blog?.title || '',
      description: blog?.seo?.description || '',
      url,
    },
  };
}

function page({
  page,
  url,
}: {
  page: Pick<Page, 'title' | 'seo'>;
  url: Request['url'];
}): SeoConfig {
  return {
    description: truncate(page?.seo?.description || ''),
    title: page?.seo?.title ?? page?.title,
    titleTemplate: '%s | Astro Fresh Jerky',
    url,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: page.title,
    },
  };
}

function policy({
  policy,
  url,
}: {
  policy: Pick<ShopPolicy, 'title' | 'body'>;
  url: Request['url'];
}): SeoConfig {
  return {
    description: truncate(policy?.body ?? ''),
    title: policy?.title,
    titleTemplate: '%s | Astro Fresh Jerky',
    url,
  };
}

function policies({
  policies,
  url,
}: {
  policies: Array<Pick<ShopPolicy, 'title' | 'handle'>>;
  url: Request['url'];
}): SeoConfig {
  const origin = new URL(url).origin;
  const itemListElement: BreadcrumbList['itemListElement'] = policies
    .filter(Boolean)
    .map((policy, index) => {
      return {
        '@type': 'ListItem',
        position: index + 1,
        name: policy.title,
        item: `${origin}/policies/${policy.handle}`,
      };
    });
  return {
    title: 'Policies',
    titleTemplate: '%s | Astro Fresh Jerky',
    description: 'Astro Fresh Jerky store policies',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement,
      },
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        description: 'Astro Fresh Jerky store policies',
        name: 'Policies',
        url,
      },
    ],
  };
}

export const seoPayload = {
  stores,
  article,
  blog,
  collection,
  home,
  listCollections,
  page,
  policies,
  policy,
  product,
  root,
  bundle,
  listBundles
};

/**
 * Truncate a string to a given length, adding an ellipsis if it was truncated
 * @param str - The string to truncate
 * @param num - The maximum length of the string
 * @returns The truncated string
 * @example
 * ```js
 * truncate('Hello world', 5) // 'Hello...'
 * ```
 */
function truncate(str: string, num = 155): string {
  if (typeof str !== 'string') return '';
  if (str.length <= num) {
    return str;
  }
  return str.slice(0, num - 3) + '...';
}
