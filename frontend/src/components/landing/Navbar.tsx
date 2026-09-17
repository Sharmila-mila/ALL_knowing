import React from 'react';
import { Button } from '../ui/Button';

interface NavbarProps {
  onLaunchDashboard: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onLaunchDashboard }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#E5E7EB] px-6 py-4 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={onLaunchDashboard}>
          <div className="w-10 h-10 rounded-2xl bg-[#0EA5E9] flex items-center justify-center text-white font-bold text-sm tracking-tight shadow-sm">
            LI
          </div>
          <span className="text-xl font-bold tracking-tight text-[#111827]">
            Lead Intelligence <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#F0F9FF] text-[#0EA5E9] border border-sky-100 ml-1">AI</span>
          </span>
        </div>

        {/* Navigation links - Home, Features, Dashboard */}
        <nav className="flex items-center gap-8 text-sm font-medium text-[#6B7280]">
          <a href="#home" className="hover:text-[#111827] transition-colors">Home</a>
          <a href="#features" className="hover:text-[#111827] transition-colors">Features</a>
          <button onClick={onLaunchDashboard} className="hover:text-[#111827] transition-colors">Dashboard</button>
        </nav>

        {/* Action Button - Get Started */}
        <div className="flex items-center gap-3">
          <Button variant="primary" size="sm" onClick={onLaunchDashboard}>
            Get Started
          </Button>
        </div>
      </div>
    </header>
  );
};
