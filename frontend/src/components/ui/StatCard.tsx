import React from 'react';
import { Card } from './Card';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  isPositive = true,
  icon,
}) => {
  return (
    <Card hoverable className="flex items-center justify-between">
      <div>
        <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">{title}</p>
        <h3 className="text-2xl font-bold text-[#111827] mt-1">{value}</h3>
        {change && (
          <p className={`text-xs font-medium mt-1 ${isPositive ? 'text-[#16A34A]' : 'text-red-500'}`}>
            {isPositive ? '↑' : '↓'} {change} vs last month
          </p>
        )}
      </div>
      <div className="w-12 h-12 rounded-2xl bg-[#F0F9FF] border border-sky-100 flex items-center justify-center text-[#0EA5E9]">
        {icon}
      </div>
    </Card>
  );
};
