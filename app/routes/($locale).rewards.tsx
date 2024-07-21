import Heading from '~/components/Heading/Heading';
import {Link} from '~/components/Link';
import PageHeader from '~/components/PageHeader';
import React from 'react';
import { IconDollar, IconDollarSign, IconEqual, IconStar } from '~/components/Icon';

const Rewards: React.FC = () => {
  return (
    <div className="max-w-xl mx-auto">
      <PageHeader 
        title={"Astro's Rewards"}
        description={'Get Jerky, Get Rewards.'} 
        hasBreadcrumb={false}
        className='text-center mt-8'>
      </PageHeader>

      <hr className='mx-3 md:mx-4 lg:mx-6 my-6' />

      <div className="text-center grid gap-6 px-6">
        <Heading className='text-lead color-logo-green'>EARN POINTS & COLLECT REWARDS</Heading>

        <div className="">
          <span className='font-bold'>SIGN UP TODAY TO EARN <div className="bg-logo-red text-white pointer-bg">FREE</div> 100 POINTS!</span>
        </div>
        <div className='grid grid-cols-2 gap-8 items-center justify-items-center'>
          <Link 
            to="/account" 
            className='px-6 py-2 rounded-full w-full relative color-logo-green border-gray-400 border bg-white'
          > 
            Log In
          </Link>

          <Link 
            to="/account" 
            className='px-6 py-2 rounded-full w-full relative bg-black text-white border border-black'
          > 
            Join Now
          </Link>
        </div>
      </div>
      
      <hr className='mx-3 md:mx-4 lg:mx-6 my-8' />

      <div className="text-center">
        <div>
          <Heading  className='text-lead mb-6 md:mb-8 lg:mb-12'>HOW IT WORKS</Heading>
          <div className='grid grid-cols-7 items-center justify-items-center'>
            <div className='col-span-2 col-start-2 gap-3 grid'>
              <IconDollar />
              <span className='text-copy'>Spend 1 dollar</span>
            </div>
            <div className='col-span-1'>
              <IconEqual />
            </div>
            <div className='col-span-2 col-start-5 gap-3 grid'>
              <IconStar content='1' label='pt' contentX='6.5' contentY='9' contentSize='5' />
              <span className='text-copy'>Earn 1 point</span>
            </div>
          </div>
          <hr className='w-11/12 xs:w-96 h-1 mx-auto bg-black my-6' />
          <div className='grid grid-cols-7 items-center justify-items-center'>
            <div className='col-span-2 col-start-2 gap-3 grid'>
              <IconStar content='100' label='pts' contentX='5' contentY='9' contentSize='3.5' />
              <span className='text-copy'>100 points</span>
            </div>
            <div className='col-span-1'>
              <IconEqual />
            </div>
            <div className='col-span-2 col-start-5 gap-3 grid'>
              <IconDollarSign />
              <span className='text-copy'>$5 Rewards</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Rewards;