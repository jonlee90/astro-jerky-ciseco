import React, { useState } from 'react';
import { IconClose, IconXMark } from './Icon';

interface AnnouncementBarProps {
  content: string[];
}

export function AnnouncementBar({ content = [] }: AnnouncementBarProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null; // Hide the component if dismissed
  return (
    <div
      role="region"
      aria-label="Announcement Bar"
      className="flex items-center header-shadow overflow-hidden bg-yellow-400 text-black h-12 sticky z-[96] top-0"
    >
      <div className="flex whitespace-nowrap animate-marqueeLeft">
        {content.map((message, index) => (
          <span key={index} className="px-10 font-bold uppercase text-sm">
            {message}
          </span>
        ))}
        {/* Duplicate messages for seamless looping */}
        {content.map((message, index) => (
          <span
            key={`duplicate-${index}`}
            className="px-10 font-bold uppercase text-sm"
            aria-hidden="true"
          >
            {message}
          </span>
        ))}
      </div>
      {/* Close Button */}
      <button
        onClick={() => setIsVisible(false)} // Hide the bar on click
        className="absolute right-2 text-white bg-black text-center hover:text-gray-600 focus:outline-none rounded-full p-1"
        aria-label="Close Announcement Bar"
      >
        <IconClose />
      </button>
    </div>
  );
}
