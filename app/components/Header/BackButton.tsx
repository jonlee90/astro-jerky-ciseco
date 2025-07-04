import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from '@remix-run/react';
import { IconCaret } from '../Icon';
import { ButtonPressable } from '../Button/ButtonPressable';

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
  const navLink = pathname.includes('/bundle') && !state ? '/bundle' : -1;
  // Determine dynamic class based on navLink and pathname
  const buttonPosition = navLink === '/bundle'
    ? 'bottom-5'
    : pathname.includes('/beef-jerky/')
    ? 'top-14'
    : '';
  return (
    <AnimatePresence>
      {!isVisible && (
        <motion.div
          className={`border-black border rounded-full size-12 pdp-nav-button ${className}  left-2 ${buttonPosition}`}
        >
        <ButtonPressable
          onClick={() =>
            navLink === -1 ? navigate(-1) : navigate(navLink)
          }
          bgColor="black"
          size="size-12"
        >
          <IconCaret
            direction="right"
            className="!size-12 z-50 rounded-full text-white font-bold p-2"
          />
        </ButtonPressable>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BackButton;
