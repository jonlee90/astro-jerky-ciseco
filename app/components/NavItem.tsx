import React, {type FC, type ReactNode} from 'react';
import twFocusClass from '@/utils/twFocusClass';

export interface NavItemProps {
  className?: string;
  radius?: string;
  onClick?: () => void;
  isActive?: boolean;
  renderX?: ReactNode;
  children?: React.ReactNode;
}

const NavItem: FC<NavItemProps> = ({
  className = 'px-3.5 py-2 text-base sm:px-7 sm:py-3 capitalize',
  radius = 'rounded-full',
  children,
  onClick = () => {},
  isActive = false,
  renderX,
}) => {
  return (
    <li className="nc-NavItem relative h-full">
      {renderX && renderX}
      <button
        className={`block font-medium whitespace-nowrap h-full min-w-11 ${className} ${radius} ${
          isActive
            ? 'bg-primary-600 text-white'
            : 'text-black-600  hover:text-black-900 '
        } ${twFocusClass()}`}
        onClick={() => {
          onClick && onClick();
        }}
      >
        {children}
      </button>
    </li>
  );
};

export default NavItem;
