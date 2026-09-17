import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'info';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  className = '',
}) => {
  const baseStyles = 'inline-flex items-center gap-1.5 font-medium rounded-full';
  
  const variants = {
    primary: 'bg-[#F0F9FF] text-[#0EA5E9] border border-sky-100',
    secondary: 'bg-[#F8FAFC] text-[#6B7280] border border-[#E5E7EB]',
    success: 'bg-emerald-50 text-[#16A34A] border border-emerald-100',
    warning: 'bg-amber-50 text-amber-600 border border-amber-100',
    info: 'bg-slate-100 text-[#111827] border border-slate-200',
  };

  const sizes = {
    sm: 'text-xs px-2.5 py-0.5',
    md: 'text-xs px-3 py-1',
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}>
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
};
