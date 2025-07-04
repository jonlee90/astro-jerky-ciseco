import type {AppLoadContext, EntryContext} from '@shopify/remix-oxygen';
import {RemixServer} from '@remix-run/react';
import isbot from 'isbot';
import {renderToReadableStream} from 'react-dom/server';
import {createContentSecurityPolicy} from '@shopify/hydrogen';

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  context: AppLoadContext,
) {
  const {nonce, header, NonceProvider} = createContentSecurityPolicy({
    shop: {
      checkoutDomain: context.env.PUBLIC_CHECKOUT_DOMAIN,
      storeDomain: context.env.PUBLIC_STORE_DOMAIN,
    },
    scriptSrc: [
      "'self'",
      ...(process.env.NODE_ENV !== 'production' ? ['http://localhost:*'] : []),
      'https://cdn.shopify.com',
      'https://d3hw6dc1ow8pp2.cloudfront.net',
      'https://d3g5hqndtiniji.cloudfront.net',
      'https://*.googletagmanager.com',
      'https://*.klaviyo.com',
      'https://*.astrofreshjerky.com',
      'https://d3hw6dc1ow8pp2.cloudfront.net',
      'https://dov7r31oq5dkj.cloudfront.net',
      'https://*.okendo.io',
      'https://www.google.com',
      'https://www.gstatic.com',
      'data:',
    ],
    defaultSrc: [
      "'self'",
      ...(process.env.NODE_ENV !== 'production' ? ['http://localhost:*'] : []),
      'https://cdn.shopify.com',
      'https://d3hw6dc1ow8pp2.cloudfront.net',
      'https://d3g5hqndtiniji.cloudfront.net',
      'https://*.googletagmanager.com',
      'https://*.klaviyo.com',
      'https://*.astrofreshjerky.com',
      'https://d3hw6dc1ow8pp2.cloudfront.net',
      'https://dov7r31oq5dkj.cloudfront.net',
      'https://*.okendo.io',
      'https://www.google.com',
      'https://www.gstatic.com',
      'data:',
    ],
    mediaSrc: [
      "'self'",
      'https://d3hw6dc1ow8pp2.cloudfront.net',
      'https://d3g5hqndtiniji.cloudfront.net',
      'https://dov7r31oq5dkj.cloudfront.net',
      'https://*.okendo.io',
    ],
    imgSrc: [
      "'self'",
      'https://cdn.shopify.com',
      'https://*.google-analytics.com',
      'https://*.googletagmanager.com',
      'https://*.klaviyo.com',
      'https://*.cloudfront.net',
      'https://*.astrofreshjerky.com',
      'https://d3hw6dc1ow8pp2.cloudfront.net',
      'https://d3g5hqndtiniji.cloudfront.net',
      'https://dov7r31oq5dkj.cloudfront.net',
      'https://*.okendo.io',
      'data:',
    ],
    styleSrc: [
      "'self'",
      "'unsafe-inline'",
      'https://cdn.shopify.com',
      'http://localhost:*',
      'https://d3hw6dc1ow8pp2.cloudfront.net',
      'https://fonts.googleapis.com',
      'https://*.klaviyo.com',
      'https://*.astrofreshjerky.com',
      'https://d3hw6dc1ow8pp2.cloudfront.net',
      'https://*.okendo.io',
    ],
    fontSrc: [
      "'self'",
      ...(process.env.NODE_ENV !== 'production' ? ['http://localhost:*'] : []),
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
      'https://cdn.shopify.com',
      'https://*.astrofreshjerky.com',
      'https://d3hw6dc1ow8pp2.cloudfront.net',
      'https://dov7r31oq5dkj.cloudfront.net',
      'https://cdn.shopify.com',
      'https://*.okendo.io',
      'data:', // <-- Add this line
    ],
    connectSrc: [
      "'self'",
      'https://monorail-edge.shopifysvc.com',
      ...(process.env.NODE_ENV !== 'production' ? ['http://localhost:*', ''] : []),
      'ws://127.0.0.1:*',
      'https://*.google-analytics.com',
      'https://*.analytics.google.com',
      'https://*.googletagmanager.com',
      'https://*.klaviyo.com',
      'https://*.astrofreshjerky.com',
      'https://*.okendo.io',
      'https://api.raygun.com',
      'https://www.google.com',
      'https://www.gstatic.com',
    ],
    frameSrc: ['https://www.google.com', 'https://www.gstatic.com'],
  });
  const body = await renderToReadableStream(
    <NonceProvider>
      <RemixServer context={remixContext} url={request.url} nonce={nonce} />
    </NonceProvider>,
    {
      nonce,
      signal: request.signal,
      onError(error) {
        // eslint-disable-next-line no-console
        console.error(error);
        responseStatusCode = 500;
      },
    },
  );

  if (isbot(request.headers.get('user-agent'))) {
    await body.allReady;
  }

  responseHeaders.set('Content-Type', 'text/html');
  responseHeaders.set('Content-Security-Policy', header);
  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
