// components/CollectionPage.tsx
import { Await, useLoaderData } from "@remix-run/react";
import { Suspense, useEffect, useState } from "react";
import clsx from "clsx";
import { Analytics, flattenConnection } from "@shopify/hydrogen";
import { SnapGridProducts } from "~/components/SnapGridProducts";
import { Empty } from "~/components/Empty";
import { RouteContent } from "~/sections/RouteContent";
import { loadCollectionData } from "~/utils/collectionLoader";
import {BundleProductCard} from '~/components/BundleProductCard';
import { IconArrowRight } from "./Icon";
import { Link } from "./Link";
import ButtonPrimary from "./Button/ButtonPrimary";
import { c } from "vite/dist/node/types.d-FdqQ54oU";

export function PacksPage() {
  const { collection, routePromise } = useLoaderData<typeof loadCollectionData>();

  const noResults = !collection.products.nodes.length;
  const [isSmall, setIsSmall] = useState(false);
  const [currentProducts, setCurrentProducts] = useState(() =>
    flattenConnection(collection.products)
  );

  useEffect(() => {
    setCurrentProducts(flattenConnection(collection.products));
  }, [collection.products]);

  const onToggle = (value: string) => setIsSmall(value === "small");

  const totalProducts = noResults ? 0 : currentProducts.length;
  const packDescriptions = [
    {
      handle: 'the-classic-pack-3-bags',
      products: ['Honey Teriyaki', 'Supernova Hot', 'Sweet & Spicy']
    },
    {
      handle: 'the-sweet-spicy-pack-3-bags',
      products: ['Big Bang Hot', 'Supernova Hot', 'Sweet & Spicy']
    },
    {
      handle: 'the-hot-pack-3-bags',
      products: ['Big Bang Hot', 'South West Hot', 'Supernova Hot']
    },
    {
      handle: 'the-sweet-pack-3-bags',
      products: ['Whiskey BBQ', 'Honey Teriyaki', 'Milky Way BBQ']
    },
    {
      handle: 'the-savory-pack-3-bags',
      products: ['Sweet & Spicy', 'Peppered', 'Astro\'s Original']
    }
  ];
  return (
    <div
      className="nc-PageCollection pt-10 lg:pt-20 pb-20 lg:pb-28 xl:pb-32 space-y-20 sm:space-y-24 lg:space-y-28"
    >
      <div className="container space-y-14 lg:space-y-24">

      <section 
        aria-labelledby="collection-title"
        className='mx-5'>
        <h1 
          id="collection-title"
          className="block text-3xl sm:text-4xl font-semibold capitalize"
        >
          {collection.title.replace(/(<([^>]+)>)/gi, "")}
        </h1>
        <div
          className="block mt-4 text-lg"
          dangerouslySetInnerHTML={{
            __html: collection.descriptionHtml || '',
          }}
        />
      </section>
      <section 
        aria-labelledby="product-list"
        className="sm-only:p-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid gap-6 border-black"
        role="region"
      >
        <h2 id="product-list" className="sr-only">List of Products</h2>
        <div aria-live="polite" aria-atomic="true" className="sr-only">
          {noResults
            ? "No products available."
            : `Displaying ${totalProducts} products.`}
        </div>
        
        
          {currentProducts.map((product) => {
            const updatedProduct = {
              ...product,
              title:
                product.handle === "the-classic-pack-3-bags"
                  ? product.title.replace(" - 3 Bags", " - (Best Seller)")
                  : product.title,
            };
            return (
            <BundleProductCard
              key={updatedProduct.id}
              product={updatedProduct}
              urlPrefix={"beef-jerky"}
              packDescriptions={packDescriptions}
            />
          )})}
        {/*!noResults ? (
          <SnapGridProducts
            products={currentProducts}
            showHeading={false}
            classOverride="grid grid-cols-2 lg:grid-cols-3 gap-7 md:gap-10 lg:gap-x-15 custom-grid"
            isPacksPage={true}
          />
        ) : (
          <Empty />
        )*/}
      </section>
      


      <section
        className="text-center mt-20 grid grid-cols-1 gap-5 container text-lg"
        aria-label='bundle page button container'>
          <h2 className="text-2xl font-bold">Want full control over your flavor mission?</h2>
          <p>You can also build your own custom jerky bundle from over 12 mouthwatering flavors. Tailor it to your cravings, your adventure, or gift it to someone who deserves a cosmic snacking experience.</p>
          <Link to={`/bundle`} >
            <ButtonPrimary className='!bg-neutral-900 hover:!bg-neutral-700 focus:!ring-neutral-600' aria-label="bundle page button">
                <span>BUILD CUSTOM PACK</span>
                <IconArrowRight className="w-4 h-4 ms-2" />
            </ButtonPrimary>
          </Link>
      </section>

      <Suspense fallback={<div className="h-32" />}>
        <Await
          errorElement="There was a problem loading route's content sections"
          resolve={routePromise}
        >
          {({ route }) => (
            <RouteContent
              route={route}
              className="space-y-20 sm:space-y-24 lg:space-y-28"
            />
          )}
        </Await>
      </Suspense>

      <Analytics.CollectionView 
        data={{
          collection: {
            id: collection.id,
            handle: collection.handle
          }
        }}
      />
      </div>
    </div>
  );
}
