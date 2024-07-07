import {useRootLoaderData} from '~/lib/root-data';

export const useGetPublicStoreCdnStaticUrlFromRootLoaderData = () => {
  const rootLoaderData = useRootLoaderData();

  const {
    publicStoreCdnStaticUrl,
    publicImageFormatForProductOption: imgFormat,
  } = rootLoaderData;

  const getImageWithCdnUrlByName = (imageName: string, format = imgFormat) => {
    return `${publicStoreCdnStaticUrl}${imageName}.${format}`;
  };

  return {
    publicStoreCdnStaticUrl,
    imgFormat,
    getImageWithCdnUrlByName,
  };
};
