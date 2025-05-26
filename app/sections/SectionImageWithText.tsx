import {Image, type ParsedMetafields} from '@shopify/hydrogen';
import {parseSection} from '~/utils/parseSection';
import {useFetcher} from '@remix-run/react';
import type {
  AddSubscriberMutation,
  SectionImageWithTextFragment,
} from 'storefrontapi.generated';
import Logo from '~/components/Logo';
import ButtonPrimary from '~/components/Button/ButtonPrimary';
import ButtonSecondary from '~/components/Button/ButtonSecondary';
import ButtonCircle from '~/components/Button/ButtonCircle';
import {Badge, badgeColors} from '~/components/badge';
import {
  ArrowRightIcon,
  CheckCircleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';
import backgroundLineSvg from '@/assets/images/Moon.svg?url';
import backgroundLineSvg3 from '@/assets/images/BackgroundLine.svg?url';
import Input from '~/components/MyInput';
import clsx from 'clsx';
import { hexToRgba } from '~/lib/utils';
import { IconCow } from '~/components/Icon';

export function SectionImageWithText(props: SectionImageWithTextFragment) {
  const section = parseSection<
    SectionImageWithTextFragment,
    {
      title?: ParsedMetafields['single_line_text_field'];
      features?: ParsedMetafields['list.single_line_text_field'];
    }
  >(props);

  const {
    image,
    heading,
    button_1,
    button_2,
    background_color,
    show_subscribers_input,
    features,
    style,
    title,
    content,
    hide_logo,
  } = section;

  const fetcher = useFetcher();
  const {customerCreate} = (fetcher.data || {}) as AddSubscriberMutation;
  const backgroundColor = background_color?.value || 'black';
  const gradientColorWithOpacity = hexToRgba(backgroundColor, 0.9); // Adjust opacity as needed
  return (
    <section
      className={`section-image-with-text`}
    >
      <div
        className={clsx([
          style?.value === '1' &&
            'relative flex flex-col lg:flex-row items-center rounded-2xl sm:rounded-[40px]',
          style?.value === '2' &&
            'relative flex flex-col lg:flex-row lg:justify-end bg-yellow-50 dark:bg-slate-800 rounded-2xl sm:rounded-[40px] p-4 pb-0 sm:p-5 sm:pb-0 lg:p-24',
          style?.value === '3' &&
            'relative md:grid md:grid-cols-2',
        ])}
      >
        {/*style?.value !== '1' && (
          <div className="absolute inset-0">
            <img
              className="absolute w-full h-full object-contain object-bottom"
              src={
                style?.value === '3' ? backgroundLineSvg3 : backgroundLineSvg
              }
              alt="backgroundLineSvg"
              sizes="max-width: 640px 100vw, max-width: 1024px 80vw, 50vw"
            />
          </div>
        )*/}

        {/* IMAGE */}
        <div
          className={clsx([
            'w-full h-full',
            style?.value === '1' && 'relative flex-1 max-w-xl lg:max-w-none',
            style?.value === '2' &&
              'relative block lg:absolute lg:left-0 lg:bottom-0 mt-10 lg:mt-0 max-w-xl lg:max-w-[calc(55%-40px)]',
            style?.value === '3' &&
              'relative block',
          ])}
        >
          {image?.image && (
            <>
            <Image
              data={image?.image}
              className="w-full h-full block"
              sizes="max-width: 640px 100vw, max-width: 1024px 80vw, 50vw"
            />
            <div
              className="absolute inset-0 pointer-events-none md:hidden"
              style={{
                background: `linear-gradient(to top, ${backgroundColor} 0%, ${gradientColorWithOpacity} 5%, transparent 20%)`,
              }}
            ></div>
            <div
              className="absolute inset-0 pointer-events-none hidden md:block "
              style={{
                background: `linear-gradient(to left, ${backgroundColor} 0%, ${gradientColorWithOpacity} 5%, transparent 30%)`,
              }}
            ></div>
          </>
          )}
        </div>
        {/* CONTENT 
        bg-gradient-to-b md:bg-gradient-to-r from-[#ED1C24] to-[#facc15] mt-[-1px] md:mt-0
        */}
        <div
          className={clsx([
            style?.value === '1' &&
              'relative flex-shrink-0 mb-16 lg:mb-0 lg:mr-10 lg:w-2/5',
            style?.value === '2' && 'lg:w-[45%] max-w-lg relative',
            style?.value === '3' && 'flex flex-col py-10 lg:py-0  gap-4 lg:gap-10 text-center justify-center w-full',
            'bg-gradient-to-b md:bg-gradient-to-r from-[#551d00] to-[#350e00] mt-[-1px] md:mt-0 text-white'
          ])}
        >
          {hide_logo?.value !== 'true' && <Logo className="w-28" />}
          <h2
            className={clsx([
              style?.value === '1' &&
                'font-semibold text-3xl sm:text-4xl xl:text-5xl 2xl:text-6xl !leading-[1.2] tracking-tight',
              style?.value === '2' &&
                'font-semibold text-3xl sm:text-4xl xl:text-5xl 2xl:text-6xl !leading-[1.2] tracking-tight',
              style?.value === '3' && 'font-semibold text-4xl',
              hide_logo?.value !== 'true' && 'mt-6 sm:mt-10',
            ])}
            dangerouslySetInnerHTML={{__html: heading?.value || ''}}
          ></h2>
          <div
            className="block text-lg"
            dangerouslySetInnerHTML={{__html: content?.value || ''}}
          ></div>
          {!!features?.value && (
            <ul className="space-y-4 mt-9">
              {features?.parsedValue?.map((feature, index) => (
                <li
                  className="flex items-center space-x-4"
                  key={`${index + feature}`}
                >
                  <Badge color={badgeColors[index]} className="!rounded-full">
                    {index < 10 ? '0' : ''}
                    {index + 1}
                  </Badge>
                  <span className="font-medium text-neutral-700 dark:text-neutral-300">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          )}
          {show_subscribers_input?.value === 'true' && (
            <fetcher.Form
              className="mt-9 relative max-w-sm"
              method="post"
              action="/?index"
              preventScrollReset
            >
              <Input
                required
                aria-required
                placeholder="Enter your email"
                type="email"
                className="rounded-full"
                name="new_subscribe_email"
              />
              <ButtonCircle
                type="submit"
                name="_action"
                value="add_new_subscribe"
                className="absolute transform top-1/2 -translate-y-1/2 right-1"
                disabled={fetcher.state === 'submitting'}
              >
                <ArrowRightIcon className="w-5 h-5" />
              </ButtonCircle>
            </fetcher.Form>
          )}
          {customerCreate?.customerUserErrors[0]?.message && (
            <div className="text-red-400 flex gap-2 mt-1 ml-1">
              <InformationCircleIcon className="w-4 h-4" />
              <i className="text-sm">
                {customerCreate?.customerUserErrors[0]?.message}
              </i>
            </div>
          )}
          {!customerCreate?.customerUserErrors.length &&
            customerCreate?.customer?.id && (
              <div className="text-green-500 flex gap-2 mt-1 ml-1">
                <CheckCircleIcon className="w-4 h-4" />
                <i className="text-sm">Thank you for subscribing!</i>
              </div>
            )}

          {(!!button_1?.href || !!button_2?.href) && (
            <div className="flex space-x-2 sm:space-x-5 justify-center">
              {button_1?.href && (
                <ButtonPrimary
                  targetBlank={!!button_1.target?.value}
                  href={button_1.href.value || undefined}
                >
                  {button_1?.text?.value || 'Get started'}
                </ButtonPrimary>
              )}
              {!!button_2?.href && (
                <ButtonSecondary
                  href={button_2.href.value || undefined}
                  bgColor='bg-secondary-600 hover:!bg-secondary-900'
                  className="py-3 px-8  lg:py-3.5 focus:!ring-neutral-600 grid grid-cols-7"
                >
                  <IconCow className="size-6 col-span-1 fill-white"  />
                  <span className='uppercase col-span-6'>{button_2?.text?.value || 'Learn more'}</span>
                </ButtonSecondary>
              )}
            </div>
          )}
        </div>

      </div>
    </section>
  );
}

export const SECTION_IMAGEWITHTEXT_FRAGMENT = `#graphql
  fragment SectionImageWithText on Metaobject {
    type
    title: field(key: "title") {
      key
      value
    }
    heading: field(key: "heading") {
      key
      value
    }
    content: field(key: "content") {
      key
      value
    }
    hide_logo: field(key: "hide_logo") {
      key
      value
    }
    background_color: field(key: "background_color") {
      key
      value
    }
    button_1: field(key: "button_1") {
      ...Link
    }
    button_2: field(key: "button_2") {
      ...Link
    }
    image: field(key: "image") {
      key
      reference {
        ... on MediaImage {
          ...MediaImage
        }
      }
    }
    features: field(key: "features") {
      key
      type
      value
    }
    show_subscribers_input: field(key: "show_subscribers_input") {
      key
      value
    }
    style: field(key: "style") {
      key
      value
    }
  }
`;
