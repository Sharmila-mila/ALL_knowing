import React, { useState } from 'react';
import { Target, Mail, Building2, Globe, Download, Sparkles, User, CheckCircle2 } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import { investigateLead, parseLead } from '../../services/api';

export const LeadFinderPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [leadResult, setLeadResult] = useState<any>({
    email: 'satya.nadella@microsoft.com',
    company: 'Microsoft Corporation',
    domain: 'microsoft.com',
    contacts: [
      { name: 'Satya Nadella', role: 'Chairman & Chief Executive Officer', email: 'satya.nadella@microsoft.com', confidence: '99%' },
      { name: 'Amy Hood', role: 'Executive Vice President & CFO', email: 'amy.hood@microsoft.com', confidence: '95%' },
      { name: 'Judson Althoff', role: 'Executive VP & Chief Commercial Officer', email: 'judson.althoff@microsoft.com', confidence: '92%' },
    ],
  });

  const handleInvestigate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setProgress(30);

    try {
      const parsed = await parseLead(email);
      setProgress(60);
      const res = await investigateLead(email);
      setProgress(100);
      setLeadResult(res.result || res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    if (!leadResult?.contacts) return;
    const headers = 'Name,Role,Email,Confidence\n';
    const rows = leadResult.contacts.map((c: any) => `"${c.name}","${c.role}","${c.email}","${c.confidence}"`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-${email || 'export'}.csv`;
    a.click();
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <h1 className="text-3xl font-extrabold text-[#111827]">Lead Intelligence Finder</h1>
        <p className="text-sm text-[#6B7280]">
          Convert corporate emails into verified B2B prospect profiles, executive contacts, and company data.
        </p>
      </div>

      {/* Inputs Form */}
      <Card className="max-w-2xl mx-auto p-6 space-y-4">
        <form onSubmit={handleInvestigate} className="space-y-4">
          <Input
            label="Corporate Email"
            placeholder="e.g. satya.nadella@microsoft.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail className="w-4 h-4" />}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Company Name (Optional)"
              placeholder="e.g. Microsoft"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              icon={<Building2 className="w-4 h-4" />}
            />
            <Input
              label="Target Domain (Optional)"
              placeholder="e.g. microsoft.com"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              icon={<Globe className="w-4 h-4" />}
            />
          </div>
          <Button variant="primary" size="lg" className="w-full" loading={loading} icon={<Sparkles className="w-4 h-4" />}>
            Investigate Lead
          </Button>
        </form>

        {loading && (
          <div className="pt-2">
            <ProgressBar pct={progress} step="Analyzing lead domain and extracting decision makers..." />
          </div>
        )}
      </Card>

      {/* Discovered Contacts Results */}
      {leadResult && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#111827]">Discovered Executive Contacts</h3>
            <Button variant="outline" size="sm" icon={<Download className="w-4 h-4" />} onClick={exportCSV}>
              Export CSV
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(leadResult.contacts || []).map((c: any, i: number) => (
              <Card key={i} hoverable className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-[#F0F9FF] text-[#0EA5E9] font-bold flex items-center justify-center">
                    {c.name.charAt(0)}
                  </div>
                  <Badge variant="success" size="sm">{c.confidence || 'Verified'}</Badge>
                </div>
                <div>
                  <h4 className="font-bold text-[#111827] text-base">{c.name}</h4>
                  <p className="text-xs text-[#6B7280]">{c.role}</p>
                </div>
                <div className="pt-3 border-t border-[#E5E7EB] text-xs font-semibold text-[#0EA5E9] truncate">
                  {c.email}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
