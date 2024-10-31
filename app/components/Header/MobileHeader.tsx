import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Logo from '../Logo';
import useWindowScroll from './useWindowScroll';

export function MobileHeader() {
  const [isVisible, setIsVisible] = useState(true);
  const { y } = useWindowScroll();
  const prevScrollY = useRef(0);

  useEffect(() => {
    if (y > prevScrollY.current && y > 150 && isVisible) {
      setIsVisible(false); // Scrolling down
    } else if (y <= 150 && !isVisible) {
      setIsVisible(true); // Scrolling up
    }
    prevScrollY.current = y;
  }, [y, isVisible]);

  return (
    <motion.header
      role="banner"
      aria-label="Mobile Header"
      className="bg-contrast text-primary h-16 shadow-md flex md:hidden items-center sticky backdrop-blur-lg z-40 top-0 justify-center w-full leading-none px-4 md:px-8"
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : -100 }}
      transition={{ duration: 0.3 }}
    >
      <a href="#mainContent" className="sr-only focus:not-sr-only">
        Skip to content
      </a>
      
      <div className="py-3 xs:ml-5 sm:!ml-10">
        <picture>
          <img src={'/images/header-text-1-orange.png'} alt="ASTRO" />
        </picture>
      </div>

      <div className="flex items-center justify-center w-full gap-4">
        <Logo className="w-16" aria-hidden="true" />
      </div>

      <div className="py-3 xs:mr-5 sm:!mr-10">
        <picture>
          <img src={'/images/header-text-2-orange.png'} alt="JERKY" />
        </picture>
      </div>
    </motion.header>
  );
}
