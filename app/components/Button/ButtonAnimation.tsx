import { motion } from 'framer-motion';
import React, { ReactNode, useEffect, useState } from 'react';

interface ButtonAnimationProps {
  onClick: () => void;
  children: ReactNode;
  className?: string;
}

export const ButtonAnimation: React.FC<ButtonAnimationProps> = ({ onClick, children, className }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    // Fallback rendering during SSR
    return (
      <button onClick={onClick} className={className}>
        {children}
      </button>
    );
  }

  // Client-side rendering with animations
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
