
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
           
        
            <div className={`text-base border-black border w-full`}>
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
                                key: 'Honey Teriyaki Beef Jerky 3oz',
                                value: '1'
                            },
                            {
                                key: 'Supernova Hot Beef Jerky 3oz',
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

            <div className='grid grid-cols-1 gap-5 text-lg'>
                <h2 className='font-bold text-xl'>
                    The Ultimate Flavor Trio: The Best Seller Classic Pack!
                </h2>
                <ul>
                    <li>1 x Sweet & Spicy Premium Beef Jerky 3oz bag</li>
                    <li>1 x Honey Teriyaki Premium Beef Jerky 3oz bag</li>
                    <li>1 x Supernova Hot Premium Beef Jerky 3oz bag</li>
                </ul>
                <p>
                    Behold, the royalty of the jerky world. These three flavors reign supreme in the Astro Jerky kingdom, each having earned their place as the crown jewels of our collection. They’re not just snacks—they’re legends in the making, consistently flying off the shelves for over a decade!
                </p>
                <p>Let’s kick things off with the first flavor: <span className='font-bold'>Sweet & Spicy</span>. This jerky is an instant classic, lighting up your taste buds like a bolt of lightning streaking across a midnight sky. The sweet kiss of brown sugar dances with the fiery heat of chili peppers, creating a taste sensation so bold, it’ll send your neurons into overdrive. Perfect for those craving an adventure in every bite.</p>
                <p>Next, experience the celestial fusion of <span className='font-bold'>Honey Teriyaki</span>. Crafted from premium grass-fed beef, this flavor blends real pineapple, golden honey, and authentic teriyaki sauce into a symphony of sweet and savory perfection. Slow-cooked to tender excellence, it’s a snack that transports you to the stars with every bite.</p>
                <p>And finally, brace yourself for the fiery <span className='font-bold'>Supernova Hot</span>. Not for the faint of heart, this jerky is an explosive blend of cayenne peppers, habaneros, smoky undertones, and a touch of sweetness. It delivers a mouthwatering inferno of flavor, perfect for spice seekers who crave the heat and refuse to back down.</p>
                <p>Each of these jerky bags is a one-way ticket to flavor town. And trust me, they won’t be here for long. These fan favorites sell out faster than a speeding comet, and this curated pack is sure to do the same. Add it to your cart now before they disappear!</p>
                <p>NOTE: And here’s the best part—every slice of Astro Fresh Jerky is handcrafted in Los Angeles, with 100% premium beef. No fillers. No trimmings. No shortcuts. Just pure, mouthwatering jerky that’s packed with flavor and protein.</p>
            </div>
        </div>
    </section>
  );
};

export default ProductDisplay;