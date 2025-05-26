import React, {type FC} from 'react';
import { IconCaret } from '../Icon';

export interface NextPrevProps {
  className?: string;
  currentPage?: number;
  totalPage?: number;
  btnClassName?: string;
  stroke?: string;
  onClickNext?: () => void;
  onClickPrev?: () => void;
  onlyNext?: boolean;
  onlyPrev?: boolean;
}

const NextPrev: FC<NextPrevProps> = ({
  className = '',
  onClickNext = () => {},
  onClickPrev = () => {},
  btnClassName = 'w-20 h-20',
  stroke = 'white',
  onlyNext = false,
  onlyPrev = false,
}) => {
  const [focus, setFocus] = React.useState<'left' | 'right'>('right');
  return (
    <div
      className={`nc-NextPrev relative flex items-center justify-between text-slate-500 dark:text-slate-400 ${className}`}
    >
      {!onlyNext && (
        <button
          className={`${btnClassName} ${
            !onlyPrev ? 'me-2' : ''
          } border-white rounded-full flex items-center justify-center`}
          onClick={(e) => {
            e.preventDefault();
            onClickPrev();
          }}
          title="Prev"
          data-glide-dir="<"
          onMouseEnter={() => setFocus('left')}
        >
        <IconCaret 
          stroke={stroke}
          direction="right"
          className='!size-20'
        />
        </button>
      )}
      {!onlyPrev && (
        <button
          className={`${btnClassName}  border-white rounded-full flex items-center justify-center`}
          onClick={(e) => {
            e.preventDefault();
            onClickNext();
          }}
          title="Next"
          data-glide-dir=">"
          onMouseEnter={() => setFocus('right')}
        >
          <IconCaret 
            stroke={stroke}
            direction="left"
            className='!size-20'
          />
        </button>
      )}
    </div>
  );
};

export default NextPrev;
