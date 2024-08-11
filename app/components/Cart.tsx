import clsx from 'clsx';
import {
  flattenConnection,
  CartForm,
  Image,
  Money,
  useOptimisticCart,
  type OptimisticCart,
  type OptimisticCartLine,
  OptimisticInput,
  type CartReturn
} from '@shopify/hydrogen';
import type {
  CartCost,
  CartLine,
  CartDiscountCode,
  CartLineUpdateInput,
} from '@shopify/hydrogen/storefront-api-types';
import {Link} from '~/components/Link';
import {FeaturedProducts} from '~/components/FeaturedProducts';
import Prices from './Prices';
import ButtonPrimary from './Button/ButtonPrimary';
import ButtonSecondary from './Button/ButtonSecondary';
import {ArrowLeftIcon} from '@heroicons/react/24/solid';
import { CartApiQueryFragment } from 'storefrontapi.generated';
import { c } from 'node_modules/vite/dist/node/types.d-FdqQ54oU';
import { Suspense, useRef, useState } from 'react';
import { FREE_SHIPPING_THRESHOLD } from '~/lib/const';
import { Progress } from '@material-tailwind/react';
import { useScroll } from 'framer-motion';
import { Button } from './Button';
import Heading from './Heading/Heading';
import { IconRemove } from './Icon';
import {useVariantUrl} from '~/lib/variants';
import {useAside} from './Aside';
import { Await } from '@remix-run/react';


export type CartType = OptimisticCart<CartApiQueryFragment | null>;

export function Cart({
  onClose,
  cart: originalCart,
}:  {
  onClose?: () => void;
  cart: CartReturn  | null;
}) {
  // `useOptimisticCart` adds optimistic line items to the cart.
  // These line items are displayed in the cart until the server responds.
  const cart = useOptimisticCart(originalCart);
  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const cartHasItems = cart?.totalQuantity! > 0;

  return (
    <>
      <CartEmpty hidden={linesCount} onClose={onClose} />
      {cartHasItems && <CartDetails onClose={onClose} cart={cart} />}
      
    </>
  );
}
function CartDetails({
  cart,
  onClose,
}: {
  cart: OptimisticCart<CartApiQueryFragment | null>;
  onClose?: () => void;
}) {
  const [disableButton, setDisableButton] = useState(true);
  const toggleDisableButton = () => {
    setDisableButton(!disableButton);
  };
  // @todo: get optimistic cart cost
  const cartHasItems = (cart?.totalQuantity || 0) > 0;
  return (
    <div className='grid grid-cols-1 h-screen-no-nav grid-rows-[auto_1fr_auto]'>
        <FreeShippingProgressBar totalAmount={parseFloat(cart?.cost?.totalAmount?.amount || '0')} />
          <CartLines lines={cart?.lines} />
          {cartHasItems && (
            <CartSummary 
              cart={cart}
              onClose={onClose}
            >
              <CartAgreementCheckbox toggleDisableButton={toggleDisableButton} />
              <CartCheckoutActions checkoutUrl={cart?.checkoutUrl} disableButton={disableButton} />
            </CartSummary>
          )}
    </div>
  );
}

function CartLines({lines: cartLines}: {lines: CartType['lines'] | undefined}) {
  const currentLines = cartLines ? flattenConnection(cartLines) : [];
  return (
    <section
      aria-labelledby="cart-contents"
      className={'border-t px-3 pb-6 sm-max:pt-2 overflow-auto transition mb-[165px]'}
    >
      <ul className="grid gap-6 md:gap-10">
        {currentLines.map((line) => (
          <CartLineItem key={line.id} line={line} />
        ))}
      </ul>
    </section>
  );
}

function CartSummary({
  cart,
  children = null,
  onClose,
}: {
  cart: OptimisticCart<CartApiQueryFragment | null>;
  children?: React.ReactNode;
  onClose?: () => void;
}) {
  const { 
    cost, 
    lines,
    discountCodes,
    checkoutUrl
  } = cart;

   // Calculate the total amount from amountPerQuantity
   const cartTotal = lines ? flattenConnection(lines).reduce((total, {cost: lineCost, quantity}) => {
    return total  + (lineCost?.compareAtAmountPerQuantity ? (parseFloat(lineCost?.compareAtAmountPerQuantity.amount) * quantity) : 0);
}, 0) : 0;

  const saleAmount = parseFloat(cost?.subtotalAmount?.amount || '0') - parseFloat(cost?.totalAmount?.amount || '0');
  const onSale = cartTotal > parseFloat(cost?.subtotalAmount?.amount || '0');
  const comparePriceObj = {
    amount: (Math.round(cartTotal * 100) / 100).toFixed(2),
    currencyCode: cost?.subtotalAmount?.currencyCode,
  };
  return (
    <section aria-labelledby="summary-heading" className='gap-1 my-6 sm:my-8 border-t-2 border-black absolute bottom-0 left-0 mx-5 md:mx-8 bg-white'>
      <h2 id="summary-heading" className="sr-only">
        Order summary
      </h2>
      <dl className="grid gap-1">
        {saleAmount ? (
          <div className="flex items-center justify-between">
            <span >Rewards</span>
            <span  data-test="subtotal">
              {cost?.subtotalAmount?.amount ? (
                <Money data={{ currencyCode: cost?.subtotalAmount?.currencyCode, amount: '-' + saleAmount.toString() }} />
              ) : (
                '-'
              )}
            </span>
          </div>
        ) : null}
        <div className="flex items-center justify-between font-bold">
          <span>Subtotal</span>
          <span data-test="subtotal">
            {cost?.totalAmount?.amount ? (
              <>
                <Money data={cost?.totalAmount} className={`inline-block ${comparePriceObj && onSale && 'text-red-600'}`} />
                {comparePriceObj && onSale && <Money withoutTrailingZeros data={comparePriceObj} className="inline-block line-through opacity-50 ml-1" />}
              </>
            ) : (
              '-'
            )}
          </span>
        </div>
      </dl>
      {children}
    </section>
  );
}

export type OptimisticData = {
  action?: string;
  quantity?: number;
};

function CartLineItem({line}: {line: OptimisticCartLine}) {

  if (!line?.id) return null;

  const {id, quantity, merchandise, isOptimistic} = line;
  const {product, title, image, selectedOptions} = merchandise;

  const {close: closeCartAside} = useAside();
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);


  return (
    <li
      key={id}
      className="flex gap-4"
      style={{
        // Hide the line item if the optimistic data action is remove
        // Do not remove the form from the DOM
        display: isOptimistic ? 'none' : 'flex',
      }}
    >
      <div className="flex-shrink min-w-24">
        {image && (
          <Link to={lineItemUrl}  onClick={closeCartAside}>
            <Image
              width={100}
              height={100}
              data={image}
              className="object-cover object-center w-24 h-24 border rounded md:w-28 md:h-28"
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
            <ItemRemoveButton lineId={id}  disabled={!!isOptimistic} />
          </div>
        </div>
        <span>
          <CartLinePrice line={line} as="span" />
        </span>
      </div>
    </li>
  );
}



function CartLineQuantityAdjust({ line }: {line: OptimisticCartLine}) {
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
      <section className="grid gap-6 text-center mt-28">
        <p>
          Looks like you haven&rsquo;t added anything yet, let&rsquo;s get you
          started!
        </p>
        <div>
          <ButtonPrimary onClick={onClose} className='bg-black'>
            <ArrowLeftIcon className="w-4 h-4 me-2" />
            <span>Continue shopping</span>
          </ButtonPrimary>
        </div>
      </section>
    </div>
  );
}

interface FreeShippingProgressBarProps {
  totalAmount: number;
}
function FreeShippingProgressBar({ totalAmount }: FreeShippingProgressBarProps) {
  return (
    <div>
      <div className="flex justify-center font-bold text-sm my-4">
        <svg className="w-6 mr-2 color-logo-red" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.48 5.28 12 8.813 1.518 5.28M12 21.851V8.814" stroke="currentColor" strokeWidth="1.2" strokeMiterlimit="10"></path>
          <path d="m7.025 3.425 10.48 3.535" stroke="currentColor" strokeWidth="1.079" strokeMiterlimit="10"></path>
          <path d="m12 21.851 10.48-4.413V5.279L12 1.75 1.518 5.279v12.159L12 21.85z" stroke="currentColor" strokeWidth="1.2" strokeMiterlimit="10"></path>
          <path d="m4.322 8.855 4.403 1.524v2.945L4.322 11.67V8.855z" stroke="currentColor" strokeWidth="1.079" strokeMiterlimit="10"></path>
        </svg>
        <h4 className="color-logo-green">{totalAmount < FREE_SHIPPING_THRESHOLD ? `FREE SHIPPING on orders over $${FREE_SHIPPING_THRESHOLD}!` : 'Your cart qualifies for free shipping'}</h4>
      </div>
      <div className="flex justify-center mb-4">
        <Progress size='md' className="border border-gray-900/10 bg-gray-900/5 p-[2px] h-3" color="green" value={totalAmount * 1.66} variant="filled"/>
      </div>
    </div>
  );
}

interface UpdateDiscountFormProps {
  discountCodes?: string[];
  children: React.ReactNode;
}
function UpdateDiscountForm({ discountCodes, children }: UpdateDiscountFormProps) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{
        discountCodes: discountCodes || [],
      }}
    >
      {children}
    </CartForm>
  );
}
interface CartAgreementCheckboxProps {
  toggleDisableButton: () => void;
}

function CartAgreementCheckbox({ toggleDisableButton }: CartAgreementCheckboxProps) {
  return (
    <div className="flex flex-row mt-2">
      <input type="checkbox" className="align-middle mr-2 my-1 size-5" onChange={toggleDisableButton} />
      <label className="text-fine">
        I agree with the <a href="/pages/terms-of-service" className="color-logo-red">Terms of Service</a>, <a href="/policies/refund-policy" className="color-logo-red">Returns-Refund-Exchanges Policy</a>, and <a href="/pages/shipping-handling" className="color-logo-red">Shipping and Handling Policy</a>.
      </label>
    </div>
  );
}

interface CartCheckoutActionsProps {
  checkoutUrl?: string;
  disableButton: boolean;
}

function CartCheckoutActions({ checkoutUrl = '', disableButton }: CartCheckoutActionsProps) {
  if (!checkoutUrl) return null;
  return (
    <div className="flex flex-col mt-2">
      <a href={checkoutUrl} target="_self" className={disableButton ? 'disabled' : ''}>
        <Button as="span" width="full" className="uppercase">
          {disableButton ? 'Agree to Checkout' : 'Checkout'}
        </Button>
      </a>
    </div>
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

/**
 * A button that removes a line item from the cart. It is disabled
 * when the line item is new, and the server hasn't yet responded
 * that it was successfully added to the cart.
 */
export function ItemRemoveButton({
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