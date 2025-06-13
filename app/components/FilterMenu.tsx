import { Popover, Transition } from "@headlessui/react";
import Radio from './Radio';
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { useSearchParams, useLocation, useNavigate } from "@remix-run/react";
import { ProductFilter } from "@shopify/hydrogen/storefront-api-types";
import clsx from "clsx";
import {Fragment} from 'react';
import { I18nLocale } from "~/lib/type";
import { parseAsCurrency } from "~/lib/utils";
import { IconSpicy, IconBbq, IconChicken, IconPepper } from "./Icon";
import { MySortIcon } from "./Icons/MySortIcon";
import { useState } from "react";
import { SwitchTab } from "./Tabs";

const categoryData = [
  {
    label: "All",
    value: "all"
  },
  {
    label: "Spicy",
    value: "hot-spicy",
    icon: IconSpicy
  },
  {
    label: "BBQ",
    value: "bbq",
    icon: IconBbq
  },
  {
    label: "Chicken",
    value: "chicken",
    icon: IconChicken
  },
  {
    label: "Peppered",
    value: "peppered",
    icon: IconPepper
  }
];
export function FilterMenu({onTabChange,isSmall, onToggle}: any) {
  const [activeItem, setActiveItem] = useState(categoryData?.find((item) => item.value == 'all'));
 
  return (
    <div className="flex justify-between flex-1">
      <div className="flex flex-1 lg:gap-x-4">
        <SwitchTab isSmall={isSmall} onToggle={(val: string) => onToggle(val)}  className='justify-self-end'/>
      </div>

      <div className="flex">
        <Popover className="relative flex-shrink-0">
          {({open, close}) => (
            <>
              <Popover.Button
                className={clsx(
                  `flex gap-2 flex-shrink-0 items-center justify-center ps-4 pe-3.5 py-2 text-base border rounded-full focus:outline-none select-none`,
                  activeItem?.value || open
                    ? 'border-primary-600 bg-primary-50 text-primary-900'
                    : 'border-neutral-300 text-neutral-700 hover:border-neutral-500',
                )}
              >

                <span className="flex-shrink-0">
                  {(activeItem || categoryData[0]).label || 'All Jerky'}
                </span>
                
                {activeItem?.icon ? 
                    <activeItem.icon size={26} />
                    :
                    <MySortIcon />}
                <ChevronDownIcon className="w-4 h-4 ml-3 flex-shrink-0 hidden sm:block" />
              </Popover.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <Popover.Panel className="absolute z-40 w-screen px-4 mt-3 right-0 sm:px-0 max-w-60">
                  <div className="overflow-hidden rounded-2xl shadow-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700">
                    <div className="relative flex flex-col px-5 py-6 space-y-5">
                      {categoryData.map(({label, value, icon: Icon}, key) => (
                        <div 
                            className="flex flex-row gap-2"
                            key={key}
                          >
                          <Radio
                            id={value}
                            name={'rdo-sort-order'}
                            label={label}
                            defaultChecked={activeItem?.value === value}
                            onChange={(value) => {
                            //  const newL = getSortLink(item.value, params, location);
                            //  navigate(newL, {preventScrollReset: true});
                              onTabChange(value);
                              setActiveItem(categoryData?.find((item) => item.value === value))
                              close();
                            }}
                          />
                          {Icon && <Icon size={26} />}
                        </div>
                      ))}
                    </div>
                    <div className="p-5 bg-neutral-50 dark:bg-neutral-900 dark:border-t dark:border-neutral-800 flex items-center justify-between"></div>
                  </div>
                </Popover.Panel>
              </Transition>
            </>
          )}
        </Popover>
      </div>
    </div>
  );
}
