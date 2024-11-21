import React, { useState } from 'react';
import { IconBbq, IconChicken, IconPepper, IconSpicy } from './Icon';
import NavItem from './NavItem';
import Nav from './Nav';
import { Link } from './Link';


const ProductFilterHiddenScrollBar = ({categoryData, collectionHandle}: any) => {
  return (
      <Nav
        className="p-1 productFilterHiddenScrollBar px-2 overflow-x-auto hiddenScrollbar w-full justify-start md:w-auto md:rounded-full"
        containerClassName="mb-12 lg:mb-14 relative flex w-full text-sm md:text-base md:justify-center"
      >
        {categoryData.map((item, index) => (
            <Link
            key={index}
            to={`/collections/${item.value}`}
            prefetch="intent"
          >
            <NavItem
              isActive={collectionHandle === item.value}
            >
              <div className="flex items-center justify-center space-x-1.5 sm:space-x-2.5 text-xs sm:text-sm">
                {item.icon && (
                  <item.icon size={26} />
                )}
                <span>{item.label}</span>
              </div>
            </NavItem>
          </Link> 
        ))}
      </Nav>
  );
};






export default ProductFilterHiddenScrollBar;
