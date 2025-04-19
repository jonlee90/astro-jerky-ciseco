import { Link } from "./Link";
import { motion } from 'framer-motion';
import { Card, CardHeader, CardBody } from "@material-tailwind/react";
import { Image } from '@shopify/hydrogen';
import Prices from '~/components/Prices';

interface Product {
  id: string;
  title: string;
  handle: string;
  description?: string;
  priceRange?: any;
  compareAtPriceRange?: any;
  media?: any;
  images?: any;
}

interface BundleProductCardProps {
  product: Product;
  urlPrefix?: string;
  packDescriptions?: any[];
}

export function BundleProductCard({
  product,
  urlPrefix = 'bundle',
  packDescriptions = [],
}: BundleProductCardProps) {

  const {
    id,
    title,
    handle,
    description = '',
    priceRange,
    compareAtPriceRange,
    media = [],
    images = [],
  } = product;

  const image = images?.edges?.[0].node || media?.nodes?.[0]?.image || null;
  const imageWidth = urlPrefix == 'beef-jerky' ? '750px' : image?.width;
  const imageHeight = urlPrefix == 'beef-jerky' ? '650px' : image?.height;
  const cardHeaderClassName = urlPrefix == 'beef-jerky' ? 'px-20 border-b' : '';
  const matchingPackDescription = packDescriptions.find(
    (pack) => pack.handle === handle
  );

  const cleanedTitle = title.replace(" - 3 Bags", "");
  return (
    <Link
      key={id}
      to={`/${urlPrefix}/${handle}`}
      prefetch="intent"
      aria-label={`View details for ${title}`}
    >
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }}>
        <Card
          className={`grid grid-cols-1 text-black`}
          role="article"
          aria-labelledby={`product-title-${id}`}
        >
          <CardHeader floated={false} shadow={false} color="transparent" className={`m-0 rounded-b-none ${cardHeaderClassName}`}>
            {image ? (
              <Image
                data={image}
                role="img"
                aria-label={`Image for ${title}`}
                width={imageWidth}
                height={imageHeight}
              />
            ) : (
              <div className="bg-gray-200 w-full h-[458px] flex items-center justify-center">
                <span>No Image Available</span>
              </div>
            )}
          </CardHeader>
          <CardBody className="grid grid-cols-1 gap-2 p-4 text-lg">
            <h2 aria-label="Product Title" id={`product-title-${id}`} className="font-bold text-2xl">
              {cleanedTitle}
            </h2>
            {description && <p aria-label="Product description">{description}</p>}
            
            {priceRange && compareAtPriceRange && (
              <span aria-label="Product Price" className="flex gap-4">
                <Prices
                  contentClass="justify-center !text-red-600"
                  price={priceRange.minVariantPrice}
                  compareAtPrice={compareAtPriceRange.minVariantPrice}
                />
              </span>
            )}
            {matchingPackDescription && (
              <ul className="list-none space-y-2">
                {matchingPackDescription.products.map((product, index) => (
                  <li key={index} className="text-sm opacity-70">
                    1x {product} Beef Jerkey 3oz
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>
      </motion.div>
    </Link>
  );
}