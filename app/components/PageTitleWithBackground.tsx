import React from 'react';


interface PageTitleWithBackgroundProps {
  title: string;
  description: string;
  backgroundImage: string;
  radialGradient?: string;
}

const PageTitleWithBackground: React.FC<PageTitleWithBackgroundProps> = ({
  title,
  description,
  backgroundImage,
  radialGradient = 'radial-gradient(rgba(0, 0, 0, 0.6) 0%, transparent 90%)'
}) => {
  const iconImages = [
    {
      description: "MADE IN THE USA",
      url: "https://cdn.shopify.com/s/files/1/0641/9742/7365/files/icon-usa.png"
    },
    {
      description: "SAME DAY SHIPPING",
      url: "https://cdn.shopify.com/s/files/1/0641/9742/7365/files/icon-shipping.png"
    },
    {
      description: "HANDCRAFTED WITH FAMILY RECIPE",
      url: "https://cdn.shopify.com/s/files/1/0641/9742/7365/files/icon-knife.png"
    },
    {
      description: "HIGH IN PROTEIN",
      url: "https://cdn.shopify.com/s/files/1/0641/9742/7365/files/icon-protein.png"
    }
  ];
  return (
    <section
      aria-labelledby="collection-title"
      className="p-10 relative text-white text-center bg-radial-overlay"
      style={{
        backgroundImage: `${radialGradient}, url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <h2 className="relative text-xl sm:text-2xl italic font-serif">Astro's</h2>
      <h1
        id="collection-title"
        className="block text-3xl sm:text-4xl font-semibold capitalize relative"
      >
        {title.replace(/(<([^>]+)>)/gi, '')}
      </h1>
      <p className="block mt-4 text-lg relative">{description}</p>
      <div className="flex items-start justify-center text-center relative mt-8">
        {iconImages.map((image, index) => (
          <div
            key={index}
            className={`flex flex-col items-center shrink-1 max-w-24 lg:max-w-32 ${
              index !== 0 ? 'ml-2 md:ml-8 lg:ml-10' : ''
            }`}
          >
            <img
              src={image.url}
              alt={image.description}
              className="size-12 md:size-16 text-black"
            />
            <span className="text-xs mt-4 font-bold">{image.description}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PageTitleWithBackground;