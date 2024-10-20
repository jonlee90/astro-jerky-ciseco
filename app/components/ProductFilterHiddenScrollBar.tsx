import React, { useState } from 'react';
import { IconBbq, IconChicken, IconPepper, IconSpicy } from './Icon';
import NavItem from './NavItem';
import Nav from './Nav';


const ProductFilterHiddenScrollBar = ({onTabChange, filterCategory}: any) => {
  const [tabActive, setTabActive] = useState<number>(0);

  return (
      <Nav
        className="p-1 productFilterHiddenScrollBar overflow-x-auto hiddenScrollbar w-full justify-evenly md:w-auto md:rounded-full"
        containerClassName="mb-12 lg:mb-14 relative flex justify-center w-full text-sm md:text-base"
      >
        {filterCategory.map((item, index) => (
          <NavItem
            key={index}
            isActive={tabActive === index}
            onClick={() => { 
              setTabActive(index);
              onTabChange(item.value)
            }}
          >
            <div className="flex items-center justify-center space-x-1.5 sm:space-x-2.5 text-xs sm:text-sm">
              {item.icon && (
                <item.icon size={26} />
              )}
              <span>{item.label}</span>
            </div>
          </NavItem>
        ))}
      </Nav>
  );
};






export default ProductFilterHiddenScrollBar;
