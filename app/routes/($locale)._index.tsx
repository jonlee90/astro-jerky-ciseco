import {
  type ActionFunctionArgs,
  defer,
  json,
  type LoaderFunctionArgs,
  redirect,
} from '@shopify/remix-oxygen';
import {type MetaArgs, useLoaderData} from '@remix-run/react';
import {getSeoMeta} from '@shopify/hydrogen';
import {seoPayload} from '~/lib/seo.server';
import {routeHeaders} from '~/data/cache';
import {ADD_SUBSCRIBER_MUTATION} from '~/data/commonFragments';
import {getLoaderRouteFromMetaobject} from '~/utils/getLoaderRouteFromMetaobject';
import {RouteContent} from '~/sections/RouteContent';
import clsx from 'clsx';

export const headers = routeHeaders;

export async function loader({params, context, request}: LoaderFunctionArgs) {
  const {language, country} = context.storefront.i18n;
  if (
    params.locale &&
    params.locale.toLowerCase() !== `${language}-${country}`.toLowerCase()
  ) {
    // If the locale URL param is defined, yet we still are on `EN-US`
    // the the locale param must be invalid, send to the 404 page
    throw new Response(null, {status: 404});
  }

  const {shop} = await context.storefront.query(HOMEPAGE_SEO_QUERY, {
    variables: {country, language},
  });
  const seo = seoPayload.home();

  //
  const {route} = await getLoaderRouteFromMetaobject({
    params,
    context,
    request,
    handle: 'route-home',
  });

  if (!route) {
    return redirect(params?.locale ? `${params.locale}/products` : '/products');
  }

  return defer({
    shop,
    route,
    seo,
  });
}

export async function action({request, context}: ActionFunctionArgs) {
  const {storefront} = context;

  // Action handle Wishlist form submission
  const formData = await request.formData();
  const {_action, product_handle, is_liked, new_subscribe_email, ...value} =
    Object.fromEntries(formData);

  //  add new subscriber
  if (_action === 'add_new_subscribe' && new_subscribe_email) {
    const customerCreateData = await storefront.mutate(
      ADD_SUBSCRIBER_MUTATION,
      {
        variables: {
          email: new_subscribe_email.toString(),
          // create a new customer with a random password
          password: Math.random().toString(36).substring(7),
        },
      },
    );
    return json(customerCreateData);
  }

  return json({
    message: '_Index route - Hello, World!',
  });
}

export const meta = ({matches}: MetaArgs<typeof loader>) => {
  return getSeoMeta(...matches.map((match) => (match?.data as any)?.seo));
};

export default function Homepage() {
  const {route} = useLoaderData<typeof loader>();

  return (
    <div className={clsx('page-home', 'pb-20 lg:pb-28 xl:pb-32')}>
      {/* 3. Render the route's content sections */}
      <RouteContent route={route} />
    </div>
  );
}

export const HOMEPAGE_SEO_QUERY = `#graphql
  query seoCollectionContent($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    shop {
      name
      description
    }
  }
` as const;
