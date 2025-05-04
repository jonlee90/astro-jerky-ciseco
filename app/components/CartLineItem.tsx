import type {CartLineUpdateInput} from '@shopify/hydrogen/storefront-api-types';
import {CartForm, Image, type OptimisticCartLine} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import {Link} from '@remix-run/react';
import {useAside} from './Aside';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import { IconRemove } from './Icon';
import Prices from './Prices';
import type {CartLayout} from '~/components/CartMain';
import clsx from 'clsx';

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
  if (!line?.id) return null;
  const {id, merchandise, isOptimistic, attributes, cost, quantity} = line;
  const {product, title, image, selectedOptions} = merchandise;

  const {close: closeCartAside} = useAside();
  if(!product) {
    return;
  }
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);
  const isBundle = product.tags && product.tags.includes('bundle');
  const isProductDisplay = product.tags && product.tags.includes('product-display');

  
  const originalAmount = parseFloat(cost?.amountPerQuantity?.amount || '0') * quantity;
  const compareAtAmount = parseFloat(cost?.compareAtAmountPerQuantity?.amount || '0');
  const totalAmount = parseFloat(cost?.totalAmount?.amount || '0');
  const onSale = originalAmount < compareAtAmount || totalAmount < originalAmount;

  return (
    <li
      key={id}
      className="flex gap-4"
      aria-labelledby={`cart-item-${id}`}
      aria-describedby={`cart-item-details-${id}`}
    >
      <div className="flex-shrink min-w-24 max-w-28 flex items-center">
        {image && (
          <Link 
            to={isBundle ? '/bundle/' + product.handle :lineItemUrl}  
            onClick={() => {
              if(layout === 'aside') {
                closeCartAside();
              }
            }}>
            <Image
              sizes='100vh'
              data={image}
              className="object-cover object-center w-24 md:w-28 rounded-lg"
              alt={title}
            />
          </Link>
        )}
      </div>

      <div className="flex justify-between flex-grow">
        <div className="grid gap-2">
          <h2 id={`cart-item-${id}`} className='text-lg font-semibold'>
            {product?.handle ? (
              isProductDisplay ?
              <>{product?.title}</>
              :
              <Link to={isBundle ? '/bundle/' + product.handle :lineItemUrl}  onClick={closeCartAside}>
                {product?.title + (isBundle || title === 'Default Title' ? '' : ' (' + title + ')')}
              </Link>
            ) : (
              <span>{product?.title + (title === 'Default Title' ? '' : ' (' + title + ')')}</span>
            )}
          </h2>
          {attributes && <CartLineAttributes attributes={attributes} />}
          <div 
            id={`cart-item-details-${id}`}
            className="flex items-center gap-2 text-r">
            <div className="flex justify-start text-fine">
              <CartLineQuantityAdjust line={line} />
            </div>
            <CartLineRemoveButton lineId={id}  disabled={!!isOptimistic} />
          </div>
        </div>
        <span>
          <CartLinePrice line={line} as="span" priceClass='text-lg font-semibold' contentClass={clsx(onSale && '!text-red-600', 'py-1 px-2 md:py-1.5 md:px-2.5')} />
          {(<CartLinePrice priceClass='text-base' contentClass='inline-block line-through opacity-50 py-1 px-2 md:py-1.5 md:px-2.5 justify-end' priceType='compareAt' line={line} as="span" />)}
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
      <div 
        className="flex items-center border rounded"
        role="group"
        aria-labelledby={`quantity-${lineId}`}
        aria-live="polite"
      >
        <CartLineUpdateButton  lines={[{ id: lineId, quantity: prevQuantity }]}>
          <button
            name="decrease-quantity"
            aria-label="Decrease quantity"
            className="w-10 h-10 transition text-primary/50 hover:text-primary disabled:text-primary/10"
            value={prevQuantity}
            disabled={quantity <= 1 || !!isOptimistic}
          >
            <span aria-hidden="true">&#8722;</span>
          </button>
        </CartLineUpdateButton >

        <div 
          id={`quantity-${lineId}`}
          className="px-2 text-center" 
          data-test="item-quantity">
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
            <span aria-hidden="true">&#43;</span>
          </button>
        </CartLineUpdateButton >
      </div>
    </>
  );
}

function CartLineAttributes({ attributes }: {attributes: CartLine['attributes']}) {
  return (
    <div className='text-sm'>
      {attributes.map((attribute, index) => (
        <div key={index}>
          {attribute.key}: {attribute.value}
        </div>
      ))}
    </div>
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
        aria-label="Remove item from cart"
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