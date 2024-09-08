import clsx from 'clsx';
import {
  useOptimisticCart,
} from '@shopify/hydrogen';
import ButtonPrimary from './Button/ButtonPrimary';
import {ArrowLeftIcon} from '@heroicons/react/24/solid';
import { CartApiQueryFragment } from 'storefrontapi.generated';
import { FREE_SHIPPING_THRESHOLD } from '~/lib/const';
import { Progress } from '@material-tailwind/react';
import {useAside} from './Aside';
import { CartLineItem } from './CartLineItem';
import { CartSummary } from './CartSummary';

export type CartLayout = 'page' | 'aside';

export type CartMainProps = {
  cart: CartApiQueryFragment | null;
  layout: CartLayout;
};

export function CartMain({
  layout,
  cart: originalCart,
}:  CartMainProps) {
  // `useOptimisticCart` adds optimistic line items to the cart.
  // These line items are displayed in the cart until the server responds.
  const cart = useOptimisticCart(originalCart);
  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const cartHasItems = cart?.totalQuantity! > 0;
  return (
    <>
      <CartEmpty hidden={linesCount}/>


      <div className='grid grid-cols-1 h-screen-no-nav grid-rows-[auto_1fr_auto]'>
        <FreeShippingProgressBar totalAmount={parseFloat(cart?.cost?.totalAmount?.amount || '0')} />
          <section
            aria-labelledby="cart-contents"
            className={'border-t px-3 pb-6 sm-max:pt-2 overflow-auto transition mb-[165px]'}
          >
            <ul className="grid gap-6 md:gap-10">
              {(cart?.lines?.nodes ?? []).map((line) => (
                <CartLineItem key={line.id} line={line} layout={layout}/>
              ))}
            </ul>
          </section>
          {cartHasItems && (
            <CartSummary 
              cart={cart}
            />
          )}
      </div>
    </>
  );
}

export function CartEmpty({
  hidden = false,
}: {
  hidden: boolean;
}) {
  const {close} = useAside();
  return (
    <div className={clsx('h-full overflow-auto py-6')} hidden={hidden}>
      <section className="grid gap-6 text-center mt-28">
        <p>
          Looks like you haven&rsquo;t added anything yet, let&rsquo;s get you
          started!
        </p>
        <div>
          <ButtonPrimary onClick={close} className='bg-black'>
            <ArrowLeftIcon className="w-4 h-4 me-2" />
            <span>Continue shopping</span>
          </ButtonPrimary>
        </div>
      </section>
    </div>
  );
}

function FreeShippingProgressBar({ totalAmount }:{totalAmount: number}) {
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