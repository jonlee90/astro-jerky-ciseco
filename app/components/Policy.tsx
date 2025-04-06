import {type ShopPolicy} from '@shopify/hydrogen/storefront-api-types';
import React, {type FC} from 'react';
import {Link} from './Link';
import {ArrowUpRightIcon} from '@heroicons/react/24/outline';

export interface Props {
  shippingPolicy: Pick<ShopPolicy, 'handle'> | null | undefined;
  refundPolicy: Pick<ShopPolicy, 'handle'> | null | undefined;
  subscriptionPolicy: Pick<ShopPolicy, 'handle'> | null | undefined;
}

const Policy: FC<Props> = ({
  shippingPolicy,
  refundPolicy,
  subscriptionPolicy,
}) => {
  const A_FEATURES = [
    {
      name: 'Shipping Policy',
      desc: 'Read our shipping policy to learn more about our shipping rates, delivery times, and shipping options. ',
      svg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 14H13C14.1 14 15 13.1 15 12V2H6C4.5 2 3.19001 2.82999 2.51001 4.04999" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M2 17C2 18.66 3.34 20 5 20H6C6 18.9 6.9 18 8 18C9.1 18 10 18.9 10 20H14C14 18.9 14.9 18 16 18C17.1 18 18 18.9 18 20H19C20.66 20 22 18.66 22 17V14H19C18.45 14 18 13.55 18 13V10C18 9.45 18.45 9 19 9H20.29L18.58 6.01001C18.22 5.39001 17.56 5 16.84 5H15V12C15 13.1 14.1 14 13 14H12" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M8 22C9.10457 22 10 21.1046 10 20C10 18.8954 9.10457 18 8 18C6.89543 18 6 18.8954 6 20C6 21.1046 6.89543 22 8 22Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M16 22C17.1046 22 18 21.1046 18 20C18 18.8954 17.1046 18 16 18C14.8954 18 14 18.8954 14 20C14 21.1046 14.8954 22 16 22Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M22 12V14H19C18.45 14 18 13.55 18 13V10C18 9.45 18.45 9 19 9H20.29L22 12Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M2 8H8" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M2 11H6" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M2 14H4" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      `,
      learnMore: `/policies/${shippingPolicy?.handle}`,
    },
    {
      name: 'Return & Refund Policy',
      desc: 'Read our return and refund policy to learn more about our return and refund process, eligibility, and how to request a return.',
      svg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 15C22 18.87 18.87 22 15 22L16.05 20.25" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M2 9C2 5.13 5.13 2 9 2L7.95 3.75" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M13.7 4.44995L17.6799 6.74994L21.6199 4.45996" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M17.6799 10.82V6.73999" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M16.74 2.21L14.34 3.53996C13.8 3.83996 13.35 4.59995 13.35 5.21995V7.75999C13.35 8.37999 13.79 9.13998 14.34 9.43998L16.74 10.77C17.25 11.06 18.09 11.06 18.61 10.77L21.01 9.43998C21.55 9.13998 22 8.37999 22 7.75999V5.21995C22 4.59995 21.56 3.83996 21.01 3.53996L18.61 2.21C18.1 1.93 17.26 1.93 16.74 2.21Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M2.34998 15.45L6.31998 17.7499L10.27 15.46" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M6.31995 21.82V17.74" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M5.39 13.21L2.99001 14.54C2.45001 14.84 2 15.5999 2 16.2199V18.76C2 19.38 2.44001 20.14 2.99001 20.44L5.39 21.77C5.9 22.06 6.73999 22.06 7.25999 21.77L9.66 20.44C10.2 20.14 10.65 19.38 10.65 18.76V16.2199C10.65 15.5999 10.21 14.84 9.66 14.54L7.25999 13.21C6.73999 12.93 5.9 12.93 5.39 13.21Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      `,
      learnMore: `/policies/${refundPolicy?.handle}`,
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-3 relative mt-20">
      {A_FEATURES.map((item, index) => {
        return (
          <Link
            key={`${index + 1}`}
            to={item.learnMore}
            className={`relative flex flex-col p-5 rounded-2xl bg-slate-100 dark:bg-opacity-90 group`}
          >
            <span className="absolute top-5 end-5 group-hover:scale-110 group-hover:opacity-100 opacity-60 transition-all">
              <ArrowUpRightIcon className="w-5 h-5" />
            </span>

            <div dangerouslySetInnerHTML={{__html: item.svg}}></div>
            <div className="mt-4">
              <span className="block font-semibold text-slate-900">
                {item.name}
              </span>
              <div className="text-slate-500 mt-1 text-base line-clamp-1">
                {item.desc}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default Policy;
