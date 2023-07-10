import * as React from 'react';

export interface IButtonProps {
  onClick?: any,
  className?: string,
  children?: React.ReactNode,
}

const Button: React.FC<IButtonProps> = ({ onClick, className, children, ...props }) => {

  return (
    <button
      className={className}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;