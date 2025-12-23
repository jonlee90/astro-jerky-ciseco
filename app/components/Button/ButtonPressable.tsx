import { motion } from 'framer-motion';
import { Link } from '../Link';

export interface ButtonPressableProps {
  children: React.ReactNode;
  onClick?: () => void;
  bgColor?: 'black' | 'white';
  className?: string;
  buttonClass?: string;
  disabled?: boolean;
  size?: string;
  href?: string;
  type?: 'button' | 'submit';
}

export const ButtonPressable = ({
  children,
  onClick = () => {},
  bgColor = 'black',
  className = '',
  buttonClass = '',
  disabled = false,
  size = 'size-8',
  href = '',
  type = 'button'
}: ButtonPressableProps) => {
  const bgClass =
    bgColor === 'white'
      ? 'bg-white hover:bg-neutral-200 border border-black'
      : 'bg-neutral-900 hover:bg-neutral-700 border border-black';

  if (href) {
    return (
      <Link
        to={href}
        className='block'
        aria-label={`Click to navigate to ${href}`}
      >
        <motion.div
          className={`rounded-full ${size} ${className}`}
        >
          <motion.button
            type={type}
            whileTap={disabled ? { x: 0, y: 0 } : { x: 0, y: 0 }}
            animate={disabled ? { x: 0, y: 0 } : { x: -3, y: -3 }}
            onClick={onClick}
            disabled={disabled}
            className={`rounded-full text-center ${size} ${buttonClass} ${bgClass} ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            {children}
          </motion.button>
        </motion.div>
      </Link>
    );
  }

  return (
    <motion.div
      className={`rounded-full ${size} ${className}`}
    >
      <motion.button
        type={type}
        whileTap={disabled ? { x: 0, y: 0 } : { x: 0, y: 0 }}
        animate={disabled ? { x: 0, y: 0 } : { x: -3, y: -3 }}
        onClick={onClick}
        disabled={disabled}
        className={`rounded-full text-center ${size} ${buttonClass} ${bgClass} ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
      >
        {children}
      </motion.button>
    </motion.div>
  );
};