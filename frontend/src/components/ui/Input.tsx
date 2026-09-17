import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  icon,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      {label && <label className="block text-xs font-semibold text-[#111827] uppercase tracking-wider mb-2">{label}</label>}
      <div className="relative flex items-center">
        {icon && <span className="absolute left-3.5 text-[#6B7280]">{icon}</span>}
        <input
          className={`w-full bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl py-2.5 ${
            icon ? 'pl-10' : 'pl-4'
          } pr-4 text-sm text-[#111827] placeholder-[#6B7280] focus:outline-none focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#0EA5E9]/20 transition-all ${
            error ? 'border-red-500' : ''
          } ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-500 mt-1.5">{error}</p>}
    </div>
  );
};
