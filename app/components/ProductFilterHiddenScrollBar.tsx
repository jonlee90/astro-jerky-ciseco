import React, { useEffect, useRef, useState } from 'react';
import { IconBbq, IconChicken, IconCow, IconPepper, IconSpicy, IconStar } from './Icon';
import NavItem from './NavItem';
import Nav from './Nav';
import { Link } from './Link';
import clsx from 'clsx';


const ProductFilterHiddenScrollBar = ({collectionHandle, totalProducts}: any) => {
  const categoryData = [
    {
      label: "All Flavors",
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
      icon: IconBbq,
    },
    {
      label: "Chicken",
      value: "chicken-jerky",
      icon: IconChicken,
    },
    {
      label: "Pepppered",
      value: "peppered-beef-jerky",
      icon: IconPepper,
    },
    {
      label: "Original",
      value: "original-beef-jerky",
      icon: IconCow,
    }
  ];
  const filterRef = useRef<HTMLDivElement>(null); // Ref for the filter component
  const [isSticky, setIsSticky] = useState(false); // State to manage sticky behavior

   // Function to handle scroll event and check when the filter should stick
   const handleScroll = () => {
    const filterElement = filterRef.current;
    if (filterElement) {
      const filterPosition = filterElement.getBoundingClientRect().top;
      const shouldStick = filterPosition <= 10;

      // Only update isSticky when there's an actual change
      if (shouldStick !== isSticky) {
        setIsSticky(shouldStick);
      }
    }
  };

  // Add scroll event listener
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll); // Cleanup
  }, [isSticky]);
  
  return (
      <section
        aria-labelledby="product-filter-section"
        role='region'
        ref={filterRef}
        className={clsx(isSticky ? "sticky-filter md:relative" : "", 'mt-8 lg:mt-14 md:z-50')}
      >
        <h2 id="product-filter-section" className="sr-only">Product Filters</h2>
        <Nav
          className="p-1 productFilterHiddenScrollBar px-2 overflow-x-auto hiddenScrollbar w-full justify-start md:w-auto md:rounded-full"
          containerClassName="mb-12 lg:mb-14 relative flex w-full text-sm md:text-base md:justify-center"
        >
          {categoryData.map((item) => (
              <NavItem
                key={item.value}
                isActive={collectionHandle === item.value}
              >
                <Link
                    to={`/${item.value}`}
                    prefetch="intent"
                  >
                  <div className="flex items-center justify-center space-x-1.5 sm:space-x-2.5 text-xs sm:text-sm">
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
