import type {CartLineUpdateInput} from '@shopify/hydrogen/storefront-api-types';
import {CartForm, Image, type OptimisticCartLine} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import {Link} from '@remix-run/react';
import {useAside} from './Aside';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import { IconRemove } from './Icon';
import Prices from './Prices';
import type {CartLayout} from '~/components/CartMain';

type CartLine = OptimisticCartLine<CartApiQueryFragment>;


/**
 * A single line item in the cart. It displays the product image, title, price.
 * It also provides controls to update the quantity or remove the line item.
 */

export function CartLineItem({
  layout,
  line,
}: {
  layout: CartLayout;
  line: CartLine;
}) {
console.log(line, "LINE")
  if (!line?.id) return null;

  const {id, merchandise, isOptimistic} = line;
  const {product, title, image, selectedOptions} = merchandise;

  const {close: closeCartAside} = useAside();
  if(!product) {
    return;
  }
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);


  return (
    <li
      key={id}
      className="flex gap-4"
    >
      <div className="flex-shrink min-w-24">
        {image && (
          <Link 
            to={lineItemUrl}  
            onClick={() => {
              if(layout === 'aside') {
                closeCartAside();
              }
            }}>
            <Image
              width={96}
              height={130}
              data={image}
              className="object-cover object-center w-24 border rounded md:w-28"
              alt={title}
            />
          </Link>
        )}
      </div>

      <div className="flex justify-between flex-grow">
        <div className="grid gap-2">
          <span className='text-lead'>
            {product?.handle ? (
              <Link to={lineItemUrl}  onClick={closeCartAside}>
                {product?.title + ' (' + title + ')' || ''}
              </Link>
            ) : (
              <span>{product?.title + ' (' + title + ')' || ''}</span>
            )}
          </span>

          <div className="flex items-center gap-2">
            <div className="flex justify-start text-fine">
              <CartLineQuantityAdjust line={line} />
            </div>
            <CartLineRemoveButton lineId={id}  disabled={!!isOptimistic} />
          </div>
        </div>
        <span>
          <CartLinePrice line={line} as="span" />
          {(<CartLinePrice contentClass='inline-block line-through opacity-50 py-1 px-2 md:py-1.5 md:px-2.5 !text-base justify-end' priceType='compareAt' line={line} as="span" />)}
        </span>
      </div>
    </li>
  );
}

/**
 * Provides the controls to update the quantity of a line item in the cart.
 * These controls are disabled when the line item is new, and the server
 * hasn't yet responded that it was successfully added to the cart.
 */
function CartLineQuantityAdjust({ line }: {line: CartLine}) {
  if (!line || typeof line?.quantity === 'undefined') return null;
  const {id: lineId, quantity, isOptimistic} = line;
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number((quantity + 1).toFixed(0));

  return (
    <>
      <label htmlFor={`quantity-${lineId}`} className="sr-only">
        Quantity, {quantity}
      </label>
      <div className="flex items-center border rounded">
        <CartLineUpdateButton  lines={[{ id: lineId, quantity: prevQuantity }]}>
          <button
            name="decrease-quantity"
            aria-label="Decrease quantity"
            className="w-10 h-10 transition text-primary/50 hover:text-primary disabled:text-primary/10"
            value={prevQuantity}
            disabled={quantity <= 1 || !!isOptimistic}
          >
            <span>&#8722;</span>
          </button>
        </CartLineUpdateButton >

        <div className="px-2 text-center" data-test="item-quantity">
          {quantity}
        </div>

        <CartLineUpdateButton  lines={[{ id: lineId, quantity: nextQuantity }]}>
          <button
            className="w-10 h-10 transition text-primary/50 hover:text-primary"
            name="increase-quantity"
            value={nextQuantity}
            aria-label="Increase quantity"
            disabled={!!isOptimistic}
          >
            <span>&#43;</span>
          </button>
        </CartLineUpdateButton >
      </div>
    </>
  );
}

/**
 * A button that removes a line item from the cart. It is disabled
 * when the line item is new, and the server hasn't yet responded
 * that it was successfully added to the cart.
 */
export function CartLineRemoveButton({
  lineId,
  disabled,
}: {
  lineId: CartLineUpdateInput['id'];
  disabled: boolean;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove} 
      inputs={{
        lineIds: [lineId],
      }}
    >
      <button
        className="flex items-center justify-center size-8 border rounded"
        type="submit"
        disabled={disabled} 
        title="Remove item from cart"
      >
        <span className="sr-only">Remove</span>
        <IconRemove aria-hidden="true" />
      </button>
    </CartForm>
  );
}
function CartLineUpdateButton({
  children,
  lines,
}: {
  children: React.ReactNode;
  lines: CartLineUpdateInput[];
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{lines}}
    >
      {children}
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
  const compareAtPriceTotal = (parseFloat(line?.cost?.compareAtAmountPerQuantity?.amount || '0') * line.quantity).toFixed(2);
  const totalAmount = parseFloat(line.cost.totalAmount.amount).toFixed(2);
  const moneyV2 =
    priceType === 'regular'
      ? line.cost.totalAmount
      : {
        currencyCode: line?.cost?.compareAtAmountPerQuantity?.currencyCode || 'USD',
        amount: compareAtPriceTotal
      };

  if (moneyV2 == null) {
    return null;
  }

  return (
    !(priceType === 'compareAt' && compareAtPriceTotal == totalAmount) && (
      <Prices
        {...passthroughProps}
        withoutTrailingZeros={withoutTrailingZeros}
        price={moneyV2}
      />
    )
  );

  // return <Money withoutTrailingZeros {...passthroughProps} data={moneyV2} />;
}