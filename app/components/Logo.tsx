import React from 'react';
import {Link} from './Link';
import {useRootLoaderData} from '~/lib/root-data';
import {Image} from '@shopify/hydrogen';

export interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({
  className = 'flex-shrink-0 w-10 max-w-28 sm:max-w-32 lg:max-w-none flex text-center',
}) => {
  const rootLoaderData = useRootLoaderData();

  if (!rootLoaderData) {
    return null;
  }

  const shop = rootLoaderData?.layout.shop;

  return (
    <Link
      to="/"
      className={`ttnc-logo flex-shrink-0 inline-block text-slate-900 ${className}`}
    >
      {shop.brand?.logo?.image?.url ? (
        <Image
          className={`block`}
          data={shop.brand?.logo?.image}
          width={shop.brand?.logo?.image.width ?? undefined}
          height={shop.brand?.logo?.image.height ?? undefined}
          alt={shop.name + ' logo'}
          sizes="200px"
        />
      ) : (
        <h1>
          <span className="text-lg sm:text-xl font-semibold line-clamp-2">
            {shop.name}
          </span>
        </h1>
      )}
    </Link>
  );
};

export default Logo;
