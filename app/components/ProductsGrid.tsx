import clsx from 'clsx';
import ProductCard from './ProductCard';
import {getImageLoadingPriority} from '~/lib/const';
import {CommonProductCardFragment} from 'storefrontapi.generated';

export function ProductsGrid({
  nodes,
  className = 'mt-8 lg:mt-10',
  isSmall = false,
}: {
  nodes?: CommonProductCardFragment[];
  className?: string;
  isSmall?: boolean;
}) {
  const variantKey = isSmall ? 1 : 0;
  // Sort products so that available products come first

  return (
    <div
      className={clsx(
        'grid sm:grid-cols-2 lg:grid-cols-3 gap-x-28 gap-y-10 mx-5',
        className,
      )}
    >

      {nodes?.map((product, i) => {
          return (
            <ProductCard
              key={product.id}
              product={product}
              loading={getImageLoadingPriority(i)}
              variantKey={variantKey}
            />
          );
        })}
    </div>
  );
}
