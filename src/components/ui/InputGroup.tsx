import React from 'react';
import { LucideIcon } from 'lucide-react';

interface InputGroupProps extends React.InputHTMLAttributes<HTMLInputElement> {
  Icon: LucideIcon;
  label: string;
}

const InputGroup: React.FC<InputGroupProps> = ({ Icon, label, ...props }) => (
  <div className="relative group">
    <label htmlFor={props.id || props.name} className="sr-only">
      {label}
    </label>
    <div className="flex items-center bg-surface rounded-xl border border-border transition-all duration-300 group-focus-within:border-primary group-focus-within:ring-1 group-focus-within:ring-primary/50">
      <div className="p-3 text-textSecondary group-focus-within:text-primary">
        <Icon className="w-5 h-5" />
      </div>
      <input
        {...props}
        id={props.id || props.name}
        placeholder={label}
        className="w-full bg-transparent text-text py-3 pr-4 focus:outline-none placeholder:text-textSecondary/70"
      />
    </div>
  </div>
);

export default InputGroup;
