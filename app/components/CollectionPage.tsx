// components/CollectionPage.tsx
import { Await, useLoaderData } from "@remix-run/react";
import { Suspense, useEffect, useState } from "react";
import clsx from "clsx";
import { Analytics, flattenConnection } from "@shopify/hydrogen";
import { ProductsGrid } from "~/components/ProductsGrid";
import PageHeader from "~/components/PageHeader";
import { Empty } from "~/components/Empty";
import { SwitchTab } from "~/components/Tabs";
import ProductFilterHiddenScrollBar from "~/components/ProductFilterHiddenScrollBar";
import { RouteContent } from "~/sections/RouteContent";
import { loadCollectionData } from "~/utils/collectionLoader";

export function CollectionPage() {
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
        aria-label='collection-count-toggle'
        className="container"
      >
        <p className="sr-only">{`Collection contains ${totalProducts} products.`}</p>
        <div className="grid grid-cols-6 items-center text-base font-medium gap-2 mb-8">
          <div className="col-span-2 flex">
            <span className="text-neutral-700 ml-1">
              {totalProducts} Jerkies
            </span>
          </div>
          <div className="flex col-span-4 ml-auto">
            <SwitchTab
              isSmall={isSmall}
              onToggle={(val: string) => onToggle(val)}
              className="justify-self-end"
            />
          </div>
        </div>
      </section>

      <section 
        aria-labelledby="collection-title"
        className='mx-5'>
        <h1 
          id="collection-title"
          className="block text-3xl sm:text-4xl font-semibold capitalize"
        >
          {collection.title.replace(/(<([^>]+)>)/gi, "")}
        </h1>
        <p className="block mt-4 text-lg">
          {collection.description}
        </p>
      </section>

      <ProductFilterHiddenScrollBar
          collectionHandle={collection.handle}
          totalProducts={totalProducts}
        />

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
          <ProductsGrid
            nodes={currentProducts}
            isSmall={isSmall}
            collection={collection}
          />
        ) : (
          <Empty />
        )}
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
