
import {Image} from '@shopify/hydrogen';
import { Link } from "react-router-dom";

const HeroSlider = () => {
  const products = [
    {
      src: "https://cdn.shopify.com/s/files/1/0641/9742/7365/files/BigBangHotBeef_B-removebg-preview.png",
      alt: "Big Bang Hot Beef Jerky",
      css: 'top-[20%] -rotate-1 left-1/2 transform -translate-x-1/2 z-[1] w-[60%]',
    },
    {
      src: "https://cdn.shopify.com/s/files/1/0641/9742/7365/files/SuperNovaHotBeef.png",
      alt: "Supernova Hot Beef Jerky",
      css: 'right-[-5%] top-[15%] sm:top-[10%] sm:right-[-10%] 2xl:right-[0%] rotate-[15deg]',
    },
    {
      src: "https://cdn.shopify.com/s/files/1/0641/9742/7365/files/SweetnSpicyBeef.png",
      alt: "Sweet and Spicy Beef Jerky",
      css: 'left-[-5%] top-[15%] sm:top-[10%] sm:left-[-10%] 2xl:left-[0%] rotate-[-15deg]',
    },
  ];

  const illustrations = [
    {
      src: "https://cdn.shopify.com/s/files/1/0641/9742/7365/files/red-chili-isolated-white.png",
      alt: "Red Chili Pepper",
      css: 'top-[60%] left-0 lg:left-[-15%] z-[4] animate-rotate',
      imageCss: ''
    },
    {
      src: "https://cdn.shopify.com/s/files/1/0641/9742/7365/files/chili-pepper-isolated.png",
      alt: "Green Chili Pepper",
      css: 'top-[60%] sm:top-[80%] right-[1%] lg:right-[-8%] z-[4] animate-rotate',
      imageCss: 'transform rotate-[120deg]'
    },
    {
      src: "https://cdn.shopify.com/s/files/1/0641/9742/7365/files/onion.png",
      alt: "Onion",
      css: 'top-[10%] sm:top-[4%] left-[0%] lg:left-[-15%] z-[4] animate-floating',
      imageCss: ''
    },
    {
      src: "https://cdn.shopify.com/s/files/1/0641/9742/7365/files/garlic.png",
      alt: "Garlic",
      css: 'top-[5%] right-0 sm:top-0 sm:right-5 lg:right-[-8%] z-[4] animate-floating',
      imageCss: ''
    }
  ];
  const jerkyImage = [
    {
      src: "https://cdn.shopify.com/s/files/1/0641/9742/7365/files/MilkyWayBBQBeef_J-removebg-preview.png",
      alt: "Milky Way BBQ Beef Jerky",
      css: 'justify-self-center z-[4] animate-floating',
      imageCss: 'transform rotate-[5deg]'
    },
    {
      src: "https://cdn.shopify.com/s/files/1/0641/9742/7365/files/SuperNovaHotBeef_J-removebg-preview.png",
      alt: "Supernova Hot Beef Jerky",
      css: 'justify-self-center z-[4] animate-floating',
      imageCss: ''
    }
  ];


  return (
    <section className="bg-gradient-to-br from-yellow-400 via-yellow-300 to-yellow-200 py-12 mb-24 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center justify-center sm:min-h-[40rem]">
          {/* Hero Content */}
          <div className="text-center">
            <div className="space-y-6">
              {/* Headings */}
              <h1 className="text-4xl md:text-6xl uppercase  font-AlfaSlabOne tracking-wider">
                Astro Fresh Jerky
              </h1>
              {/* Description */}
              <p className="text-lg">
                High Protein-Packed Snacks with bold flavors.
              </p>
              {/* Button */}
              <div className={`text-sm border-black border w-80 mx-auto`}>
                <Link
                  to="/best-beef-jerky-flavors"
                  className="flex pdp-add-to-cart-button bg-black text-white py-2 outline-none h-[56px] text-lead w-full items-center justify-center"
                >
                  Discover the Flavors
                </Link>
              </div>
            </div>
          </div>

          {/* Product Lineup */}
          <div className="h-[120vw] min-h-[30rem] sm:h-full relative">
            
            {products.map((product, i) => (
              <div
                key={i}
                className={`absolute transform w-1/2 sm:w-80 ${product.css}`}
              >
                <img
                  src={product.src}
                  alt={product.alt}
                />
              </div>
            ))}

            {/* Illustrations */}
            {illustrations.map((illustration, i) => (
              <div
                key={i}
                className={`absolute w-20 md:w-32 ${illustration.css}`}
              >
                <img
                  className={illustration.imageCss}
                  src={illustration.src}
                  alt={illustration.alt}
                />
              </div>
            ))}

            <div
              className='absolute left-1/2 bottom-10 sm:-bottom-5 xl:bottom-0 transform -translate-x-1/2 z-[4] w-full grid grid-cols-3'
            >
              
              {jerkyImage.map((illustration, i) => (
              <>
                <div
                  key={i}
                  className={`w-20 md:w-32 ${illustration.css}`}
                >
                  <img
                    className={illustration.imageCss}
                    src={illustration.src}
                    alt={illustration.alt}
                  />
                </div>
                {i === 0 && 
                  <Link
                    to="/best-beef-jerky-flavors"
                  >
                  <h1 className="text-sm font-extrabold uppercase tracking-wider animate-floating bg-black text-white hover:bg-gray-600 p-2 w-full max-w-36 justify-self-center text-center">
                      Buy 3 for $33!
                  </h1>
                  </Link>}
              </>
            ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;
