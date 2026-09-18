import React from 'react';

export const About: React.FC = () => {
  return (
    <section id="about" className="py-24 px-6 bg-white border-t border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <span className="inline-flex items-center gap-1 font-medium rounded-full text-xs px-3 py-1 bg-[#F0F9FF] text-[#0EA5E9] border border-sky-100">About Us</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827]">Empowering Teams with Data Intelligence.</h2>
          <p className="text-base text-[#6B7280] leading-relaxed">
            Zuntra Lead Intelligence was built on the vision that B2B prospecting should be frictionless. We combine the latest in AI, automated web scraping, and robust financial data pipelines into a single unified platform. 
          </p>
          <p className="text-base text-[#6B7280] leading-relaxed">
            Our mission is to help modern sales teams, researchers, and recruiters focus on what matters most—closing deals and building relationships—while we handle the heavy lifting of data aggregation.
          </p>
          <div className="flex gap-4 pt-4">
            <button className="inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none rounded-2xl active:scale-[0.98] bg-transparent border border-[#E5E7EB] hover:border-slate-300 text-[#111827] hover:bg-slate-50 text-sm px-4 py-2.5 gap-2">Read Our Story</button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
           <div className="bg-[#F8FAFC] rounded-2xl border border-[#E5E7EB] p-6 text-center space-y-2 shadow-sm">
             <h3 className="text-3xl font-extrabold text-[#0EA5E9]">10M+</h3>
             <p className="text-sm text-[#6B7280]">Companies Indexed</p>
           </div>
           <div className="bg-[#F8FAFC] rounded-2xl border border-[#E5E7EB] p-6 text-center space-y-2 shadow-sm">
             <h3 className="text-3xl font-extrabold text-[#0EA5E9]">50M+</h3>
             <p className="text-sm text-[#6B7280]">Executives Discovered</p>
           </div>
           <div className="bg-[#F8FAFC] rounded-2xl border border-[#E5E7EB] p-6 text-center space-y-2 shadow-sm">
             <h3 className="text-3xl font-extrabold text-[#0EA5E9]">99.9%</h3>
             <p className="text-sm text-[#6B7280]">Data Accuracy</p>
           </div>
           <div className="bg-[#F8FAFC] rounded-2xl border border-[#E5E7EB] p-6 text-center space-y-2 shadow-sm">
             <h3 className="text-3xl font-extrabold text-[#0EA5E9]">24/7</h3>
             <p className="text-sm text-[#6B7280]">Real-time Updates</p>
           </div>
        </div>
      </div>
    </section>
  );
};
