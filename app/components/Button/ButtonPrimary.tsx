import React from 'react';
import Button, {type ButtonProps} from './Button';

export interface ButtonPrimaryProps extends ButtonProps {}

const ButtonPrimary: React.FC<ButtonPrimaryProps> = ({
  className = '',
  sizeClass = 'py-3 px-4 lg:py-3.5 lg:px-8',
  ...args
}) => {
  return (
    <Button
      className={`bg-primary-600 text-slate-50 hover:bg-primary-700 disabled:bg-opacity-90 ${className}`}
      sizeClass={sizeClass}
      {...args}
    />
  );
};

export default ButtonPrimary;
