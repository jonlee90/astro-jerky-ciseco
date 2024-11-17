import React from 'react';
import {XMarkIcon} from '@heroicons/react/24/solid';
import twFocusClass from '@/utils/twFocusClass';
import {motion} from'framer-motion';

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
    <motion.button
      className={
        `w-8 h-8 flex items-center justify-center rounded-full text-neutral-100 bg-neutral-900  hover:bg-neutral-700  ${className} ` +
        twFocusClass()
      }
      
      whileTap={{ x: 0, y: 0 }}
      animate={{ x: -3, y: -3 }}
      onClick={onClick}
    >
      <span className="sr-only">Close</span>
      <XMarkIcon className={IconclassName} />
    </motion.button>
  );
};

export default ButtonClose;
