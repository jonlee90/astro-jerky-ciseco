import clsx from 'clsx';
import { motion } from 'framer-motion';
import React from 'react';

interface SwitchTabProps {
  isSmall: boolean;
  onToggle: (size: 'big' | 'small') => void;
  className?: string;
  bgColor?: string;
  width?: string;
}

export function SwitchTab({
  isSmall,
  onToggle,
  className,
  bgColor = 'bg-neutral-900',
  width = 'w-24',
}: SwitchTabProps) {
  const buttonStyle = 'py-1 items-center rounded-full disabled:opacity-50 disabled:pointer-events-none';

  return (
    <div 
      aria-label='Toggle button for Big bags and Small Bags'
      className={`toggle-switch relative rounded-full w-48 grid-cols-2 text-base ${className}`}>
      <div className="absolute inset-0 flex">
        <motion.div
          className={clsx(bgColor, 'absolute top-0 bottom-0 rounded-full')}
          style={{ width: '50%' }}
          animate={{ x: isSmall ? '100%' : '0%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        />
      </div>
      <button
        type="button"
        className={clsx(buttonStyle, !isSmall ? 'text-white' : '', width, 'relative z-10')}
        onClick={() => onToggle('big')}
      >
        Big bags
      </button>
      <button
        type="button"
        className={clsx(buttonStyle, isSmall ? 'text-white' : '', width, 'relative z-10')}
        onClick={() => onToggle('small')}
      >
        Small bags
      </button>
    </div>
  );
}

interface FilterTabProps {
  data: { label: string; value: string }[];
  onTabChange: (value: string) => void;
  activeTab: string;
  className?: string;
  bgColor?: string;
}

export function FilterTab({
  data,
  onTabChange,
  activeTab,
  className,
  bgColor = 'bg-logo-yellow'
}: FilterTabProps) {
  const buttonStyle = 'h-9 items-center text-center rounded-lg disabled:opacity-50 disabled:pointer-events-none w-full';

  return (
    <div className={`toggle-switch max-w-lg rounded-lg text-base ${className}`}>
      {data.map(({ label, value }, i) => (
        <button
          type="button"
          key={i}
          className={clsx(buttonStyle, value === activeTab ? `${bgColor} text-white` : '')}
          onClick={() => onTabChange(value)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
