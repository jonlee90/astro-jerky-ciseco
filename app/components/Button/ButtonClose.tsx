import React from 'react';
import { IconClose } from '../Icon';
import { ButtonPressable } from './ButtonPressable';

export function ButtonClose({
  onClick,
  className = "absolute right-2 "
}: {
  onClick: () => void;
  className?: string;
}) {
  return (
    <ButtonPressable
      onClick={onClick}
      className={className + ' rounded-full border-black border '}
      aria-label="Close Announcement Bar"
    >
      
      <IconClose className='mx-auto' stroke='white' />
    </ButtonPressable>
  );
}