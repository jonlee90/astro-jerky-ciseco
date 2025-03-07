# Hydrogen upgrade guide: 2024.10.0 to 2025.1.2

----

## Features

### Enable Remix `v3_singleFetch` future flag [#2708](https://github.com/Shopify/hydrogen/pull/2708)

#### Step: 1. In your `vite.config.ts`, add the single fetch future flag [#2708](https://github.com/Shopify/hydrogen/pull/2708)

[docs](https://remix.run/docs/en/main/guides/single-fetch)
[#2708](https://github.com/Shopify/hydrogen/pull/2708)
```diff
+  declare module "@remix-run/server-runtime" {
+    interface Future {
+     v3_singleFetch: true;
+    }
+  }

  export default defineConfig({
    plugins: [
      hydrogen(),
      oxygen(),
      remix({
        presets: [hydrogen.preset()],
        future: {
          v3_fetcherPersist: true,
          v3_relativeSplatPath: true,
          v3_throwAbortReason: true,
          v3_lazyRouteDiscovery: true,
+         v3_singleFetch: true,
        },
      }),
      tsconfigPaths(),
    ],
```

#### Step: 2. In your `entry.server.tsx`, add `nonce` to the `<RemixServer>` [#2708](https://github.com/Shopify/hydrogen/pull/2708)

[docs](https://remix.run/docs/en/main/guides/single-fetch)
[#2708](https://github.com/Shopify/hydrogen/pull/2708)
```diff
const body = await renderToReadableStream(
 <NonceProvider>
   <RemixServer
     context={remixContext}
     url={request.url}
+     nonce={nonce}
   />
 </NonceProvider>,
```

#### Step: 3. Update the shouldRevalidate function in root.tsx [#2708](https://github.com/Shopify/hydrogen/pull/2708)

[docs](https://remix.run/docs/en/main/guides/single-fetch)
[#2708](https://github.com/Shopify/hydrogen/pull/2708)
```diff
export const shouldRevalidate: ShouldRevalidateFunction = ({
  formMethod,
  currentUrl,
  nextUrl,
-  defaultShouldRevalidate,
}) => {
  // revalidate when a mutation is performed e.g add to cart, login...
  if (formMethod && formMethod !== 'GET') return true;

  // revalidate when manually revalidating via useRevalidator
  if (currentUrl.toString() === nextUrl.toString()) return true;

-  return defaultShouldRevalidate;
+  return false;
};
```

#### Step: 4. Update `cart.tsx` to add a headers export and update to `data` import usage [#2708](https://github.com/Shopify/hydrogen/pull/2708)

[docs](https://remix.run/docs/en/main/guides/single-fetch)
[#2708](https://github.com/Shopify/hydrogen/pull/2708)
```diff
    import {
  -  json,
  +  data,
      type LoaderFunctionArgs,
      type ActionFunctionArgs,
      type HeadersFunction
    } from '@shopify/remix-oxygen';
  + export const headers: HeadersFunction = ({actionHeaders}) => actionHeaders;

    export async function action({request, context}: ActionFunctionArgs) {
      ...
  -   return json(
  +   return data(
        {
          cart: cartResult,
          errors,
          warnings,
          analytics: {
            cartId,
          },
        },
        {status, headers},
      );
    }

    export async function loader({context}: LoaderFunctionArgs) {
      const {cart} = context;
 -    return json(await cart.get());
 +    return await cart.get();
    }
 ```

#### Step: 5. Deprecate `json` and `defer` import usage from `@shopify/remix-oxygen` [#2708](https://github.com/Shopify/hydrogen/pull/2708)

[docs](https://remix.run/docs/en/main/guides/single-fetch)
[#2708](https://github.com/Shopify/hydrogen/pull/2708)
```diff
- import {json} from "@shopify/remix-oxygen";

  export async function loader({}: LoaderFunctionArgs) {
    let tasks = await fetchTasks();
-   return json(tasks);
+   return tasks;
  }
```

```diff
- import {defer} from "@shopify/remix-oxygen";

  export async function loader({}: LoaderFunctionArgs) {
    let lazyStuff = fetchLazyStuff();
    let tasks = await fetchTasks();
-   return defer({ tasks, lazyStuff });
+   return { tasks, lazyStuff };
  }
```


#### Step: 6. If you were using the second parameter of json/defer to set a custom status or headers on your response, you can continue doing so via the new data API: [#2708](https://github.com/Shopify/hydrogen/pull/2708)

[docs](https://remix.run/docs/en/main/guides/single-fetch)
[#2708](https://github.com/Shopify/hydrogen/pull/2708)
```diff
-  import {json} from "@shopify/remix-oxygen";
+  import {data, type HeadersFunction} from "@shopify/remix-oxygen";

+  /**
+   * If your loader or action is returning a response with headers,
+   * make sure to export a headers function that merges your headers
+   * on your route. Otherwise, your headers may be lost.
+   * Remix doc: https://remix.run/docs/en/main/route/headers
+   **/
+  export const headers: HeadersFunction = ({loaderHeaders}) => loaderHeaders;

  export async function loader({}: LoaderFunctionArgs) {
    let tasks = await fetchTasks();
-    return json(tasks, {
+    return data(tasks, {
      headers: {
        "Cache-Control": "public, max-age=604800"
      }
    });
  }
```


#### Step: 7. If you are using legacy customer account flow or multipass, there are a couple more files that requires updating: [#2708](https://github.com/Shopify/hydrogen/pull/2708)

[docs](https://remix.run/docs/en/main/guides/single-fetch)
[#2708](https://github.com/Shopify/hydrogen/pull/2708)
```diff
+ export const headers: HeadersFunction = ({loaderHeaders}) => loaderHeaders;
```


#### Step: 8. In `routes/account_.register.tsx`, add a `headers` export for `actionHeaders` [#2708](https://github.com/Shopify/hydrogen/pull/2708)

[docs](https://remix.run/docs/en/main/guides/single-fetch)
[#2708](https://github.com/Shopify/hydrogen/pull/2708)
```diff
+ export const headers: HeadersFunction = ({actionHeaders}) => actionHeaders;
```


#### Step: 9. If you are using multipass, in `routes/account_.login.multipass.tsx` [#2708](https://github.com/Shopify/hydrogen/pull/2708)

[docs](https://remix.run/docs/en/main/guides/single-fetch)
[#2708](https://github.com/Shopify/hydrogen/pull/2708)
```diff
+ export const headers: HeadersFunction = ({actionHeaders}) => actionHeaders;
```


#### Step: 10. Update all `json` response wrapper to `remixData` [#2708](https://github.com/Shopify/hydrogen/pull/2708)

[docs](https://remix.run/docs/en/main/guides/single-fetch)
[#2708](https://github.com/Shopify/hydrogen/pull/2708)
```diff
import {
- json,
+ data as remixData,
} from '@shopify/remix-oxygen';

-  return json(
+  return remixData(
    ...
  );
```

### B2B methods and props are now stable [#2736](https://github.com/Shopify/hydrogen/pull/2736)

#### Step: 1. Search for anywhere using `UNSTABLE_getBuyer` and `UNSTABLE_setBuyer` is update accordingly [#2736](https://github.com/Shopify/hydrogen/pull/2736)

[#2736](https://github.com/Shopify/hydrogen/pull/2736)
```diff
- customerAccount.UNSTABLE_getBuyer();
+ customerAccount.getBuyer()

- customerAccount.UNSTABLE_setBuyer({
+ customerAccount.setBuyer({
    companyLocationId,
  });
```

#### Step: 2. Update `createHydrogenContext` to remove the `unstableB2b` option [#2736](https://github.com/Shopify/hydrogen/pull/2736)

[#2736](https://github.com/Shopify/hydrogen/pull/2736)
```diff
  const hydrogenContext = createHydrogenContext({
    env,
    request,
    cache,
    waitUntil,
    session,
    i18n: {language: 'EN', country: 'US'},
-    customerAccount: {
-      unstableB2b: true,
-    },
    cart: {
      queryFragment: CART_QUERY_FRAGMENT,
    },
  });
```

### Add `language` support to `createCustomerAccountClient` and `createHydrogenContext` [#2746](https://github.com/Shopify/hydrogen/pull/2746)

#### Step: 1. If present, the provided `language` will be used to set the `uilocales` property in the Customer Account API request. This will allow the API to return localized data for the provided language. [#2746](https://github.com/Shopify/hydrogen/pull/2746)

[#2746](https://github.com/Shopify/hydrogen/pull/2746)
```ts
// Optional: provide language data to the constructor
const customerAccount = createCustomerAccountClient({
  // ...
  language,
});
```

#### Step: 2. Calls to `login()` will use the provided `language` without having to pass it explicitly via `uiLocales`; however, if the `login()` method is already using its `uilocales` property, the `language` parameter coming from the context/constructor will be ignored. If nothing is explicitly passed, `login()` will default to `context.i18n.language`. [#2746](https://github.com/Shopify/hydrogen/pull/2746)

[#2746](https://github.com/Shopify/hydrogen/pull/2746)
```ts
export async function loader({request, context}: LoaderFunctionArgs) {
  return context.customerAccount.login({
    uiLocales: 'FR', // will be used instead of the one coming from the context
  });
}
```

### Turn on Remix future flag v3_lazyRouteDiscovery [#2702](https://github.com/Shopify/hydrogen/pull/2702)

#### Add the following line to your vite.config.ts and test your app.
[#2702](https://github.com/Shopify/hydrogen/pull/2702)
```diff
export default defineConfig({
  plugins: [
    hydrogen(),
    oxygen(),
    remix({
      presets: [hydrogen.preset()],
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
+        v3_lazyRouteDiscovery: true,
      },
    }),
    tsconfigPaths(),
  ],
```

----

----

## Fixes

### Workaround for "Error: failed to execute 'insertBefore' on 'Node'" that sometimes happen during development. [#2710](https://github.com/Shopify/hydrogen/pull/2710)

#### Update your root.tsx so that your style link tags are actual html link tags
[#2710](https://github.com/Shopify/hydrogen/pull/2710)
```diff
// root.tsx

/**
 * The main and reset stylesheets are added in the Layout component
 * to prevent a bug in development HMR updates.
 *
 * This avoids the "failed to execute 'insertBefore' on 'Node'" error
 * that occurs after editing and navigating to another page.
 *
 * It's a temporary fix until the issue is resolved.
 * https://github.com/remix-run/remix/issues/9242
 */
export function links() {
  return [
-    {rel: 'stylesheet', href: resetStyles},
-    {rel: 'stylesheet', href: appStyles},
    {
      rel: 'preconnect',
      href: 'https://cdn.shopify.com',
    },
    {
      rel: 'preconnect',
      href: 'https://shop.app',
    },
    {rel: 'icon', type: 'image/svg+xml', href: favicon},
  ];
}

...

export function Layout({children}: {children?: React.ReactNode}) {
  const nonce = useNonce();
  const data = useRouteLoaderData<RootLoader>('root');

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
+        <link rel="stylesheet" href={resetStyles}></link>
+        <link rel="stylesheet" href={appStyles}></link>

```
