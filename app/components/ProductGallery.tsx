import {Image} from '@shopify/hydrogen';
import type {MediaFragment} from 'storefrontapi.generated';
import {useEffect, useState} from 'react';
import {Dialog, Transition} from '@headlessui/react';
import ButtonClose from './ButtonClose';
import clsx from 'clsx';
import {MagnifyingGlassCircleIcon, MagnifyingGlassIcon, MagnifyingGlassPlusIcon, ViewfinderCircleIcon} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

/**
 * A client component that defines a media gallery for hosting images, 3D models, and videos of products
 */
export function ProductGallery({
  media,
  className,
  aspectRatio = '2/3',
}: {
  media: MediaFragment[];
  className?: string;
  aspectRatio?: string;
}) {
  const [isOpenModal, setOpenModal] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const closeModal = () => {
    setOpenModal(false);
    setActiveIndex(0);
  };

  if (!media.length) {
    return null;
  }

  return (
    <>
      <div
        className={`swimlane p-0 lg:grid-flow-row hiddenScroll lg:px-8 lg:overflow-x-auto lg:grid-cols-1 ${className}`}
      >
        {media.map((med, i) => {
          if(i > 2) return null; // Limit to first 3 images
          const image =
            med.__typename === 'MediaImage'
              ? {...med.image, altText: med.alt || 'Product image'}
              : null;

          if (!image) return null;


          return (
            <div
              className={`lg:col-span-1 snap-center card-image w-[calc(100vw_-_2rem)] sm:w-[calc(80vw_-_2rem)] lg:w-full cursor-pointer relative group bg-gray-100 rounded-2xl`}
              key={med.id || image?.id}
              aria-hidden
            >
              <motion.button
                className="bg-white absolute z-10 bottom-5 right-5 size-10 variant-button flex text-center justify-center group-hover:opacity-100 transition-opacity"
                type="button"
                onClick={() => {
                  setOpenModal(true);
                  setActiveIndex(i);
                }}
                whileTap={{
                  boxShadow: "none", // Removes box-shadow
                  translateX: "1px", // Moves 1px to the right
                  translateY: "1px", // Moves 1px down
                  backgroundPosition: "left", // Changes background position to left
                  transition: {
                    duration: 0.05, // Applies a short transition
                  },
                }}
              >
                <span className="sr-only">View image</span>
                <MagnifyingGlassIcon className="mx-auto w-5 h-5" />
              </motion.button>

              <Image
                loading={i === 0 ? 'eager' : 'lazy'}
                data={image}
                aspectRatio={aspectRatio}
                sizes='(min-width: 48em) 60vw, 90vw'
                className="object-cover rounded-2xl fadeIn w-full"
              />
            </div>
          );
        })}
      </div>

      <div className="">
        <Transition show={isOpenModal} as={'div'}>
          <Dialog
            as="div"
            className="fixed inset-0 z-100 overflow-y-auto"
            onClose={closeModal}
          >
            <>
              <Transition.Child
                as={'div'}
                enter="ease-out duration-150"
                enterFrom="opacity-0 translate-y-40"
                enterTo="opacity-100 translate-y-0"
                leave="ease-in duration-100"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-20"
                className="min-h-screen text-center "
              >
                <span
                  className="inline-block h-screen align-middle dr"
                  aria-hidden="true"
                >
                  &#8203;
                </span>

                <ButtonClose
                  onClick={closeModal}
                  className="fixed left-2 top-2 sm:left-5 sm:top-5 z-50 sm:!w-11 sm:!h-11 border"
                  IconclassName="w-6 h-6"
                />
                <div className="inline-block w-full overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl text-neutral-900">
                  <div className="container">
                    <ModalImageGallery
                      media={media}
                      indexActive={activeIndex}
                    />
                  </div>
                </div>
              </Transition.Child>
            </>
          </Dialog>
        </Transition>
      </div>
    </>
  );
}

function ModalImageGallery({
  media,
  indexActive,
}: {
  media: MediaFragment[];
  indexActive: number;
}) {
  useEffect(() => {
    if (!indexActive) return;
    const image = document.getElementById('image' + indexActive);
    if (image) {
      image.scrollIntoView({
        behavior: 'instant',
        block: 'start',
        inline: 'nearest',
      });
    }
  }, [indexActive]);

  return (
    <div className="grid gap-5">
      {media.map((med, i) => {
        const image =
          med.__typename === 'MediaImage'
            ? {...med.image, altText: med.alt || 'Product image'}
            : null;

        return (
          <div key={med.id || image?.id} id={'image' + i}>
            {image && (
              <Image
                loading={i === 0 ? 'eager' : 'lazy'}
                data={image}
                sizes="95vw"
                className="w-full"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
