import React, {type HTMLAttributes, type ReactNode} from 'react';
import NextPrev from '../NextPrev/NextPrev';

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  fontClass?: string;
  rightDescText?: ReactNode;
  rightPopoverOptions?: typeof solutions;
  desc?: ReactNode;
  hasNextPrev?: boolean;
  isCenter?: boolean;
  onClickPrev?: () => void;
  onClickNext?: () => void;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

const solutions = [
  {
    name: 'last 24 hours',
    href: '##',
  },
  {
    name: 'last 7 days',
    href: '##',
  },
  {
    name: 'last 30 days',
    href: '##',
  },
];

const Heading: React.FC<HeadingProps> = ({
  children,
  desc = '',
  className = 'mb-12 lg:mb-14 text-neutral-900 dark:text-neutral-50',
  isCenter = false,
  hasNextPrev = false,
  fontClass = 'text-display font-semibold py-2 text-left',
  rightDescText,
  rightPopoverOptions = solutions,
  onClickNext,
  onClickPrev,
  as: HeadingTag = 'h1',
  ...args
}) => {
  return (
    <div
      className={`nc-Section-Heading relative flex flex-row sm:items-end justify-between items-center ${className}`}
    >
      <div
        className={
          isCenter
            ? 'flex flex-col items-center text-center w-full mx-auto'
            : ''
        }
      >
        {rightDescText && (
          <div className="mt-2 md:mt-3 font-semibold block text-base sm:text-lg uppercase font-RobotoSlabRegular">
              {rightDescText}
          </div>
        )}
        <HeadingTag
          className={`${isCenter ? 'justify-center' : ''} ${fontClass}`}
          {...args}
        >
          {children || `Section Heading`}
        </HeadingTag>
        {!!desc && (
          <div className="mt-2 md:mt-3 block text-base sm:text-lg font-RobotoSlabRegular">
            {desc}
          </div>
        )}
      </div>
      {hasNextPrev && !isCenter && (
        <div className="flex justify-end sm:ms-2 flex-shrink-0">
          <NextPrev onClickNext={onClickNext} onClickPrev={onClickPrev} />
        </div>
      )}
    </div>
  );
};

export default Heading;
