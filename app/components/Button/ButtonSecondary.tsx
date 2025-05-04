import Button, {type ButtonProps} from './Button';

export interface ButtonSecondaryProps extends ButtonProps {}

const ButtonSecondary: React.FC<ButtonSecondaryProps> = ({
  className = ' border border-slate-300 dark:border-slate-700 ',
  bgColor = 'bg-primary-700 hover:bg-primary-800',
  ...args
}) => {
  return (
    <Button
      className={`${bgColor} text-white ${className}`}
      {...args}
    />
  );
};

export default ButtonSecondary;
