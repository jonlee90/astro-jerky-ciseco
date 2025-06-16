import {motion} from 'framer-motion';
import React, {useRef} from 'react';
import {type FetcherWithComponents} from '@remix-run/react';
import {CartForm, type OptimisticCartLineInput} from '@shopify/hydrogen';
import {Link} from '../Link';
import { ButtonPressable, type ButtonPressableProps } from './ButtonPressable';

interface AddToCartPressableProps extends ButtonPressableProps {
  lines: Array<OptimisticCartLineInput>;
  discountCode?: string;
  analytics?: unknown;
}

export const AddToCartPressable = ({ 
  children,
  onClick = () => {},
  bgColor = 'black',
  className = '',
  buttonClass = '',
  disabled = false,
  size = 'size-10', // Default size
  lines,
  discountCode = '',
  analytics,
}: AddToCartPressableProps) => {

  return (
    <CartForm route="/cart" inputs={{lines, discountCode}} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher: FetcherWithComponents<any>) => (
        <>
          <input
            name="analytics"
            type="hidden"
            value={JSON.stringify(analytics)}
          />
          <ButtonPressable
            onClick={onClick}
            className={className + ' rounded-full border-black border '}
            buttonClass = ''
            bgColor={bgColor}
            size={size}
            type="submit"
            disabled={disabled ?? fetcher.state !== 'idle'}
            aria-label={`Add item to cart`}
          >
            {children}
          </ButtonPressable>
        </>
      )}
    </CartForm>
  );
};