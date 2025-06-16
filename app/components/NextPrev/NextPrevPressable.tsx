import { useState } from 'react';
import {type FC} from 'react';
import { IconCaret } from '../Icon';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { ButtonPressable } from '../Button/ButtonPressable';

export interface NextPrevPressableProps {
  className?: string;
  currentPage?: number;
  totalPage?: number;
  btnClassName?: string;
  stroke?: string;
  onClickNext?: () => void;
  onClickPrev?: () => void;
  onlyNext?: boolean;
  onlyPrev?: boolean;
  activeIndex?: number;
  totalItems?: number;
}

const NextPrevPressable: FC<NextPrevPressableProps> = ({
  className = '',
  onClickNext = () => {},
  onClickPrev = () => {},
  btnClassName = 'size-14 md:size-16 flex items-center justify-center',
  stroke = 'white',
  onlyNext = false,
  onlyPrev = false,
  activeIndex = 0,
  totalItems = 4, // Default to 4 if not provided
}) => {
  const [focus, setFocus] = useState<'left' | 'right'>('right');
  return (
    <div
      className={`nc-NextPrev relative px-2 flex items-center justify-between text-slate-500 dark:text-slate-400 ${className}`}
    >
      {!onlyNext && (
        <ButtonPressable
          className= {clsx(
                      btnClassName,
                      'border-black border rounded-full bg-black duration-50',
                      activeIndex === 0 && ' !bg-white',
                    )}
          bgColor='white'
          size='size-14 md:size-16'
          disabled={activeIndex === 0}
          onClick={() => {
            onClickPrev();
          }}
        >
          <IconCaret 
            stroke={stroke}
            direction="right"
            className='!size-14 md:!size-16'
          />
        </ButtonPressable>
        
      )}
      {!onlyPrev && (
        <ButtonPressable
            className= {clsx(
                          btnClassName,
                          'border-black border rounded-full size-14 md:size-16 bg-black duration-50',
                          (activeIndex + 1) === totalItems && ' !bg-white',
                        )}
            bgColor='white'
            size='size-14 md:size-16'
            disabled={(activeIndex + 1) === totalItems}
            onClick={() => {
              onClickNext();
            }}
          >
        <IconCaret 
          stroke={stroke}
          direction="left"
          className='!size-14 md:!size-16'
        />
        </ButtonPressable>
      )}
    </div>
  );
};

export default NextPrevPressable;