import {Money} from '@shopify/hydrogen';
import {type Maybe, type MoneyV2} from '@shopify/hydrogen/storefront-api-types';
import {type FC} from 'react';

export interface PricesProps {
  className?: string;
  price?: Pick<MoneyV2, 'amount' | 'currencyCode'>;
  compareAtPrice?: Maybe<Pick<MoneyV2, 'amount' | 'currencyCode'>>;
  contentClass?: string;
  compareAtPriceClass?: string;
  withoutTrailingZeros?: boolean;
}

const Prices: FC<PricesProps> = ({
  className = '',
  price,
  compareAtPrice,
  contentClass = 'py-1 px-2 md:py-1.5 md:px-2.5 text-lead font-medium',
  compareAtPriceClass = 'text-sm text-slate-500',
  withoutTrailingZeros,
}) => {
  return (
    <div className={`${className}`}>
      <div
        className={`flex text-lead items-center ${contentClass}`}
      >
        {price ? (
          <Money
            withoutTrailingZeros={withoutTrailingZeros}
            className="!leading-none"
            data={price}
          />
        ) : null}
        {compareAtPrice && price && compareAtPrice.amount > price.amount ? (
          <s className={`ms-1 ${compareAtPriceClass}`}>
            <Money
              withoutTrailingZeros={withoutTrailingZeros}
              data={compareAtPrice}
            />
          </s>
        ) : null}
      </div>
    </div>
  );
};

export default Prices;
