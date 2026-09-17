import React from 'react';
import { Search } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  onAction,
  icon,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white border border-[#E5E7EB] rounded-2xl shadow-sm">
      <div className="w-14 h-14 rounded-2xl bg-[#F0F9FF] border border-sky-100 flex items-center justify-center text-[#0EA5E9] mb-4">
        {icon || <Search className="w-7 h-7" />}
      </div>
      <h3 className="text-lg font-bold text-[#111827]">{title}</h3>
      <p className="text-sm text-[#6B7280] max-w-sm mt-1 mb-6">{description}</p>
      {actionText && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};
