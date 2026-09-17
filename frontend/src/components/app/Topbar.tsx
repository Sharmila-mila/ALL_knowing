import React from 'react';
import { Search, Bell, Activity, Sparkles } from 'lucide-react';
import { Input } from '../ui/Input';

interface TopbarProps {
  onSearchQuery?: (query: string) => void;
  onReturnHome: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onSearchQuery, onReturnHome }) => {
  return (
    <header className="bg-white border-b border-[#E5E7EB] px-8 py-4 sticky top-0 z-30 flex items-center justify-between gap-6">
      {/* Global Search */}
      <div className="w-full max-w-md">
        <Input
          placeholder="Global search companies, executives, leads..."
          icon={<Search className="w-4 h-4 text-[#6B7280]" />}
          onChange={(e) => onSearchQuery?.(e.target.value)}
        />
      </div>

      {/* Right User & System Controls */}
      <div className="flex items-center gap-4">
        <button
          onClick={onReturnHome}
          className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-[#0EA5E9] bg-[#F0F9FF] border border-sky-100 px-3 py-1.5 rounded-full hover:bg-sky-100 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" /> Landing Website
        </button>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-[#F8FAFC] border border-[#E5E7EB] text-xs font-semibold text-[#111827]">
          <Activity className="w-4 h-4 text-[#16A34A]" />
          <span>Connected</span>
        </div>

        <button className="relative p-2 rounded-2xl text-[#6B7280] hover:text-[#111827] hover:bg-[#F8FAFC] transition-colors border border-[#E5E7EB]">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#0EA5E9]" />
        </button>

        {/* User Avatar */}
        <div className="flex items-center gap-3 pl-2 border-l border-[#E5E7EB]">
          <div className="w-9 h-9 rounded-2xl bg-slate-900 text-white font-bold flex items-center justify-center text-sm shadow-xs">
            JS
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-bold text-[#111827]">Sales Engineer</p>
            <p className="text-[10px] text-[#6B7280]">Pro License</p>
          </div>
        </div>
      </div>
    </header>
  );
};
