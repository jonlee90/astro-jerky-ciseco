import React from 'react';
import {XMarkIcon} from '@heroicons/react/24/solid';
import twFocusClass from '@/utils/twFocusClass';

export interface ButtonCloseProps {
  className?: string;
  IconclassName?: string;
  onClick?: () => void;
}

const ButtonClose: React.FC<ButtonCloseProps> = ({
  className = '',
  IconclassName = 'w-5 h-5',
  onClick = () => {},
}) => {
  return (
    <button
      className={
        `w-8 h-8 flex items-center justify-center rounded-full text-neutral-700  hover:bg-neutral-100  ${className} ` +
        twFocusClass()
      }
      onClick={onClick}
    >
      <span className="sr-only">Close</span>
      <XMarkIcon className={IconclassName} />
    </button>
  );
};

export default ButtonClose;
