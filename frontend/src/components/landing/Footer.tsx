import React from 'react';

interface FooterProps {
  onLaunchDashboard: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onLaunchDashboard }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white border-t border-[#E5E7EB] text-[#111827]">
      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3 cursor-pointer" onClick={scrollToTop}>
              <div className="w-10 h-10 rounded-2xl bg-[#0EA5E9] text-white font-bold flex items-center justify-center text-sm tracking-tight shadow-sm">
                LI
              </div>
              <span className="text-xl font-bold tracking-tight text-[#111827]">
                Lead Intelligence{' '}
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#F0F9FF] text-[#0EA5E9] border border-sky-100 ml-1">
                  AI
                </span>
              </span>
            </div>
            <p className="text-sm text-[#6B7280] leading-relaxed max-w-sm">
              Autonomous enterprise lead intelligence platform. Consolidating SEC filings, financial ratios, executive LinkedIn profiles, and live market signals into actionable dossiers.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Systems Operational
              </div>
              <span className="text-xs text-[#6B7280]">v2.4 Enterprise</span>
            </div>
          </div>

          {/* Product Col */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#111827]">Platform</h4>
            <ul className="space-y-2 text-sm text-[#6B7280]">
              <li>
                <button onClick={onLaunchDashboard} className="hover:text-[#0EA5E9] transition-colors text-left">
                  Company Intelligence
                </button>
              </li>
              <li>
                <button onClick={onLaunchDashboard} className="hover:text-[#0EA5E9] transition-colors text-left">
                  Executive Lookup
                </button>
              </li>
              <li>
                <button onClick={onLaunchDashboard} className="hover:text-[#0EA5E9] transition-colors text-left">
                  Lead Investigation
                </button>
              </li>
              <li>
                <button onClick={onLaunchDashboard} className="hover:text-[#0EA5E9] transition-colors text-left">
                  Financial Analytics
                </button>
              </li>
              <li>
                <button onClick={onLaunchDashboard} className="hover:text-[#0EA5E9] transition-colors text-left">
                  Tracked Companies
                </button>
              </li>
            </ul>
          </div>

          {/* Data Sources Col */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#111827]">Intelligence Stack</h4>
            <ul className="space-y-2 text-sm text-[#6B7280]">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0EA5E9]"></span>
                <span>SEC EDGAR Filings</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0EA5E9]"></span>
                <span>Finnhub & Alpha Vantage</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0EA5E9]"></span>
                <span>Playwright Chromium</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0EA5E9]"></span>
                <span>Groq Llama 3.3 70B</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0EA5E9]"></span>
                <span>Supabase PostgreSQL</span>
              </li>
            </ul>
          </div>

          {/* Resources Col */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#111827]">Resources</h4>
            <ul className="space-y-2 text-sm text-[#6B7280]">
              <li>
                <a href="/api/health" target="_blank" rel="noopener noreferrer" className="hover:text-[#0EA5E9] transition-colors">
                  API Health Endpoint
                </a>
              </li>
              <li>
                <button onClick={onLaunchDashboard} className="hover:text-[#0EA5E9] transition-colors text-left">
                  Workspace Dashboard
                </button>
              </li>
              <li>
                <a href="#features" className="hover:text-[#0EA5E9] transition-colors">
                  Platform Capabilities
                </a>
              </li>
              <li>
                <button onClick={() => window.open('https://www.zuntra.com/', '_blank', 'noopener,noreferrer')} className="hover:text-[#0EA5E9] transition-colors text-left">
                  Zuntra Official Portal ↗
                </button>
              </li>
              <li>
                <span className="text-xs text-[#9CA3AF]">Chrome Extension (MV3)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Sub-bar / Compliance & Security */}
        <div className="mt-12 pt-8 border-t border-[#E5E7EB] grid grid-cols-1 md:grid-cols-2 gap-4 items-center text-xs text-[#6B7280]">
          <div className="flex flex-wrap items-center gap-y-2 gap-x-6">
            <span>© 2026 Zuntra Lead Intelligence. All rights reserved.</span>
            <span className="hidden md:inline text-slate-300">|</span>
            <span>Privacy First Architecture</span>
            <span>•</span>
            <span>Local Subprocess Execution</span>
          </div>
          <div className="flex items-center md:justify-end gap-6">
            <button onClick={scrollToTop} className="hover:text-[#0EA5E9] transition-colors font-medium flex items-center gap-1">
              Back to top ↑
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
