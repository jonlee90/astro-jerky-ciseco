// components/CollectionPage.tsx
import { Await, useLoaderData } from "@remix-run/react";
import { Suspense, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { Analytics, flattenConnection, Image } from "@shopify/hydrogen";
import { ProductsGrid } from "~/components/ProductsGrid";
import PageHeader from "~/components/PageHeader";
import { Empty } from "~/components/Empty";
import { SwitchTab } from "~/components/Tabs";
import ProductFilterHiddenScrollBar from "~/components/ProductFilterHiddenScrollBar";
import { RouteContent } from "~/sections/RouteContent";
import { loadCollectionData } from "~/utils/collectionLoader";
import { SnapGridProducts } from "./SnapGridProducts";
import PageTitleWithBackground from "./PageTitleWithBackground";

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

  const filterRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // Scroll to the ProductFilterHiddenScrollBar if the hash is #product-filter
    const hash = window.location.hash;
    if (hash === '#product-filter' && filterRef.current) {
      filterRef.current.scrollIntoView({ behavior: 'instant' });
    }
  }, [filterRef]);


  const onToggle = (value: string) => setIsSmall(value === "small");

  const totalProducts = noResults ? 0 : currentProducts.length;
  return (
    <div
      className="nc-PageCollection pb-20 lg:pb-28 md:container"
    >
      {/*<section 
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
      </section>*/}

      {collection.horizontal_image?.reference ? 
      <PageTitleWithBackground
        title={collection.title}
        description={collection.description}
        backgroundImage={collection.horizontal_image.reference.image.url}
      />
      :
      <section 
        aria-labelledby="collection-title"
        className="p-10 relative text-center bg-radial-overlay"
        >
        <h2 className="relative text-xl sm:text-2xl italic">Astro's</h2>
        <h1 
          id="collection-title"
          className="block text-3xl sm:text-4xl font-semibold capitalize relative"
        >
          {collection.title.replace(/(<([^>]+)>)/gi, "")}
        </h1>
        <p className="block mt-4 text-lg relative">
          {collection.description}
        </p>
      </section>
      }

      <ProductFilterHiddenScrollBar
          filterRef={filterRef}
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
            <SnapGridProducts
              showHeading={false}
              products={currentProducts}
              className={'w-full mx-auto'}
        
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
