import Button, {type ButtonProps} from './Button';

export interface ButtonSecondaryProps extends ButtonProps {}

const ButtonSecondary: React.FC<ButtonSecondaryProps> = ({
  className = ' border border-slate-300 dark:border-slate-700 ',
  ...args
}) => {
  return (
    <Button
      className={`bg-primary-700 hover:bg-primary-800 text-white ${className}`}
      {...args}
    />
  );
};

export default ButtonSecondary;
