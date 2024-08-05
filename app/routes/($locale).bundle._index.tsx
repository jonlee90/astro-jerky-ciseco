import React from 'react';
import { Link } from '@remix-run/react';
import { Money, useMoney } from '@shopify/hydrogen';
import clsx from 'clsx';
import { Card, CardHeader, CardBody } from "@material-tailwind/react";
import { BundlePacks } from '~/data/bundleData';
import { motion } from 'framer-motion';
import PageHeader from '~/components/PageHeader';

interface BundlePack {
  id: string;
  title: string;
  description: string;
  price: string;
  msrp: string;
}

export default function AllBundle() {
  return (
    <div
      className={clsx(
        `nc-PageCollection pt-10 lg:pt-20 pb-20 lg:pb-28 xl:pb-32`,
        'space-y-20 sm:space-y-24 lg:space-y-28',
      )}
    >
      <div className="container">
       <div className="space-y-14 lg:space-y-24">
        <PageHeader
          // remove the html tags on title
          title={'BUNDLE PACK'}
          description={'MIX & MATCH BETWEEN 12 DIFFERENT FLAVORS TO CREATE A CUSTOM ORDER.'}
          hasBreadcrumb={false}
        />
        <div  data-test="product-grid" className="sm-only:p-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid gap-6 border-black">
          {BundlePacks.map((pack) => (
            <Link 
              key={pack.id} 
              to={`/bundle/${pack.id}`} 
              prefetch="intent" 
              state={{ pack: pack.id }}
            >
              <motion.div 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                className='border-2 rounded-full'
              >
                <Card className="grid grid-cols-1 text-black">
                  <CardHeader floated={false} 
                    shadow={false}
                    color="transparent"
                    className="m-0">
                    <div className="cow-card h-36"></div>
                  </CardHeader>
                  <CardBody className="grid grid-cols-1 gap-2 p-4">
                    <span className="">
                      {pack.title}
                    </span>
                    <span className="opacity-70">
                      {pack.description} of Premium Jerky
                    </span>
                    <span className="flex gap-4 text-lead">
                      <Money withoutTrailingZeros data={{ amount: pack.price, currencyCode: 'USD' }} className="text-red-600" />
                      <CompareAtPrice
                        className="opacity-50"
                        data={{ amount: pack.msrp, currencyCode: 'USD' }}
                      />
                    </span>
                  </CardBody>
                </Card>
              </motion.div>
            </Link>
          ))}
        </div>
        </div>
      </div>
    </div>
  );
}

interface CompareAtPriceProps {
  data: Money;
  className?: string;
}

function CompareAtPrice({ data, className }: CompareAtPriceProps) {
  const { currencyNarrowSymbol, withoutTrailingZerosAndCurrency } = useMoney(data);

  const styles = clsx('strike', className);

  return (
    <span className={styles}>
      {currencyNarrowSymbol}
      {withoutTrailingZerosAndCurrency}
    </span>
  );
}
