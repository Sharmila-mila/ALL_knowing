import React from 'react';
import { Sparkles, ArrowRight, Award, User, TrendingUp, Building2, LayoutDashboard } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface HeroProps {
  onLaunchDashboard: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onLaunchDashboard }) => {
  return (
    <section id="home" className="relative pt-16 pb-24 px-6 overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Content */}
        <div className="lg:col-span-7 space-y-6">
          <Badge variant="primary" icon={<Sparkles className="w-3.5 h-3.5" />}>
            AI Powered Lead Intelligence
          </Badge>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#111827] tracking-tight leading-[1.1]">
            FIND COMPANIES. DISCOVER DECISION MAKERS. <span className="text-[#0EA5E9]">CLOSE DEALS FASTER.</span>
          </h1>

          <p className="text-lg text-[#6B7280] leading-relaxed max-w-xl">
            Lead Intelligence helps sales teams, recruiters, founders, and researchers discover company intelligence, financial insights, executive profiles, and verified B2B leads from one intelligent platform.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Button variant="primary" size="lg" icon={<ArrowRight className="w-5 h-5" />} onClick={onLaunchDashboard}>
              Get Started
            </Button>
            <Button variant="outline" size="lg" icon={<LayoutDashboard className="w-4 h-4 text-[#0EA5E9]" />} onClick={onLaunchDashboard}>
              Explore Dashboard
            </Button>
          </div>
        </div>

        {/* Right side realistic dashboard preview mockup */}
        <div className="lg:col-span-5 relative">
          <div className="relative mx-auto bg-white rounded-3xl border border-[#E5E7EB] shadow-soft-lg p-6 space-y-5 animate-float hover:shadow-2xl transition-all">
            {/* Top header inside mockup */}
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg">
                  T
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-[#111827]">Tesla, Inc.</h3>
                    <Badge variant="primary" size="sm">TSLA</Badge>
                  </div>
                  <p className="text-xs text-[#6B7280]">Automotive & Energy Systems</p>
                </div>
              </div>
              <div className="text-right">
                <Badge variant="success" size="sm" icon={<Award className="w-3 h-3" />}>
                  AI Score: 98/100
                </Badge>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-2xl">
                <p className="text-xs font-medium text-[#6B7280]">Market Cap</p>
                <p className="text-lg font-bold text-[#111827] mt-0.5">$750.4B</p>
              </div>
              <div className="p-3.5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-2xl">
                <p className="text-xs font-medium text-[#6B7280]">Chief Executive</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <User className="w-4 h-4 text-[#0EA5E9]" />
                  <p className="text-sm font-bold text-[#111827]">Elon Musk</p>
                </div>
              </div>
            </div>

            {/* Sparkline chart illustration */}
            <div className="p-4 bg-[#F8FAFC] border border-[#E5E7EB] rounded-2xl space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-[#111827]">Quarterly Revenue Trajectory</span>
                <span className="text-[#16A34A] font-bold flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> +18.4%
                </span>
              </div>
              <div className="h-16 flex items-end justify-between gap-2 pt-2">
                {[40, 55, 48, 70, 85, 92, 100].map((h, i) => (
                  <div key={i} className="w-full bg-[#0EA5E9]/20 hover:bg-[#0EA5E9] transition-all rounded-t-md" style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>

            {/* Signal preview */}
            <div className="p-3.5 bg-[#F0F9FF] border border-sky-100 rounded-2xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#0EA5E9]" />
                <span className="font-semibold text-[#111827] truncate max-w-[220px]">SEC 10-Q filing confirmed expansion</span>
              </div>
              <span className="text-[#0EA5E9] font-medium">Verified</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
