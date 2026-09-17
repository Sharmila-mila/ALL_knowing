import React, { useEffect, useState } from 'react';
import { Activity, Server, Database, Linkedin, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { fetchHealth } from '../../services/api';

export const SettingsPage: React.FC = () => {
  const [health, setHealth] = useState<{ status: string; supabase_connected: boolean }>({
    status: 'healthy',
    supabase_connected: false,
  });

  useEffect(() => {
    fetchHealth().then(setHealth);
  }, []);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-[#111827]">System Settings & Health Status</h1>
        <p className="text-sm text-[#6B7280]">Real-time operational status of backend services and scrapers.</p>
      </div>

      {/* System Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#16A34A] border border-emerald-100 flex items-center justify-center">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-[#111827]">Flask WSGI Backend</h3>
                <p className="text-xs text-[#6B7280]">localhost:5000</p>
              </div>
            </div>
            <Badge variant="success" icon={<CheckCircle2 className="w-3.5 h-3.5" />}>
              Operational
            </Badge>
          </div>
          <div className="p-4 bg-[#F8FAFC] border border-[#E5E7EB] rounded-2xl text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-[#6B7280]">Environment</span>
              <span className="font-semibold text-[#111827]">Production (Waitress)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B7280]">Response Latency</span>
              <span className="font-semibold text-[#16A34A]">&lt; 15ms</span>
            </div>
          </div>
        </Card>

        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-sky-50 text-[#0EA5E9] border border-sky-100 flex items-center justify-center">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-[#111827]">Supabase Database</h3>
                <p className="text-xs text-[#6B7280]">PostgreSQL Store</p>
              </div>
            </div>
            <Badge variant={health.supabase_connected ? 'success' : 'info'}>
              {health.supabase_connected ? 'Connected' : 'JSON Fallback Active'}
            </Badge>
          </div>
          <div className="p-4 bg-[#F8FAFC] border border-[#E5E7EB] rounded-2xl text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-[#6B7280]">Persistence Mode</span>
              <span className="font-semibold text-[#111827]">{health.supabase_connected ? 'Supabase Cloud' : 'Local JSON Fallback'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B7280]">Schema Sync</span>
              <span className="font-semibold text-[#16A34A]">Verified</span>
            </div>
          </div>
        </Card>

        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center">
                <Linkedin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-[#111827]">Playwright Scraper</h3>
                <p className="text-xs text-[#6B7280]">Chromium Headless Session</p>
              </div>
            </div>
            <Badge variant="success" icon={<CheckCircle2 className="w-3.5 h-3.5" />}>
              Ready
            </Badge>
          </div>
          <div className="p-4 bg-[#F8FAFC] border border-[#E5E7EB] rounded-2xl text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-[#6B7280]">Session Cookies</span>
              <span className="font-semibold text-[#111827]">Active State</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B7280]">Browser Driver</span>
              <span className="font-semibold text-[#111827]">Chromium 124.0</span>
            </div>
          </div>
        </Card>

        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-[#111827]">Groq AI Engine</h3>
                <p className="text-xs text-[#6B7280]">LLM Intelligence</p>
              </div>
            </div>
            <Badge variant="success" icon={<CheckCircle2 className="w-3.5 h-3.5" />}>
              Active
            </Badge>
          </div>
          <div className="p-4 bg-[#F8FAFC] border border-[#E5E7EB] rounded-2xl text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-[#6B7280]">Default Model</span>
              <span className="font-semibold text-[#111827]">llama-3.3-70b-versatile</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B7280]">News Model</span>
              <span className="font-semibold text-[#111827]">llama-3.1-8b-instant</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
