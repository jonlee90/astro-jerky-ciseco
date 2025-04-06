// components/CollectionPage.tsx
import { Await, useLoaderData } from "@remix-run/react";
import { Suspense, useEffect, useState } from "react";
import clsx from "clsx";
import { Analytics, flattenConnection } from "@shopify/hydrogen";
import { SnapGridProducts } from "~/components/SnapGridProducts";
import { Empty } from "~/components/Empty";
import { RouteContent } from "~/sections/RouteContent";
import { loadCollectionData } from "~/utils/collectionLoader";
import { motion } from "framer-motion";
import { IconArrowRight } from "./Icon";
import { Link } from "./Link";
import ButtonPrimary from "./Button/ButtonPrimary";

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

  return (
    <div
      className="nc-PageCollection pt-8 lg:pt-14 pb-20 lg:pb-28 md:container"
    >
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
          className="block mt-4 text-sm sm:text-base"
          dangerouslySetInnerHTML={{
            __html: collection.descriptionHtml || '',
          }}
        />
      </section>
      <section 
        aria-labelledby="product-list"
        role="region"
      >
        <h2 id="product-list" className="sr-only">List of Products</h2>
        <div aria-live="polite" aria-atomic="true" className="sr-only">
          {noResults
            ? "No products available."
            : `Displaying ${totalProducts} products.`}
        </div>
        {!noResults ? (
          <SnapGridProducts
            products={currentProducts}
            showHeading={false}
            classOverride="grid grid-cols-2 lg:grid-cols-3 gap-5 md:gap-10 lg:gap-x-15 custom-grid"
          />
        ) : (
          <Empty />
        )}
      </section>
      


      <section
        className="text-center mt-20 grid grid-cols-1 gap-5 container"
        aria-label='bundle page button container'>
          <h2 className="text-lead font-bold">Want full control over your flavor mission?</h2>
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
  );
}
