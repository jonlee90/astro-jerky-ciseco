import React, {type FC} from 'react';

export interface NextPrevDesktopProps {
  btnClassName?: string;
  onClickNext?: () => void;
  onClickPrev?: () => void;
}

const NextPrevDesktop: FC<NextPrevDesktopProps> = ({
  onClickNext = () => {},
  onClickPrev = () => {},
  btnClassName = 'w-24 h-full bg-opacity-95 absolute top-1/2 transform -translate-y-1/2 z-50 hidden md:block',
}) => {

  return (
    <>
        <button
          className={`${btnClassName} cursor-left`}
          onClick={(e) => {
            e.preventDefault();
            onClickPrev();
          }}
          title="Scroll left"
          aria-label="Scroll left"
        >
          <span className="sr-only">Scroll left</span>
        </button>
        <button
          className={`${btnClassName} cursor-right right-0 bg-white`}
          onClick={(e) => {
            e.preventDefault();
            onClickNext();
          }}
          title="Scroll right"
          aria-label="Scroll right"
        >
          <span className="sr-only">Scroll right</span>
        </button>
    </>
  );
};

export default NextPrevDesktop;
