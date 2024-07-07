import type {CartLineInput} from '@shopify/hydrogen/storefront-api-types';
import {CartForm} from '@shopify/hydrogen';
import type {FetcherWithComponents} from '@remix-run/react';

export function AddToCartButton({
  children,
  lines,
  className = '',
  disabled,
  ...props
}: {
  children: React.ReactNode;
  lines: CartLineInput[];
  className?: string;
  disabled?: boolean;
  [key: string]: any;
}) {
  return (
    <CartForm
      route="/cart"
      inputs={{
        lines,
      }}
      action={CartForm.ACTIONS.LinesAdd}
    >
      {(fetcher: FetcherWithComponents<any>) => {
        return (
          <>
            <button
              type="submit"
              className={className}
              disabled={disabled ?? fetcher.state !== 'idle'}
              {...props}
            >
              {children}
            </button>
          </>
        );
      }}
    </CartForm>
  );
}
