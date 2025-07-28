import React, { useState } from 'react';
import { IconClose, IconXMark } from './Icon';
import { ButtonClose } from './Button/ButtonClose';

interface AnnouncementBarProps {
  content: string[];
  setVisible: (visible: boolean) => void;
}

export function AnnouncementBar({ 
  content = [],
  setVisible
 }: AnnouncementBarProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null; // Hide the component if dismissed
  return (
    <div
      role="region"
      aria-label="Announcement Bar"
      className="flex items-center shadow-lightHeader justify-center overflow-hidden bg-logo-green text-white h-10 z-[96] top-0"
    >
      <div className="flex whitespace-nowrap sm-max:animate-marqueeLeft">
        {content.map((message, index) => (
          index === 0 && <span key={index} className="px-10 font-bold uppercase text-sm">
            {message}
          </span>
        ))}
        {/* Loop messages 8 times for seamless looping */}
      {Array.from({ length: 8 })
        .flatMap(() => content)
        .map((message, index) => (
          <span
            key={`loop-${index + 1}`}
            className="px-10 font-bold uppercase text-sm md:hidden"
            aria-hidden="true"
          >
            {message}
          </span>
        ))}
      </div>
      {/* Close Button 
      <ButtonClose 
        onClick={() => {
          setVisible(false);
          setIsVisible(false);
        }}
        className="absolute right-2"
      />*/}
    </div>
  );
}
