import React, {type FC} from 'react';
import {type CommonCollectionItemFragment} from 'storefrontapi.generated';
import {Link} from './Link';
import {Image} from '@shopify/hydrogen';
import ButtonSecondary from './Button/ButtonSecondary';
import {type FilterValue} from '@shopify/hydrogen/storefront-api-types';
import clsx from 'clsx';
import ButtonPrimary from './Button/ButtonPrimary';
import { IconArrowCircleRight } from './Icon';

export type TMyCommonCollectionItem = Partial<CommonCollectionItemFragment> & {
  products?: {
    filters?: {
      values?: Pick<FilterValue, 'count' | 'input' | 'label'>[];
    }[];
  };
};

interface CollectionItemProps {
  item: Partial<TMyCommonCollectionItem>;
  button_text?: string;
  onClick?: () => void;
  className?: string;
}

const CollectionItem: FC<CollectionItemProps> = ({
  item,
  button_text = 'Shop now',
  onClick,
  className = '',
}) => {
  const {description, handle, title, horizontal_image, products, image} = item;

  const hImage = horizontal_image?.reference?.image;

  const productTitle = title?.replace('Premium Cut Beef Jerky', '').replace('Premium Cut Chicken Jerky', '');
  return (
    <Link
      to={'/collections/' + handle}
      className={clsx(`block w-full`, className)}
      onClick={onClick}
    ><div className="max-w-[18rem] mx-auto">
          <h2
            className="text-lg lg:text-2xl  font-semibold mt-0.5 sm:mt-2 p-1 opacity-80 rounded-2xl text-center"
           >
            {productTitle} 
          </h2>
         </div>
      <div className={`relative w-full aspect-w-16 ${image ? 'aspect-h-16' : 'aspect-h-12 sm:aspect-h-9'} rounded-2xl overflow-hidden bg-slate-100 group`}>
        {hImage && (
          <Image
            className="absolute inset-0 w-full h-full object-cover rounded-2xl "
            data={hImage}
            sizes="(max-width: 640px) 90vw, (max-width: 1200px) 50vw, 40vw"
          />
        )}
        {image && (
          <Image
            className="absolute inset-0 w-full h-full object-cover rounded-2xl opacity-85"
            data={image}
            sizes="(max-width: 640px) 70vw, (max-width: 1200px) 50vw, 40vw"
          />
        )}

        <span className="opacity-0 group-hover:opacity-40 absolute inset-0 bg-black/10 transition-opacity"></span>

        <div>
          <div className="absolute inset-4 lg:inset-8 flex flex-col text-center">
         {/*     <div className="max-w-[18rem] mx-auto">
              {!!productTitle && (
                  <h2
                    className="text-lg lg:text-2xl   font-semibold mt-0.5 sm:mt-2 p-1 opacity-85 px-5"
                    dangerouslySetInnerHTML={{__html: productTitle}}
                  />
                )}
              </div>
               */}
            <div className="mt-auto">
              <ButtonPrimary
                sizeClass="py-2 px-3"
                fontSize="text-xs font-medium"
                className="uppercase  min-w-24 !text-black !font-bold gap-2"
              >
                {button_text || 'Enter'}
                <IconArrowCircleRight className='!size-6 md:!size-8' />
              </ButtonPrimary>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export const CollectionItemSkeleton = ({
  className = '',
}: {
  className?: string;
}) => {
  return (
    <div className={clsx(`block w-full`, className)}>
      <div className="relative w-full aspect-w-16 aspect-h-12 sm:aspect-h-9 rounded-2xl overflow-hidden bg-slate-100 group">
        <span className="opacity-0 group-hover:opacity-40 absolute inset-0 bg-black/10 transition-opacity"></span>

        <div>
          <div className="absolute inset-4 md:inset-8 flex flex-col">
            <div className="max-w-[18rem]">
              <span className={`block text-sm text-slate-700`}>Collection</span>
              <h2 className="text-xl md:text-2xl text-slate-900 font-semibold mt-0.5 sm:mt-2">
                Skeleton Collection
              </h2>
            </div>
            <div className="mt-auto">
              <ButtonSecondary
                disabled
                sizeClass="py-3 px-4 sm:py-3.5 sm:px-6"
                fontSize="text-sm font-medium"
                className="nc-shadow-lg"
              >
                {'Explore now'}
              </ButtonSecondary>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionItem;
