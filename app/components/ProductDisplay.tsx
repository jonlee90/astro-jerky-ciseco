
import { Await, useFetcher, useLoaderData, useRouteLoaderData } from '@remix-run/react';
import {Image} from '@shopify/hydrogen';
import { motion } from 'framer-motion';
import React, { Suspense, useEffect } from 'react';
import { Link } from "react-router-dom";
import { AddToCartButton } from './AddToCartButton';
import { useAside } from './Aside';
import { IconArrowRight } from './Icon';
import Prices from './Prices';
import type { loader } from '~/routes/($locale).beef-jerky.$productHandle';

const ProductDisplay = () => {
    const {open} = useAside();
    const fetcher = useFetcher();
  
    useEffect(() => {
        if (fetcher.state === 'idle' && !fetcher.data) {
            fetcher.load(`/beef-jerky/the-classic-pack-3-bags?Type=Best+Sellers`);
        }
    }, [fetcher]);
    
    if (fetcher.state === 'loading' || !fetcher.data) {
        return <div>Loading...</div>;
      }
      
    const { product } = fetcher.data;
    const {selectedVariant} = product;

    const analyticsData = {
        products: [{
          productGid: product.id,
          quantity: 1,
        }],
        totalValue: selectedVariant.price.amount
      };
  return (
    <section 
        id='product-display'
        aria-label='Product section'
        className="2xl:max-w-screen-xl mx-auto container sm-max:max-w-[640px] grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5"
    >
        {/* Galleries */}
        <div 
            aria-label="Product images"
            className="">
            <Image
                loading='eager'
                data={product.media.nodes[0].image}
                aspectRatio="5/4"
                sizes='800px'
                className="object-cover rounded-2xl fadeIn w-full"
            />
        </div>

        {/* Product Details */}
        <div 
            aria-label="Product Details"
            className="grid grid-cols-1 gap-10">
            <h1
                className="text-4xl sm:text-5xl font-bold text-center"
                title={product.title}
                aria-label={`Product title: ${product.title}`}
            >
                {product.title}<br/>
                (Best Sellers)
            </h1>

            <Prices
                contentClass="!text-3xl justify-center"
                compareAtPriceClass='text-2xl text-slate-500 ml-[10px]'
                price={selectedVariant.price}
                compareAtPrice={selectedVariant.compareAtPrice}
            />
           
        
            <div className={`text-sm border-black border w-full`}>
                <AddToCartButton
                    lines={[
                    {
                        merchandiseId: selectedVariant.id,
                        quantity: 1,
                        selectedVariant: selectedVariant,
                        attributes: [
                            {
                                key: 'Sweet and Spicy Beef Jerky 3oz',
                                value: '1'
                            },
                            {
                                key: 'Whiskey BBQ Beef Jerky 3oz',
                                value: '1'
                            },
                            {
                                key: 'Buffalo Chicken Wing Hot Jerky 3oz',
                                value: '1'
                            }
                        ]
                    },
                    ]}
                    analytics={analyticsData}
                    className={`w-full pdp-add-to-cart-button relative bg-black hover:bg-neutral-600 text-white py-2 outline-none h-[60px] text-lead`}
                    data-test="add-to-cart"
                    onClick={() => open('cart')}
                >
                
                    <span className={`text-center uppercase font-bold `}>
                        Add to Cart
                    </span>
                    
                    
                </AddToCartButton>
            </div>

            <div className='grid grid-cols-1 gap-5'>
                <h2 className='font-bold text-lg'>
                    The Ultimate Flavor Trio: The Best Seller Classic Pack!
                </h2>
                <ul>
                    <li>1 x Sweet & Spicy Premium Beef Jerky 3oz bag</li>
                    <li>1 x Whiskey BBQ Premium Beef Jerky 3oz bag</li>
                    <li>1 x Buffalo Chicken Wing Premium Chicken Jerky 3oz bag</li>
                </ul>
                <p>
                    Behold, the royalty of the jerky world. These three flavors reign supreme in the Astro Jerky kingdom, each having earned their place as the crown jewels of our collection. They’re not just snacks—they’re legends in the making, consistently flying off the shelves for over a decade!
                </p>
                <p>Let’s kick things off with the first flavor: <span className='font-bold text-lg'>Sweet & Spicy</span>. This jerky is an instant classic, lighting up your taste buds like a bolt of lightning streaking across a midnight sky. The sweet kiss of brown sugar dances with the spicy heat of chili peppers, creating a taste sensation so bold, it’ll send your neurons into overdrive. Perfect for those craving an adventure in every bite.</p>
                <p>Next, we have the smoky, whiskey-infused majesty that is <span className='font-bold text-lg'>Whiskey BBQ</span>. Picture this: a tender slice of premium beef, marinated in a rich whiskey BBQ sauce that’s been slow-cooked to perfection. It’s like wrapping yourself in a cozy campfire blanket—bold, smoky, and undeniably delicious. It’s not just a jerky; it’s an experience.</p>
                <p>And finally, the fearless <span className='font-bold text-lg'>Hot Buffalo Chicken Wing</span>. Made using protein packed premium chicken breast, this one’s for the spice seekers and thrill chasers. Imagine the perfect balance of heat, zest, and spice crashing together like a storm. The fiery cayenne pepper and tangy buffalo sauce don’t just hit your tongue—they hit your soul, bringing the intense heat and flavor you’ve been longing for.</p>
                <p>Each of these jerky bags is a one-way ticket to flavor town. And trust me, they’re not here for long. These fan favorites sell out faster than a speeding comet, and this curated pack is sure to do the same. Add it to your cart now before they disappear!</p>
                <p>NOTE: And here’s the best part, every slice of Astro Fresh Jerky is hand-made in America, by Americans, with 100% premium beef and chicken breast. No fillers. No trimmings. No shortcuts. Just pure, mouthwatering jerky that’s packed with flavor and protein.</p>
            </div>
        </div>
    </section>
  );
};

export default ProductDisplay;