import React, {type FC} from 'react';

export interface NavProps {
  containerClassName?: string;
  className?: string;
  children?: React.ReactNode;
  opacity?: number;
}

const Nav: FC<NavProps> = ({
  containerClassName = '',
  className = '',
  children,
  opacity = 1
}) => {
  return (
    <nav style={{ opacity }} className={`nc-Nav ${containerClassName}`} data-nc-id="Nav">
      <ul className={`flex  ${className}`}>{children}</ul>
    </nav>
  );
};

export default Nav;
