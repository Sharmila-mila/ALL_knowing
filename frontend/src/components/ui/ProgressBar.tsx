import React from 'react';

interface ProgressBarProps {
  pct: number;
  step?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ pct, step }) => {
  return (
    <div className="w-full space-y-1.5">
      <div className="flex justify-between items-center text-xs">
        <span className="font-medium text-[#111827]">{step || 'Processing...'}</span>
        <span className="font-semibold text-[#0EA5E9]">{pct}%</span>
      </div>
      <div className="w-full h-2 bg-[#F8FAFC] border border-[#E5E7EB] rounded-full overflow-hidden">
        <div
          className="h-full bg-[#0EA5E9] transition-all duration-300 rounded-full"
          style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
        />
      </div>
    </div>
  );
};
