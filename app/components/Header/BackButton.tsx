import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from '@remix-run/react';
import { IconCaret } from '../Icon';

interface BackButtonProps {
  isVisible: boolean;
  className?: string; // Optional additional class for customization
}

const BackButton: React.FC<BackButtonProps> = ({
  isVisible = true,
  className = '',
}) => {
  const navigate = useNavigate();

  const { pathname, state } = useLocation();
  const navLink = pathname.includes('/bundle') && !!state ? '/bundle' : -1;
  // Determine dynamic class based on navLink and pathname
  const buttonPosition = navLink === '/bundle'
    ? 'bottom-5'
    : pathname.includes('/beef-jerky/')
    ? 'top-5'
    : '';

  return (
    <AnimatePresence>
      {!isVisible && (
        <motion.button
        onClick={() => navigate(navLink)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95, opacity: 0.6 }}
        initial={{ x: '-60px' }}
        animate={{ x: '0px' }}
        exit={{ opacity: 0, x: '-60px' }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className={`pdp-nav-button transform left-5 ${className} ${buttonPosition}`}
        >
        <IconCaret
          direction="right"
          className="!size-14 z-50 rounded-full bg-black text-white font-bold p-2"
        />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default BackButton;
