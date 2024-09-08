import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {CartForm, Money, type OptimisticCart} from '@shopify/hydrogen';
import { Button } from './Button';
import { useState } from 'react';

type CartSummaryProps = {
  cart: OptimisticCart<CartApiQueryFragment | null>;
};

export function CartSummary({cart}: CartSummaryProps) {
  const [disableButton, setDisableButton] = useState(true);
  const toggleDisableButton = () => {
    setDisableButton(!disableButton);
  };
  const { 
    cost, 
    lines,
    discountCodes,
    checkoutUrl
  } = cart;

   // Calculate the total amount from amountPerQuantity
   const cartTotal = lines?.nodes ? lines.nodes.reduce((total, {cost: lineCost, quantity}) => {
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
      <CartAgreementCheckbox toggleDisableButton={toggleDisableButton} />
      <CartCheckoutActions checkoutUrl={checkoutUrl} disableButton={disableButton} />
    </section>
  );
}
function CartAgreementCheckbox({ toggleDisableButton }: {toggleDisableButton: () => void}) {
  return (
    <div className="flex flex-row mt-2">
      <input type="checkbox" className="align-middle mr-2 my-1 size-5" onChange={toggleDisableButton} />
      <label className="text-fine">
        I agree with the <a href="/policies/terms-of-service" className="color-logo-red">Terms of Service</a>, <a href="/policies/refund-policy" className="color-logo-red">Returns/Refund/Exchanges Policy</a>, and <a href="/policies/shipping-policy" className="color-logo-red">Shipping and Handling Policy</a>.
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
function CartDiscounts({
  discountCodes,
}: {
  discountCodes?: CartApiQueryFragment['discountCodes'];
}) {
  const codes: string[] =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({code}) => code) || [];

  return (
    <div>
      {/* Have existing discount, display it with a remove option */}
      <dl hidden={!codes.length}>
        <div>
          <dt>Discount(s)</dt>
          <UpdateDiscountForm>
            <div className="cart-discount">
              <code>{codes?.join(', ')}</code>
              &nbsp;
              <button>Remove</button>
            </div>
          </UpdateDiscountForm>
        </div>
      </dl>

      {/* Show an input to apply a discount */}
      <UpdateDiscountForm discountCodes={codes}>
        <div>
          <input type="text" name="discountCode" placeholder="Discount code" />
          &nbsp;
          <button type="submit">Apply</button>
        </div>
      </UpdateDiscountForm>
    </div>
  );
}

function UpdateDiscountForm({
  discountCodes,
  children,
}: {
  discountCodes?: string[];
  children: React.ReactNode;
}) {
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