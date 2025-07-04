import React, { useEffect, useRef, useState } from 'react';
import { IconHoney, IconChicken, IconCow, IconPepper, IconSpicy, IconStar } from './Icon';
import NavItem from './NavItem';
import Nav from './Nav';
import { Link } from './Link';
import clsx from 'clsx';


const ProductFilterHiddenScrollBar = ({collectionHandle, totalProducts, filterRef}: any) => {
  const categoryData = [
    {
      label: "All",
      value: "best-beef-jerky-flavors",
    },
    {
      label: "Spicy",
      value: "hot-spicy-beef-jerky",
      icon: IconSpicy,
    },
    {
      label: "BBQ",
      value: "bbq-beef-jerky",
      icon: IconHoney,
    },
    {
      label: "Chicken",
      value: "chicken-jerky",
      icon: IconChicken,
    },
    {
      label: "Peppered",
      value: "peppered-beef-jerky",
      icon: IconPepper,
    },
    {
      label: "Original",
      value: "original-beef-jerky",
      icon: IconCow,
    }
  ];
  const [isSticky, setIsSticky] = useState(false); // State to manage sticky behavior

  useEffect(() => {
  let ticking = false;
  const handleScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const filterElement = filterRef.current;
        if (filterElement) {
          const filterPosition = filterElement.getBoundingClientRect().top;
          // Add hysteresis: only set sticky if below 57, only unset if above 65
          if (!isSticky && filterPosition <= 57) {
            setIsSticky(true);
          } else if (isSticky && filterPosition > 65) {
            setIsSticky(false);
          }
        }
        ticking = false;
      });
      ticking = true;
    }
  };
  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, [isSticky, filterRef]);
  
  return (
      <section
        id="product-filter"
        aria-labelledby="product-filter-section"
        role='region'
        ref={filterRef}
        className={clsx(isSticky ? "sticky-filter md:relative" : "", 'lg:mt-14 md:z-50')}
      >
        <h2 id="product-filter-section" className="sr-only">Product Filters</h2>
        <Nav
          className="p-1 productFilterHiddenScrollBar px-2 overflow-x-auto hiddenScrollbar w-full justify-start md:w-auto md:rounded-full"
          containerClassName="mb-12 lg:mb-14 relative flex w-full text-base md:text-lg md:justify-center"
        >
          {categoryData.map((item) => (
              <NavItem
                key={item.value}
                isActive={collectionHandle === item.value}
              >
                <Link
                    to={`/${item.value}#product-filter`}
                    prefetch="intent"
                  >
                  <div className="flex items-center justify-center space-x-1.5 sm:space-x-2.5 text-sm sm:text-base">
                    {item.icon ? 
                      <item.icon size={26} />
                    :
                      <div></div>
                    }
                    <span>{item.label} {collectionHandle === item.value && (`(${totalProducts})`)}</span>
                  </div>
                </Link> 
              </NavItem>
          ))}
        </Nav>
      </section>
  );
};






export default ProductFilterHiddenScrollBar;
