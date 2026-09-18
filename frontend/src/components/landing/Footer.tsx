import React from 'react';

interface FooterProps {
  onLaunchDashboard: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onLaunchDashboard }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
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


          {/* Features Col */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#111827]">Features</h4>
            <ul className="space-y-2 text-sm text-[#6B7280]">
              <li>
                <a href="#features" onClick={(e) => scrollTo(e, 'features')} className="hover:text-[#0EA5E9] transition-colors cursor-pointer block">Real-time Scraping</a>
              </li>
              <li>
                <a href="#features" onClick={(e) => scrollTo(e, 'features')} className="hover:text-[#0EA5E9] transition-colors cursor-pointer block">Data Enrichment</a>
              </li>
              <li>
                <a href="#features" onClick={(e) => scrollTo(e, 'features')} className="hover:text-[#0EA5E9] transition-colors cursor-pointer block">Competitor Analysis</a>
              </li>
              <li>
                <a href="#features" onClick={(e) => scrollTo(e, 'features')} className="hover:text-[#0EA5E9] transition-colors cursor-pointer block">Automated Dossiers</a>
              </li>
            </ul>
          </div>

          {/* Engineering Col */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#111827]">Engineering</h4>
            <ul className="space-y-2 text-sm text-[#6B7280]">
              <li>
                <a href="#engineering" onClick={(e) => scrollTo(e, 'engineering')} className="hover:text-[#0EA5E9] transition-colors cursor-pointer block">System Architecture</a>
              </li>
              <li>
                <a href="#engineering" onClick={(e) => scrollTo(e, 'engineering')} className="hover:text-[#0EA5E9] transition-colors cursor-pointer block">API Documentation</a>
              </li>
              <li>
                <a href="#engineering" onClick={(e) => scrollTo(e, 'engineering')} className="hover:text-[#0EA5E9] transition-colors cursor-pointer block">Privacy Architecture</a>
              </li>
              <li>
                <a href="#engineering" onClick={(e) => scrollTo(e, 'engineering')} className="hover:text-[#0EA5E9] transition-colors cursor-pointer block">Status Page</a>
              </li>
            </ul>
          </div>

          {/* About Col */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#111827]">About</h4>
            <ul className="space-y-2 text-sm text-[#6B7280]">
              <li>
                <a href="#about" onClick={(e) => scrollTo(e, 'about')} className="hover:text-[#0EA5E9] transition-colors cursor-pointer block">Our Story</a>
              </li>
              <li>
                <a href="#blog" onClick={(e) => scrollTo(e, 'blog')} className="hover:text-[#0EA5E9] transition-colors cursor-pointer block">Blog</a>
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
