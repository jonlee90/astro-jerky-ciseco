import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';

import {getSitemapIndex} from '~/lib/sitemap';

export async function loader({
  request,
  context: {storefront},
}: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const baseUrl = url.origin;

  const response = await getSitemapIndex({
    storefront,
    request,
    types: ['products', 'pages', 'collections', 'articles', 'metaObjects'],
    customUrls: [`${baseUrl}/sitemap-empty.xml`],
  });

  response.headers.set('Oxygen-Cache-Control', `max-age=${60 * 60 * 24}`);
  response.headers.set('Vary', 'Accept-Encoding, Accept-Language');

  return response;
}