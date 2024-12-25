import Heading from '~/components/Heading/Heading';
import { Link } from '~/components/Link';
import PageHeader from '~/components/PageHeader';
import React from 'react';
import { IconDollar, IconDollarSign, IconEqual, IconStar } from '~/components/Icon';

const Rewards: React.FC = () => {
  return (
    <div className="max-w-xl mx-auto mb-24" role="main">
      <PageHeader
        title="Astro's Rewards"
        description="Get Jerky, Get Rewards."
        hasBreadcrumb={false}
        className="text-center mt-8"
      />

      <hr className="mx-3 md:mx-4 lg:mx-6 my-6" />

      <section
        aria-labelledby="earn-points-heading"
        className="text-center grid gap-6 px-6"
      >
        <Heading
          id="earn-points-heading"
          className="text-lead color-logo-green"
        >
          Earn Points & Collect Rewards
        </Heading>

        <div className="">
          <p 
            aria-label="Free 100 points"
            className='font-bold'>
              SIGN UP TODAY TO EARN <span className="bg-logo-red text-white pointer-bg">FREE</span> 100 POINTS!
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 items-center justify-items-center">
          <Link
            to="/account"
            className="px-6 py-2 rounded-full w-full relative color-logo-green border-gray-400 border bg-white"
            aria-label="Log in to your account"
          >
            Log In
          </Link>

          <Link
            to="/account"
            className="px-6 py-2 rounded-full w-full relative bg-black text-white border border-black"
            aria-label="Join now to start earning rewards"
          >
            Join Now
          </Link>
        </div>
      </section>

      <hr className="mx-3 md:mx-4 lg:mx-6 my-8" />

      <section aria-labelledby="how-it-works-heading" className="text-center">
        <Heading
          id="how-it-works-heading"
          className="text-lead mb-6 md:mb-8 lg:mb-12 !justify-center"
        >
          How It Works
        </Heading>

        <div>
          <div className="grid grid-cols-7 items-center justify-items-center">
            <div
              className="col-span-2 col-start-2 gap-3 grid"
              aria-label="Spend 1 dollar"
            >
              <IconDollar role="img" aria-label="Dollar Icon" />
              <span className="text-copy">Spend 1 dollar</span>
            </div>
            <div className="col-span-1">
              <IconEqual role="img" aria-label="Equal Sign Icon" />
            </div>
            <div
              className="col-span-2 col-start-5 gap-3 grid"
              aria-label="Earn 1 point"
            >
              <IconStar
                role="img"
                aria-label="Star Icon with 1 point"
                content="1"
                label="pt"
                contentX="6.5"
                contentY="9"
                contentSize="5"
              />
              <span className="text-copy">Earn 1 point</span>
            </div>
          </div>

          <hr className="w-11/12 xs:w-96 h-1 mx-auto bg-black my-6" />

          <div className="grid grid-cols-7 items-center justify-items-center">
            <div
              className="col-span-2 col-start-2 gap-3 grid"
              aria-label="100 points"
            >
              <IconStar
                role="img"
                aria-label="Star Icon with 100 points"
                content="100"
                label="pts"
                contentX="5"
                contentY="9"
                contentSize="3.5"
              />
              <span className="text-copy">100 points</span>
            </div>
            <div className="col-span-1">
              <IconEqual role="img" aria-label="Equal Sign Icon" />
            </div>
            <div
              className="col-span-2 col-start-5 gap-3 grid"
              aria-label="$5 Rewards"
            >
              <IconDollarSign
                role="img"
                aria-label="Dollar Sign Icon for $5 Rewards"
              />
              <span className="text-copy">$5 Rewards</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Rewards;
