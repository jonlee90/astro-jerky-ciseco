// ... existing imports ...
import { Link } from "../Link";
import { ButtonPressable } from "./ButtonPressable";

export const ButtonPressableLink = ({ 
  href,
  children,
  onClick,
  bgColor = 'black',
  className = '',
  disabled= false,
  size = 'size-8'
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => any;
  bgColor?: 'black' | 'white';
  className?: string;
  disabled?: boolean;
  size?: string;
}) => (
  <Link
    to={href}
    aria-label={`Navigate to ${href}`}
  >
    <ButtonPressable 
      children={children}
      onClick={onClick}
      bgColor={bgColor}
      className={className}
      disabled={disabled}
      size={size}
    />
  </Link>
);