import React from 'react';

export const Engineering: React.FC = () => {
  const concepts = [
    { title: 'System Architecture', desc: 'Robust distributed system built on scalable infrastructure to handle high volume data requests.' },
    { title: 'API Documentation', desc: 'Comprehensive REST and GraphQL APIs for seamless integration with your existing CRM and tools.' },
    { title: 'Privacy Architecture', desc: 'Enterprise-grade security with SOC2 compliance and end-to-end encryption for all data.' },
    { title: 'Status Page', desc: 'Real-time monitoring of all subsystems to ensure 99.99% uptime for your mission critical workflows.' },
  ];

  return (
    <section id="engineering" className="py-24 px-6 bg-[#F8FAFC] border-t border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <h2 className="text-3xl font-extrabold text-[#111827]">Engineered for Enterprise Scale</h2>
          <p className="text-base text-[#6B7280]">Built with modern technologies to deliver fast, reliable, and secure data intelligence.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {concepts.map((f, i) => (
            <div key={i} className="bg-white rounded-2xl border border-[#E5E7EB] p-6 transition-all duration-200 hover:border-slate-300 hover:shadow-soft space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-700 font-bold flex items-center justify-center">E{i+1}</div>
              <h3 className="text-xl font-bold text-[#111827]">{f.title}</h3>
              <p className="text-sm text-[#6B7280]">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
