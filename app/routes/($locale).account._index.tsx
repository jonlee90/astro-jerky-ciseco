import {Await, Link, useRouteLoaderData} from '@remix-run/react';
import {
  ClipboardDocumentCheckIcon,
  IdentificationIcon,
  MapIcon,
} from '@heroicons/react/24/outline';
import type {CustomerDetailsFragment} from 'customer-accountapi.generated';
import clsx from 'clsx';
import {type LoaderFunctionArgs} from '@remix-run/server-runtime';
import {useAccoutRootLoaderData} from '~/lib/account-data';
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { motion } from 'framer-motion';
import { CartForm } from '@shopify/hydrogen';
import type { RootLoader } from '~/root';
import { Suspense } from 'react';

const actions = [
  {
    title: 'Personal info',
    description: 'Provide and update your personal information ',
    href: '/account/personal-info',
    icon: IdentificationIcon,
  },
  {
    title: 'Order History',
    description: 'View your order history and track your orders ',
    href: '/account/order-history',
    icon: ClipboardDocumentCheckIcon,
  },
  {
    title: 'Address Book',
    description: 'Manage your addresses and default shipping address',
    href: '/account/address',
    icon: MapIcon,
  },
];

export async function loader({context: {storefront}}: LoaderFunctionArgs) {
  return {};
}

export default function Index() {
  const data = useAccoutRootLoaderData();

  return <Account {...data} />;
}

interface AccountType {
  customer: CustomerDetailsFragment;
  // featuredDataPromise: Promise<FeaturedData>;
  heading: string;
}

function Account({customer}: AccountType) {
  const rootData = useRouteLoaderData<RootLoader>('root');
  const defaultAddress = customer.defaultAddress;
  const {emailAddress, firstName, lastName} = customer;
  const [loyalty_points_current, loyalty_points_lifetime] = customer.metafields;
  const loyalty_points_current_value = Number(loyalty_points_current ? loyalty_points_current.value : 0);
  const loyalty_points_points_until = loyalty_points_current_value % 100;
  const loyalty_points_lifetime_value = Number(loyalty_points_lifetime ? loyalty_points_lifetime.value : 0);
  const rewardsButtonStyle = 'bg-logo-red text-white border border-color-red py-2 rounded-full w-full disabled:opacity-50 disabled:pointer-events-none';
  const invertedRewardsButtonStyle = 'bg-default-gray color-logo-red';
  

  return (
    <div className="container py-10 sm:py-20">
      <div className="max-w-5xl mx-auto">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl xl:text-4xl font-semibold">{'My Rewards'}</h1>
          <div className='bg-light-gray rounded-lg max-w-xl mx-auto'>
            <div className='grid grid-cols-2 gap-5 items-center p-5'>
              <div className='mr-5'>
                <CircularProgressbarWithChildren className="color-logo-green" value={loyalty_points_points_until} maxValue={100}
                strokeWidth={8}
                  styles={buildStyles({
                    pathColor: 'rgb(237, 28, 36)',
                    textColor: 'rgb(0, 0, 0)',
                    pathTransitionDuration: 0.5,
                  })} text={`${loyalty_points_points_until}/100`}  />
              </div>
              <div className='font-bold grid grid-rows-2 gap-2 items-center'>
                <span className="text-lg">{100 - loyalty_points_points_until} points until your next $5 rewards!</span>
                <Link to={'/collections/classic-flavors'}>
                  <motion.button className="bg-black text-white py-3 rounded-full font-normal w-40">SHOP NOW</motion.button>
                </Link>
              </div>

              <div className='col-span-2 grid gap-3 bg-default-gray p-3 rounded-lg mx-auto w-full'>
                <div className='grid grid-cols-2 items-center'>
                  <span className="">Available Rewards</span>
                  <span className="text-right">${Math.floor(loyalty_points_current_value / 100) * 5}</span>
                </div>
                <div className='grid grid-cols-2 items-center'>
                  <span className="">Available Points</span>
                  <span className="text-right">{loyalty_points_current_value}</span>
                </div>
                <div className='grid grid-cols-2 items-center'>
                  <span className="font-normal">Lifetime Points</span>
                  <span className="text-right">{loyalty_points_lifetime_value}</span>
                </div>
              </div>
              <Suspense fallback={<></>}>
                <Await resolve={rootData?.cart}>
                  {(cart: any) => {
                    const loyalty5 = cart ? cart.discountCodes.find(({ code, applicable }: any) => applicable && code === 'LOYALTY5OFF') : '';
                    const loyalty10 = cart ? cart.discountCodes.find(({ code, applicable }: any) => applicable && code === 'LOYALTY10OFF') : '';
                    return (
                    <>
                      <UpdateDiscountForm discountCodes={['LOYALTY5OFF']} loyalty={loyalty5}>
                        <motion.button className={clsx(rewardsButtonStyle, loyalty5 && invertedRewardsButtonStyle)} disabled={loyalty_points_current_value < 100}>{loyalty5 ? 'Remove $5 Reward' : 'Apply $5 Reward'}</motion.button>
                      </UpdateDiscountForm>
                      <UpdateDiscountForm discountCodes={['LOYALTY10OFF']} loyalty={loyalty10}>
                        <motion.button className={clsx(rewardsButtonStyle, loyalty10 && invertedRewardsButtonStyle)} disabled={loyalty_points_current_value < 200}>{loyalty10 ? 'Remove $10 Reward' : 'Apply $10 Reward'}</motion.button>
                      </UpdateDiscountForm>
                    </>
                  )}}
                </Await>
              </Suspense>
            </div>
          </div>
        </div>

        {/*  */}
        <div className="my-10 sm:my-16 grid sm:grid-cols-3 gap-4">
          {actions.map((action, actionIdx) => (
            <div
              key={action.title}
              className={clsx(
                'group rounded-xl relative bg-white p-6 airShadown',
              )}
            >
              <div>
                <action.icon className="h-8 w-8" aria-hidden="true" />
              </div>
              <div className="mt-8">
                <h3 className="text-base font-semibold leading-6 text-gray-900">
                  <Link to={action.href} className="focus:outline-none">
                    <span className="absolute inset-0" aria-hidden="true" />
                    {action.title}
                  </Link>
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  {action.description}
                </p>
              </div>
              <span
                className="pointer-events-none absolute right-6 top-6 text-gray-300 group-hover:text-gray-400"
                aria-hidden="true"
              >
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
                </svg>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
interface UpdateDiscountFormProps {
  discountCodes: string[];
  children: React.ReactNode;
  loyalty: any;
}

function UpdateDiscountForm({ discountCodes, children, loyalty }: UpdateDiscountFormProps) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{
        discountCodes: (loyalty ? [] : discountCodes) || [],
      }}
    >
      {children}
    </CartForm>
  );
}