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
  className = 'px-3.5 py-2 text-sm sm:px-7 sm:py-3 capitalize',
  radius = 'rounded-full',
  children,
  onClick = () => {},
  isActive = false,
  renderX,
}) => {
  return (
    <li className="nc-NavItem relative">
      {renderX && renderX}
      <button
        className={`block font-medium whitespace-nowrap ${className} ${radius} ${
          isActive
            ? 'bg-black text-white'
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
