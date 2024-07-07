import {Await} from '@remix-run/react';
import invariant from 'tiny-invariant';
import {
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
  json,
} from '@shopify/remix-oxygen';
import {
  CartForm,
  Image,
  Money,
  OptimisticInput,
  useOptimisticData,
  type CartQueryDataReturn,
  type CartReturn,
  flattenConnection,
  UNSTABLE_Analytics as Analytics,
} from '@shopify/hydrogen';
import {isLocalPath} from '~/lib/utils';
import {Link} from '~/components/Link';
import {FeaturedProducts} from '~/components/FeaturedProducts';
import {useRootLoaderData} from '~/lib/root-data';
import {
  ArrowLeftIcon,
  CheckIcon,
  NoSymbolIcon,
} from '@heroicons/react/24/outline';
import type {
  CartCost,
  CartDiscountCode,
  CartLine,
  CartLineUpdateInput,
} from '@shopify/hydrogen/storefront-api-types';
import {
  CartLinePrice,
  ItemRemoveButton,
  type OptimisticData,
} from '~/components/Cart';
import ButtonPrimary from '~/components/Button/ButtonPrimary';
import clsx from 'clsx';
import PageHeader from '~/components/PageHeader';

export async function action({request, context}: ActionFunctionArgs) {
  const {cart} = context;

  const [formData, customerAccessToken] = await Promise.all([
    request.formData(),
    context.customerAccount.getAccessToken(),
  ]);

  const {action, inputs} = CartForm.getFormInput(formData);
  invariant(action, 'No cartAction defined');

  let status = 200;
  let result: CartQueryDataReturn;

  switch (action) {
    case CartForm.ACTIONS.LinesAdd:
      result = await cart.addLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesUpdate:
      result = await cart.updateLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesRemove:
      result = await cart.removeLines(inputs.lineIds);
      break;
    case CartForm.ACTIONS.DiscountCodesUpdate:
      const formDiscountCode = inputs.discountCode;

      // User inputted discount code
      const discountCodes = (
        formDiscountCode ? [formDiscountCode] : []
      ) as string[];

      // Combine discount codes already applied on cart
      discountCodes.push(...inputs.discountCodes);

      result = await cart.updateDiscountCodes(discountCodes);
      break;
    case CartForm.ACTIONS.BuyerIdentityUpdate:
      result = await cart.updateBuyerIdentity({
        ...inputs.buyerIdentity,
        customerAccessToken,
      });
      break;
    default:
      invariant(false, `${action} cart action is not defined`);
  }

  /**
   * The Cart ID may change after each mutation. We need to update it each time in the session.
   */
  const cartId = result.cart.id;
  const headers = cart.setCartId(result.cart.id);

  const redirectTo = formData.get('redirectTo') ?? null;
  if (typeof redirectTo === 'string' && isLocalPath(redirectTo)) {
    status = 303;
    headers.set('Location', redirectTo);
  }

  const {cart: cartResult, errors, userErrors} = result;

  headers.append('Set-Cookie', await context.session.commit());

  return json(
    {
      cart: cartResult,
      userErrors,
      errors,
    },
    {status, headers},
  );
}

export async function loader({context}: LoaderFunctionArgs) {
  const {cart} = context;
  return json(await cart.get());
}

export default function CartRoute() {
  const rootData = useRootLoaderData();

  // @todo: finish on a separate PR
  return (
    <>
      <div className="nc-CartPage">
        <main className="container py-10 lg:pb-28 lg:pt-20 ">
          <div className="mb-12 sm:mb-16">
            <PageHeader
              title={'Shopping Cart'}
              hasBreadcrumb={true}
              breadcrumbText={'Shopping Cart'}
            />
          </div>

          <hr className="border-slate-200 dark:border-slate-700 my-10 xl:my-12" />

          <Await resolve={rootData?.cart}>
            {(cart) => <Content cart={cart} />}
          </Await>
        </main>
      </div>

      <Analytics.CartView />
    </>
  );
}

function Content({cart}: {cart: CartReturn | null}) {
  const linesCount = Boolean(cart?.lines?.edges?.length || 0);
  const cartHasItems = !!cart && cart.totalQuantity > 0;
  const currentLines = cart?.lines ? flattenConnection(cart?.lines) : [];

  return (
    <>
      {!!cartHasItems && (
        <div className="flex flex-col lg:flex-row">
          <div className="w-full lg:w-[60%] xl:w-[55%] divide-y divide-slate-200 dark:divide-slate-700 grid">
            {currentLines.map((line) => (
              <CartLineItem key={line.id} line={line as CartLine} />
            ))}
          </div>
          <div className="border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-700 my-10 lg:my-0 lg:mx-10 xl:mx-16 2xl:mx-20 flex-shrink-0"></div>
          <div className="flex-1">
            <div className="sticky top-28">
              {cartHasItems && (
                <CartSummary
                  cost={cart.cost}
                  discountCodes={cart.discountCodes}
                  checkoutUrl={cart.checkoutUrl}
                />
              )}
            </div>
          </div>
        </div>
      )}
      <CartEmpty hidden={linesCount} />
    </>
  );
}

function CartLineItem({line}: {line: CartLine}) {
  const optimisticData = useOptimisticData<OptimisticData>(line?.id);

  if (!line?.id) return null;

  const {id, quantity, merchandise} = line;

  if (typeof quantity === 'undefined' || !merchandise?.product) return null;

  const renderStatusSoldout = () => {
    return (
      <div className="rounded-full flex items-center justify-center px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
        <NoSymbolIcon className="w-3.5 h-3.5" />
        <span className="ml-1 leading-none">Sold Out</span>
      </div>
    );
  };

  const renderStatusInstock = () => {
    return (
      <div className="rounded-full flex items-center justify-center px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
        <CheckIcon className="w-3.5 h-3.5 text-secondary-500" />
        <span className="ml-1 leading-none">In Stock</span>
      </div>
    );
  };

  return (
    <div
      key={id}
      style={{
        // Hide the line item if the optimistic data action is remove
        // Do not remove the form from the DOM
        display: optimisticData?.action === 'remove' ? 'none' : 'flex',
      }}
      className="relative flex py-8 sm:py-10 xl:py-12 first:pt-0 last:pb-0"
    >
      {/*  */}
      <div className="relative h-36 w-24 sm:w-32 flex-shrink-0 overflow-hidden rounded-xl bg-neutral-100">
        {merchandise.image && (
          <Link to={`/products/${merchandise.product.handle}`}>
            <Image
              width={200}
              height={200}
              data={merchandise.image}
              className="absolute inset-0 w-full h-full object-cover object-center rounded-xl"
              alt={merchandise.title}
              sizes="(min-width: 1024px) 200px, 200px"
            />
          </Link>
        )}
      </div>

      <div className="ml-3 sm:ml-6 flex flex-1 flex-col">
        <div>
          <div className="flex justify-between gap-5">
            <div className="flex-[1.5] ">
              <h3 className="text-base font-semibold">
                {merchandise?.product?.handle ? (
                  <Link to={`/products/${merchandise.product.handle}`}>
                    {merchandise?.product?.title || ''}
                  </Link>
                ) : (
                  <span>{merchandise?.product?.title || ''}</span>
                )}
              </h3>
              <div className="mt-2 sm:mt-2.5 text-sm text-slate-500 dark:text-slate-400 flex pe-3 gap-x-4 capitalize">
                {merchandise?.selectedOptions.some(
                  (option) =>
                    option.name === 'Title' && option.value === 'Default Title',
                )
                  ? null
                  : merchandise.title}
              </div>

              <div className="mt-3 flex justify-between w-full sm:hidden relative">
                <CartLineQuantityAdjust line={line} />

                <CartLinePrice
                  withoutTrailingZeros={false}
                  line={line}
                  className="mt-0.5"
                />
              </div>
            </div>

            <div className="hidden sm:block text-center relative">
              <CartLineQuantityAdjust line={line} />
            </div>

            <div className="hidden flex-1 sm:flex justify-end">
              <CartLinePrice
                withoutTrailingZeros={false}
                line={line}
                className="mt-0.5"
              />
            </div>
          </div>
        </div>

        <div className="flex mt-auto pt-4 items-end justify-between text-sm">
          {renderStatusInstock()}

          <ItemRemoveButton lineId={id} />
        </div>
      </div>
    </div>
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
    <>
      <div className="flex justify-between">
        <h3 className="text-lg font-semibold ">Subtotal</h3>

        <span className="text-lg font-semibold">
          {cost?.subtotalAmount?.amount ? (
            <Money data={cost?.subtotalAmount} />
          ) : (
            '-'
          )}
        </span>
      </div>
      <p className="mt-2 text-sm text-slate-500">
        Shipping, discounts, will be calculated at checkout.
      </p>
      <a className="flex mt-8 w-full" href={checkoutUrl} target="_self">
        <ButtonPrimary as={'span'} className="w-full">
          Checkout
        </ButtonPrimary>
      </a>
      <div className="mt-5 text-sm text-slate-500 flex items-center justify-center">
        <p className="block relative pl-5">
          <svg
            className="w-4 h-4 absolute -left-1 top-0.5"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 8V13"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M11.9945 16H12.0035"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Learn more{` `}
          <Link
            to={'/policies/shipping-policy'}
            className="text-slate-900 dark:text-slate-200 underline font-medium"
          >
            shipping
          </Link>
          <span>
            {` `}and{` `}
          </span>
          <Link
            to="/policies/refund-policy"
            target="_blank"
            rel="noopener noreferrer"
            href="##"
            className="text-slate-900 dark:text-slate-200 underline font-medium"
          >
            refund
          </Link>
          {` `} infomation
        </p>
      </div>
    </>
  );
}

function UpdateCartButton({
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
      inputs={{
        lines,
      }}
    >
      {children}
    </CartForm>
  );
}

function CartLineQuantityAdjust({line}: {line: CartLine}) {
  const optimisticId = line?.id;
  const optimisticData = useOptimisticData<OptimisticData>(optimisticId);

  if (!line || typeof line?.quantity === 'undefined') return null;

  const optimisticQuantity = optimisticData?.quantity || line.quantity;

  const {id: lineId} = line;
  const prevQuantity = Number(Math.max(0, optimisticQuantity - 1).toFixed(0));
  const nextQuantity = Number((optimisticQuantity + 1).toFixed(0));

  return (
    <>
      <label htmlFor={`quantity-${lineId}`} className="sr-only">
        Quantity, {optimisticQuantity}
      </label>
      <div className="flex items-center border rounded-lg">
        <UpdateCartButton lines={[{id: lineId, quantity: prevQuantity}]}>
          <button
            name="decrease-quantity"
            aria-label="Decrease quantity"
            className="w-8 h-8 sm:w-10 sm:h-10 transition text-primary/50 hover:text-primary disabled:text-primary/10"
            value={prevQuantity}
            disabled={optimisticQuantity <= 1}
          >
            <span>&#8722;</span>
            <OptimisticInput
              id={optimisticId}
              data={{quantity: prevQuantity}}
            />
          </button>
        </UpdateCartButton>

        <div className="px-2 text-center" data-test="item-quantity">
          {optimisticQuantity}
        </div>

        <UpdateCartButton lines={[{id: lineId, quantity: nextQuantity}]}>
          <button
            className="w-8 h-8 sm:w-10 sm:h-10 transition text-primary/50 hover:text-primary"
            name="increase-quantity"
            value={nextQuantity}
            aria-label="Increase quantity"
          >
            <span>&#43;</span>
            <OptimisticInput
              id={optimisticId}
              data={{quantity: nextQuantity}}
            />
          </button>
        </UpdateCartButton>
      </div>
    </>
  );
}

export function CartEmpty({hidden = false}: {hidden: boolean}) {
  return (
    <div className={clsx('h-full overflow-auto py-6')} hidden={hidden}>
      <section className="grid gap-6">
        <p>
          Looks like you haven&rsquo;t added anything yet, let&rsquo;s get you
          started!
        </p>
        <div>
          <ButtonPrimary href="/">
            <ArrowLeftIcon className="w-4 h-4 me-2" />
            <span>Continue shopping</span>
          </ButtonPrimary>
        </div>
      </section>
      <section className="grid gap-8 pt-16 sm:pt-24">
        <FeaturedProducts
          className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 lg:gap-x-6 gap-y-8"
          count={4}
          heading="Shop Best Sellers"
          sortKey="BEST_SELLING"
          headingClassName="text-2xl sm:text-3xl font-semibold"
        />
      </section>
    </div>
  );
}
