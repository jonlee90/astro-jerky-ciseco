import { motion } from 'framer-motion';
import React, { ReactNode } from 'react';

interface ButtonAnimationProps {
  onClick: () => void;
  children: ReactNode;
  className?: string;
}

export const ButtonAnimation: React.FC<ButtonAnimationProps> = ({ onClick, children, className }) => {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95, opacity: 0.6 }}
      className={className}
    >
      {children}
    </motion.button>
  );
};
