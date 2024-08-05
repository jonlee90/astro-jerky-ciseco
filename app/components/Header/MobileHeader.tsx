import React, { useState, useRef, useEffect } from 'react';
import { Link } from '../Link';
import { motion } from 'framer-motion';
import useWindowScroll from './useWindowScroll';
import Logo from '../Logo';



export function MobileHeader() {
  const [isVisible, setIsVisible] = useState(true);
  const { y } = useWindowScroll();
  const prevScrollY = useRef(0);

  useEffect(() => {
    if (y > prevScrollY.current && y > 150) {
      setIsVisible(false); // Scrolling down
    } else {
      setIsVisible(true); // Scrolling up
    }
    prevScrollY.current = y;
  }, [y]);

  return (
    <motion.header
      role="banner"
      className={`bg-contrast text-primary h-full shadow-md flex md:hidden items-center sticky backdrop-blur-lg z-40 top-0 justify-center w-full leading-none px-4 md:px-8`}
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : -100 }}
      transition={{ duration: 0.3 }}
    >
      <div className='w-full py-3'>
        <img src={'/images/header-text-1-orange.png'} alt="ASTRO" />
      </div>
      <div className="flex items-center justify-center w-full gap-4">
        <Logo className='w-16 ' />
      </div>

      <div className='w-full py-3'>
        <img src={'/images/header-text-2-orange.png'} alt="JERKY" />
      </div>
    </motion.header>
  );
}
