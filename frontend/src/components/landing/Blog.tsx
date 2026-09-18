import React from 'react';

export const Blog: React.FC = () => {
  return (
    <section id="blog" className="py-24 px-6 bg-[#F8FAFC] border-t border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1 font-medium rounded-full text-xs px-3 py-1 bg-[#F0F9FF] text-[#0EA5E9] border border-sky-100">Latest Insights</span>
          <h2 className="text-3xl font-extrabold text-[#111827]">From the Blog</h2>
          <p className="text-base text-[#6B7280]">Stay updated with the latest trends in lead intelligence, B2B sales, and our platform updates.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden hover:shadow-soft transition-all cursor-pointer">
            <div className="h-48 bg-slate-200"></div>
            <div className="p-6 space-y-3">
              <span className="text-xs font-bold text-[#0EA5E9] uppercase tracking-wider">Product Update</span>
              <h3 className="text-lg font-bold text-[#111827]">Introducing Zuntra Lead Intelligence v2.4</h3>
              <p className="text-sm text-[#6B7280]">Learn how our new automated dossiers feature helps you research prospects 10x faster.</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden hover:shadow-soft transition-all cursor-pointer">
            <div className="h-48 bg-slate-200"></div>
            <div className="p-6 space-y-3">
              <span className="text-xs font-bold text-[#0EA5E9] uppercase tracking-wider">Sales Strategy</span>
              <h3 className="text-lg font-bold text-[#111827]">How to use Financial Data in Cold Outreach</h3>
              <p className="text-sm text-[#6B7280]">Leverage market cap and revenue metrics to write highly personalized emails that convert.</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden hover:shadow-soft transition-all cursor-pointer">
            <div className="h-48 bg-slate-200"></div>
            <div className="p-6 space-y-3">
              <span className="text-xs font-bold text-[#0EA5E9] uppercase tracking-wider">Engineering</span>
              <h3 className="text-lg font-bold text-[#111827]">Scaling our Data Pipeline with Playwright</h3>
              <p className="text-sm text-[#6B7280]">A deep dive into how we handle thousands of concurrent requests securely and reliably.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
