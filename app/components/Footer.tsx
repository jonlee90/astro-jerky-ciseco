import React from 'react';
import type {ChildEnhancedMenuItem, ParentEnhancedMenuItem} from '~/lib/utils';
import {Link} from './Link';
import {
  CheckCircleIcon,
  EnvelopeIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';
import {useFetcher} from '@remix-run/react';
import Input from './MyInput';
import ButtonCircle from './Button/ButtonCircle';
import {ArrowRightIcon} from '@heroicons/react/24/solid';
import SocialsList from './SocialsList';
import {type AddSubscriberMutation} from 'storefrontapi.generated';
import {useRootLoaderData} from '~/lib/root-data';
import {FooterMenuDataWrap, HeaderMenuDataWrap} from './Layout';

interface FooterProps {}

const Footer: React.FC<FooterProps> = () => {
  const {layout} = useRootLoaderData();
  const shop = layout?.shop || {};

  const renderWidgetMenu = (menu: ParentEnhancedMenuItem, index: number) => {
    return (
      <div key={index + menu.id} className="text-sm">
        <h2 className="font-semibold  text-white">
          {menu.title}
        </h2>
        <ul className="mt-5 space-y-4">
          {menu.items?.map((item: ChildEnhancedMenuItem, i) => (
            <li
              key={`${i + item.id}`}
              className="text-neutral-600 hover:text-black "
            >
              {item.to.startsWith('http') ? (
                <a
                  href={item.to}
                  target={item.target}
                  rel="noopener noreferrer"
                >
                  {item.title}
                </a>
              ) : (
                <Link to={item.to} target={item.target} prefetch="intent">
                  {item.title}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <footer
      className="bg-white border-t border-neutral-900/10"
      aria-labelledby="footer-heading"
    >
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>

      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8 lg:pt-10  pb-24 text-center bg-logo-green">

        <div className="pt-8">
          <div className="flex flex-wrap gap-x-6 gap-y-3 justify-center">
            <HeaderMenuDataWrap>
              {({headerData: {socials}}) => (
                <SocialsList
                  data={socials.edges.map((edge) => {
                    const node = edge.node;
                    return {
                      name: node.title?.value || '',
                      icon: node.icon?.reference?.image?.url || '',
                      href: node.link?.value || '',
                    };
                  })}
                  itemClass="block opacity-90 hover:opacity-100"
                  className="!gap-5"
                />
              )}
            </HeaderMenuDataWrap>
          </div>
          <div className="mt-16 flex flex-wrap justify-center gap-5">
              <FooterMenuDataWrap>
                {({footerMenu}) => footerMenu?.items?.map(renderWidgetMenu)}
              </FooterMenuDataWrap>
          </div>
          <p className="mt-8 text-[13px] leading-5 text-white md:order-1 md:mt-0">
            © {new Date().getFullYear()} {shop.name}, LLC. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export function WidgetAddSubscriberForm() {
  const fetcher = useFetcher();
  const {customerCreate} = (fetcher.data || {}) as AddSubscriberMutation;

  return (
    <div
      className={`nc-WidgetAddSubscriberForm overflow-hidden rounded-3xl border border-neutral-100 dark:border-neutral-700`}
    >
      <div
        className={`nc-WidgetHeading1 flex items-center justify-between p-4 border-b border-neutral-100 `}
      >
        <h2 className="flex flex-wrap gap-3 text-base font-semibold text-neutral-900 dark:text-neutral-100">
          <EnvelopeIcon className="w-6 h-6" />
          <span>Stay up to date</span>
        </h2>
      </div>

      <div className="p-4 xl:p-5">
        <span className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
          Subscribe to our newsletter to get the latest updates and special
          offers.
        </span>
        <div className="mt-4">
          <fetcher.Form
            className="relative"
            method="post"
            action="/?index"
            preventScrollReset
          >
            <Input
              required
              aria-required
              placeholder="Enter your email address"
              type="email"
              className="rounded-2xl"
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

          {customerCreate?.customerUserErrors[0]?.message && (
            <div className="text-red-400 flex gap-2 mt-1 ml-1">
              <InformationCircleIcon className="w-4 h-4" />
              <i className="text-xs">
                {customerCreate?.customerUserErrors[0]?.message}
              </i>
            </div>
          )}
          {!customerCreate?.customerUserErrors.length &&
            customerCreate?.customer?.id && (
              <div className="text-green-500 flex gap-2 mt-1 ml-1">
                <CheckCircleIcon className="w-4 h-4" />
                <i className="text-xs">Thank you for subscribing!</i>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}

export default Footer;
