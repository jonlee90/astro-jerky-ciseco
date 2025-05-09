import React, {type FC} from 'react';

export interface LabelProps {
  className?: string;
  children?: React.ReactNode;
}

const Label: FC<LabelProps> = ({className = '', children}) => {
  return (
    <label
      className={`nc-Label text-lg font-medium text-neutral-900 dark:text-neutral-200 ${className}`}
      data-nc-id="Label"
    >
      {children}
    </label>
  );
};

export default Label;
