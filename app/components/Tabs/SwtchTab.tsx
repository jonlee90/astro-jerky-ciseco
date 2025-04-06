import React from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

interface SwitchTabProps {
  isSmall: boolean;
  onToggle: (value: 'big' | 'small') => void;
  className?: string;
  bgColor?: string;
  width?: string;
}

export function SwitchTab({
  isSmall,
  onToggle,
  className = '',
  bgColor = 'bg-logo-red',
  width = 'w-20',
}: SwitchTabProps) {
  const buttonStyle = 'py-1 items-center rounded-full disabled:opacity-50 disabled:pointer-events-none';

  return (
    <div className={`toggle-switch relative rounded-full w-40 grid-cols-2 text-base ${className}`}>
      <div className="absolute inset-0 flex">
        <motion.div
          className={clsx(bgColor, 'absolute top-0 bottom-0 rounded-full  w-2/4')}
          animate={{ x: isSmall ? '100%' : '0%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        />
      </div>
      <button
        type="button"
        className={clsx(buttonStyle, !isSmall ? 'text-white' : '', width, 'relative z-10')}
        onClick={() => onToggle('big')}
      >
        Big
      </button>
      <button
        type="button"
        className={clsx(buttonStyle, isSmall ? 'text-white' : '', width, 'relative z-10')}
        onClick={() => onToggle('small')}
      >
        Small
      </button>
    </div>
  );
}
