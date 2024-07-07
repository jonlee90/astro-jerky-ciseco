import clsx from 'clsx';
import {
  flattenConnection,
  CartForm,
  Image,
  Money,
  useOptimisticData,
  OptimisticInput,
  type CartReturn,
} from '@shopify/hydrogen';
import type {
  Cart as CartType,
  CartCost,
  CartLine,
  CartDiscountCode,
} from '@shopify/hydrogen/storefront-api-types';
import {Link} from '~/components/Link';
import {FeaturedProducts} from '~/components/FeaturedProducts';
import Prices from './Prices';
import ButtonPrimary from './Button/ButtonPrimary';
import ButtonSecondary from './Button/ButtonSecondary';
import {ArrowLeftIcon} from '@heroicons/react/24/solid';

export function Cart({
  onClose,
  cart,
}: {
  onClose?: () => void;
  cart: CartReturn | null;
}) {
  const linesCount = Boolean(cart?.lines?.edges?.length || 0);

  return (
    <>
      <CartEmpty hidden={linesCount} onClose={onClose} />
      <CartDetails onClose={onClose} cart={cart} />
    </>
  );
}

export function CartDetails({
  cart,
  onClose,
}: {
  cart: CartType | null;
  onClose?: () => void;
}) {
  // @todo: get optimistic cart cost
  const cartHasItems = !!cart && cart.totalQuantity > 0;

  if (!cartHasItems) {
    return null;
  }

  return (
    <div className="flex flex-col justify-between h-full overflow-hidden">
      <div className="flex-1 overflow-auto">
        <CartLines lines={cart?.lines} />
      </div>
      {cartHasItems && (
        <CartSummary
          cost={cart.cost}
          discountCodes={cart.discountCodes}
          checkoutUrl={cart.checkoutUrl}
          onClose={onClose}
        />
      )}
    </div>
  );
}

function CartLines({lines: cartLines}: {lines: CartType['lines'] | undefined}) {
  const currentLines = cartLines ? flattenConnection(cartLines) : [];

  return (
    <section
      aria-labelledby="cart-contents"
      className="overflow-auto transition flex-1"
    >
      <ul className="grid divide-y divide-slate-100 dark:divide-slate-700">
        {currentLines.map((line) => (
          <CartLineItem key={line.id} line={line as CartLine} />
        ))}
      </ul>
    </section>
  );
}

function CartSummary({
  cost,
  children = null,
  checkoutUrl,
  discountCodes,
  onClose,
}: {
  children?: React.ReactNode;
  cost: CartCost;
  discountCodes: CartDiscountCode[];
  checkoutUrl: string;
  onClose?: () => void;
}) {
  return (
    <section
      aria-labelledby="summary-heading"
      className="grid gap-4 py-6 border-t border-slate-100 flex-shrink-0 mt-auto"
    >
      <h2 id="summary-heading" className="sr-only">
        Order summary
      </h2>
      <div className="">
        <div className="flex justify-between text-base font-medium text-gray-900">
          <p>Subtotal</p>
          <>
            {cost?.subtotalAmount?.amount ? (
              <Money data={cost?.subtotalAmount} />
            ) : (
              '-'
            )}
          </>
        </div>
        <p className="mt-0.5 text-sm text-gray-500">
          Shipping and taxes calculated at checkout.
        </p>
        <div className="grid grid-cols-2 gap-2 mt-5">
          <ButtonSecondary
            href="/cart"
            className="flex-1 border border-slate-200 dark:border-slate-700"
            onClick={onClose}
          >
            View cart
          </ButtonSecondary>
          <a className="flex" href={checkoutUrl} target="_self">
            <ButtonPrimary className="flex-1">Check out</ButtonPrimary>
          </a>
        </div>
        <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
          <p>
            or{' '}
            <button
              type="button"
              className="font-medium text-primary-600 hover:text-primary-500"
              onClick={onClose}
            >
              Continue Shopping
              <span aria-hidden="true"> &rarr;</span>
            </button>
          </p>
        </div>
      </div>
    </section>
  );
}

export type OptimisticData = {
  action?: string;
  quantity?: number;
};

function CartLineItem({line}: {line: CartLine}) {
  const optimisticData = useOptimisticData<OptimisticData>(line?.id);

  if (!line?.id) return null;

  const {id, quantity, merchandise} = line;

  if (typeof quantity === 'undefined' || !merchandise?.product) return null;

  return (
    <div
      key={id}
      style={{
        // Hide the line item if the optimistic data action is remove
        // Do not remove the form from the DOM
        display: optimisticData?.action === 'remove' ? 'none' : 'flex',
      }}
      className="flex py-6"
    >
      <div className="relative h-24 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-neutral-100">
        <>
          {merchandise.image && (
            <Link to={`/products/${merchandise.product.handle}`}>
              <Image
                width={110}
                height={110}
                data={merchandise.image}
                className="absolute inset-0 object-cover rounded w-full h-full"
                alt={merchandise.title}
                sizes="(min-width: 1024px) 120px, 100px"
              />
            </Link>
          )}
        </>
      </div>

      <div className="ml-4 flex flex-1 flex-col">
        <div className="flex justify-between gap-5">
          <div>
            <h3 className="text-base font-medium">
              {merchandise?.product?.handle ? (
                <Link to={`/products/${merchandise.product.handle}`}>
                  {merchandise?.product?.title || ''}
                </Link>
              ) : (
                <span>{merchandise?.product?.title || ''}</span>
              )}
            </h3>
            <div className="mt-1 text-sm text-slate-500 dark:text-slate-400 flex pe-3 gap-x-4">
              {merchandise?.selectedOptions.length < 3
                ? (merchandise?.selectedOptions || []).map((option, index) => {
                    // Default Title is not a useful option
                    if (
                      option.name === 'Title' &&
                      option.value === 'Default Title'
                    ) {
                      return null;
                    }
                    if (!option.name || !option.value || index > 3) {
                      return null;
                    }

                    return (
                      <div
                        key={option.name}
                        className={clsx(
                          !!index && 'border-l border-gray-200 pl-4',
                          'capitalize',
                        )}
                      >
                        <span className="line-clamp-1">{option.value}</span>
                      </div>
                    );
                  })
                : merchandise.title || ''}
            </div>
          </div>
          <CartLinePrice line={line} className="mt-0.5" />
        </div>
        <div className="flex flex-1 items-end justify-between text-sm">
          <p className="text-slate-500 dark:text-slate-400">
            {`Qty ` + line.quantity}
          </p>

          <div className="flex">
            <ItemRemoveButton lineId={id} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ItemRemoveButton({lineId}: {lineId: CartLine['id']}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{
        lineIds: [lineId],
      }}
    >
      <button type="submit" className="font-medium text-primary-600">
        Remove
      </button>
      <OptimisticInput id={lineId} data={{action: 'remove'}} />
    </CartForm>
  );
}

export function CartLinePrice({
  line,
  priceType = 'regular',
  withoutTrailingZeros = true,
  ...passthroughProps
}: {
  line: CartLine;
  priceType?: 'regular' | 'compareAt';
  [key: string]: any;
  withoutTrailingZeros?: boolean;
}) {
  if (!line?.cost?.amountPerQuantity || !line?.cost?.totalAmount) return null;

  const moneyV2 =
    priceType === 'regular'
      ? line.cost.totalAmount
      : line.cost.compareAtAmountPerQuantity;

  if (moneyV2 == null) {
    return null;
  }

  return (
    <Prices
      {...passthroughProps}
      withoutTrailingZeros={withoutTrailingZeros}
      price={moneyV2}
    />
  );

  // return <Money withoutTrailingZeros {...passthroughProps} data={moneyV2} />;
}

export function CartEmpty({
  hidden = false,
  onClose,
}: {
  hidden: boolean;
  onClose?: () => void;
}) {
  return (
    <div className={clsx('h-full overflow-auto py-6')} hidden={hidden}>
      <section className="grid gap-6">
        <p>
          Looks like you haven&rsquo;t added anything yet, let&rsquo;s get you
          started!
        </p>
        <div>
          <ButtonPrimary onClick={onClose}>
            <ArrowLeftIcon className="w-4 h-4 me-2" />
            <span>Continue shopping</span>
          </ButtonPrimary>
        </div>
      </section>
      <section className="grid gap-8 pt-16">
        <FeaturedProducts
          count={4}
          heading="Shop Best Sellers"
          onClose={onClose}
          sortKey="BEST_SELLING"
          isCardSmall
        />
      </section>
    </div>
  );
}
