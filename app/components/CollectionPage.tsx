// components/CollectionPage.tsx
import { Await, useLoaderData } from "@remix-run/react";
import { Suspense, useEffect, useState } from "react";
import clsx from "clsx";
import { flattenConnection } from "@shopify/hydrogen";
import { ProductsGrid } from "~/components/ProductsGrid";
import PageHeader from "~/components/PageHeader";
import { Empty } from "~/components/Empty";
import { SwitchTab } from "~/components/Tabs";
import ProductFilterHiddenScrollBar from "~/components/ProductFilterHiddenScrollBar";
import { RouteContent } from "~/sections/RouteContent";

export function CollectionPage() {
  const { collection, routePromise } = useLoaderData<typeof loader>();

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
      className={clsx(
        "nc-PageCollection pt-8 lg:pt-14 pb-20 lg:pb-28 xl:pb-32",
        "space-y-20 sm:space-y-24 lg:space-y-28"
      )}
    >
      <div className="md:container">
        <div className="space-y-14 lg:space-y-24">
          <div className="container">
            <div className="grid grid-cols-6 items-center text-sm font-medium gap-2 text-neutral-500 mb-2">
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
            <PageHeader
              title={collection.title.replace(/(<([^>]+)>)/gi, "")}
              hasBreadcrumb={false}
              breadcrumbText={collection.title}
            />
          </div>
          <div className="!mt-8 !lg:mt-14">
            <ProductFilterHiddenScrollBar
              collectionHandle={collection.handle}
            />
            {!noResults ? (
              <ProductsGrid
                nodes={currentProducts}
                isSmall={isSmall}
                collection={collection}
              />
            ) : (
              <Empty />
            )}
          </div>
        </div>
      </div>

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
    </div>
  );
}
