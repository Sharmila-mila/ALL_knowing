import React from 'react';
import {
  LayoutDashboard,
  Building2,
  Target,
  Users,
  Bookmark,
  Settings,
  Home,
  Sparkles,
} from 'lucide-react';

export type TabType = 'dashboard' | 'company' | 'lead' | 'people' | 'bookmarks' | 'settings';

interface SidebarProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  onReturnHome: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  onReturnHome,
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'company', label: 'Company Search', icon: <Building2 className="w-5 h-5" /> },
    { id: 'lead', label: 'Lead Finder', icon: <Target className="w-5 h-5" /> },
    { id: 'people', label: 'People Lookup', icon: <Users className="w-5 h-5" /> },
    { id: 'bookmarks', label: 'Bookmarks', icon: <Bookmark className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <aside className="w-64 bg-white border-r border-[#E5E7EB] h-screen flex flex-col justify-between p-6 shrink-0 sticky top-0">
      <div className="space-y-8">
        {/* Logo */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onTabChange('dashboard')}>
            <div className="w-9 h-9 rounded-2xl bg-[#0EA5E9] text-white flex items-center justify-center font-bold text-xs tracking-tight shadow-sm">
              LI
            </div>
            <span className="font-bold text-lg text-[#111827] tracking-tight">Lead Intelligence</span>
          </div>
          <button
            onClick={onReturnHome}
            title="Return to Marketing Site"
            className="p-1.5 rounded-xl text-[#6B7280] hover:text-[#111827] hover:bg-[#F8FAFC] transition-colors"
          >
            <Home className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id as TabType)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-[#F0F9FF] text-[#0EA5E9] border border-sky-100 shadow-xs'
                    : 'text-[#6B7280] hover:bg-[#F8FAFC] hover:text-[#111827]'
                }`}
              >
                <span className={isActive ? 'text-[#0EA5E9]' : 'text-[#6B7280]'}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Status Card */}
      <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E5E7EB] space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-[#111827]">Engine Status</span>
          <span className="inline-flex items-center gap-1 text-[#16A34A] font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" /> Active
          </span>
        </div>
        <p className="text-xs text-[#6B7280]">Flask server running on localhost:5000</p>
      </div>
    </aside>
  );
};
