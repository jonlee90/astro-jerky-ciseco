import React from 'react';
import { motion } from 'framer-motion';

interface ButtonPressableProps {
  children: React.ReactNode;
  onClick?: () => any;
  bgColor?: 'black' | 'white';
  className?: string;
  disable?: boolean;
}

export const ButtonPressable: React.FC<ButtonPressableProps> = ({
  children,
  onClick,
  bgColor = 'black',
  className = '',
  disable = false,
}) => {
  const bgClass =
    bgColor === 'white'
      ? 'bg-white hover:bg-neutral-200 border border-black'
      : 'bg-neutral-900 hover:bg-neutral-700';

  return (
    <motion.div
      className={`rounded-full ${bgClass} ${className} ${disable ? 'cursor-not-allowed opacity-50' : ''}`}
      whileTap={disable ? { x: 0, y: 0 } : { x: 0, y: 0 }}
      animate={disable ? { x: 0, y: 0 } : { x: -3, y: -3 }}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};