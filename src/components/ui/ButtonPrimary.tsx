import React from 'react';
import { ArrowRight } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  isLoading?: boolean;
}

const ButtonPrimary: React.FC<ButtonProps> = ({ children, icon, isLoading, ...props }) => (
  <button
    {...props}
    disabled={props.disabled || isLoading}
    className={`
      w-full py-3 px-6 text-lg font-semibold rounded-xl transition-all duration-300
      bg-primary text-white shadow-lg shadow-primary/30
      hover:bg-primary/90 hover:shadow-primary/50
      focus:outline-none focus:ring-4 focus:ring-primary/50
      disabled:bg-surface disabled:text-textSecondary disabled:shadow-none
      flex items-center justify-center space-x-2
      ${props.className || ''}
    `}
  >
    {isLoading ? (
      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    ) : (
      <>
        <span>{children}</span>
        {icon || <ArrowRight className="w-5 h-5 ml-1" />}
      </>
    )}
  </button>
);

export default ButtonPrimary;
