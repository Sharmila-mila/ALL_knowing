import React, { useState } from 'react';
import { Users, Search, MapPin, Building2, ExternalLink, Linkedin, User } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Drawer } from '../ui/Drawer';
import { searchPeople } from '../../services/api';
import { PersonCandidate } from '../../types';

export const PeopleLookupPage: React.FC = () => {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<PersonCandidate | null>(null);
  const [people, setPeople] = useState<PersonCandidate[]>([
    {
      name: 'Elon Musk',
      role: 'CEO & Founder',
      company: 'Tesla / SpaceX / X',
      location: 'Austin, Texas, USA',
      url: 'https://linkedin.com/in/elonmusk',
      headline: 'Technoking of Tesla, Chief Engineer of SpaceX',
      email: 'elon.musk@tesla.com',
    },
    {
      name: 'Satya Nadella',
      role: 'Chairman & CEO',
      company: 'Microsoft',
      location: 'Redmond, Washington, USA',
      url: 'https://linkedin.com/in/satyanadella',
      headline: 'Chairman and CEO at Microsoft',
      email: 'satya.nadella@microsoft.com',
    },
    {
      name: 'Jensen Huang',
      role: 'President & CEO',
      company: 'Nvidia Corporation',
      location: 'Santa Clara, California, USA',
      url: 'https://linkedin.com/in/jensenhuang',
      headline: 'Founder and CEO of Nvidia',
      email: 'jensen.huang@nvidia.com',
    },
  ]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await searchPeople({ name, company, title, location });
      if (res.candidates) setPeople(res.candidates);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <h1 className="text-3xl font-extrabold text-[#111827]">Executive & People Lookup</h1>
        <p className="text-sm text-[#6B7280]">
          Search verified decision makers, CEOs, VPs, and founders across corporate LinkedIn profiles.
        </p>
      </div>

      {/* Multi-field Search Form */}
      <Card className="p-6">
        <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            placeholder="Full Name (e.g. Elon Musk)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            icon={<User className="w-4 h-4" />}
          />
          <Input
            placeholder="Company (e.g. Tesla)"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            icon={<Building2 className="w-4 h-4" />}
          />
          <Input
            placeholder="Title (e.g. CEO)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
          <Input
            placeholder="Location (e.g. Austin)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            icon={<MapPin className="w-4 h-4" />}
          />
          <div className="lg:col-span-4 flex justify-end pt-2">
            <Button variant="primary" loading={loading} icon={<Search className="w-4 h-4" />}>
              Search People
            </Button>
          </div>
        </form>
      </Card>

      {/* Profile Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {people.map((person, idx) => (
          <Card key={idx} hoverable className="space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#0EA5E9] text-white font-bold flex items-center justify-center text-lg shadow-sm">
                  {person.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-[#111827] text-base">{person.name}</h3>
                  <p className="text-xs text-[#0EA5E9] font-semibold">{person.role || 'Executive'}</p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-[#6B7280]">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#6B7280]" />
                  <span>{person.company || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#6B7280]" />
                  <span>{person.location || 'Global'}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E5E7EB] flex items-center justify-between">
              <a href={person.url} target="_blank" rel="noreferrer" className="text-xs font-semibold text-[#0EA5E9] flex items-center gap-1 hover:underline">
                <Linkedin className="w-4 h-4" /> Profile
              </a>
              <Button variant="outline" size="sm" onClick={() => setSelectedPerson(person)}>
                View Drawer
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Slide-over Profile Drawer */}
      <Drawer
        isOpen={!!selectedPerson}
        onClose={() => setSelectedPerson(null)}
        title={selectedPerson?.name || 'Executive Profile'}
      >
        {selectedPerson && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#0EA5E9] text-white font-bold flex items-center justify-center text-2xl">
                {selectedPerson.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#111827]">{selectedPerson.name}</h3>
                <p className="text-sm font-semibold text-[#0EA5E9]">{selectedPerson.role}</p>
                <p className="text-xs text-[#6B7280]">{selectedPerson.company}</p>
              </div>
            </div>

            <div className="space-y-3 p-4 bg-[#F8FAFC] border border-[#E5E7EB] rounded-2xl text-xs">
              <p className="font-bold text-[#111827] uppercase tracking-wider">Headline & Bio</p>
              <p className="text-[#6B7280] leading-relaxed">{selectedPerson.headline || 'No bio headline available.'}</p>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-bold text-[#111827] uppercase tracking-wider">Contact Metadata</p>
              <div className="p-4 border border-[#E5E7EB] rounded-2xl space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Email</span>
                  <span className="font-semibold text-[#111827]">{selectedPerson.email || 'Verified on LinkedIn'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Location</span>
                  <span className="font-semibold text-[#111827]">{selectedPerson.location}</span>
                </div>
              </div>
            </div>

            <a href={selectedPerson.url} target="_blank" rel="noreferrer" className="block">
              <Button variant="primary" className="w-full" icon={<ExternalLink className="w-4 h-4" />}>
                Open on LinkedIn
              </Button>
            </a>
          </div>
        )}
      </Drawer>
    </div>
  );
};
