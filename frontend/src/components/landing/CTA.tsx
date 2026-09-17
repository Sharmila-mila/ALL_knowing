import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';

interface CTAProps {
  onLaunchDashboard: () => void;
}

export const CTA: React.FC<CTAProps> = ({ onLaunchDashboard }) => {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-5xl mx-auto bg-[#F8FAFC] border border-[#E5E7EB] rounded-3xl p-12 text-center space-y-6 shadow-soft">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight">
          READY TO BUILD BETTER LEADS?
        </h2>
        
        <p className="text-base text-[#6B7280] max-w-xl mx-auto leading-relaxed">
          Start researching companies and discovering decision makers in minutes.
        </p>

        <div className="pt-2">
          <Button variant="primary" size="lg" icon={<ArrowRight className="w-5 h-5" />} onClick={onLaunchDashboard}>
            Launch Dashboard
          </Button>
        </div>
      </div>
    </section>
  );
};
