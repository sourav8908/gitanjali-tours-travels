import React, { useState } from 'react';
import { ArrowRight, Car, Download, ExternalLink, HardDrive, Map, MessageSquareQuote, RotateCcw, Tag } from 'lucide-react';
import { KonarkWheel } from '../components/ui/KonarkWheel';
import { asset } from '../utils/asset';
import { demoStorageBytes, editedSections, exportContent, loadSection, resetAllDemoEdits } from '../content/store';
import type { ContentKey } from '../types';
import { sections } from './sections';
import { Badge, Card } from './ui';
import { btn } from './styles';

const STORAGE_LIMIT = 5 * 1024 * 1024; // typical localStorage quota per site

interface DashboardProps {
  onOpen: (key: ContentKey) => void;
  notify: (message: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onOpen, notify }) => {
  const [edited, setEdited] = useState(editedSections);
  const [bytes, setBytes] = useState(demoStorageBytes);

  const company = loadSection('company');
  const vehicles = loadSection('vehicles').filter((v) => !v.hidden);
  const stats = [
    { label: 'Vehicles', value: vehicles.length, sub: `${vehicles.filter((v) => v.isAvailable).length} available now`, key: 'vehicles' as const, icon: Car },
    { label: 'Tour packages', value: loadSection('tours').filter((t) => !t.hidden).length, sub: 'shown on the website', key: 'tours' as const, icon: Map },
    { label: 'Offers', value: loadSection('offers').filter((o) => !o.hidden).length, sub: 'shown on the website', key: 'offers' as const, icon: Tag },
    { label: 'Genuine reviews', value: loadSection('testimonials').filter((t) => !t.isDemoData).length, sub: 'samples not counted', key: 'testimonials' as const, icon: MessageSquareQuote },
  ];

  const download = () => {
    const blob = new Blob([JSON.stringify(exportContent(), null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gitanjali-content-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    notify('Content exported.');
  };

  const resetAll = () => {
    if (!window.confirm('Reset ALL demo edits in this browser? Everything returns to the published version.')) return;
    resetAllDemoEdits();
    setEdited([]);
    setBytes(0);
    notify('All demo edits cleared.');
  };

  const usedPct = Math.min(100, Math.round((bytes / STORAGE_LIMIT) * 100));
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <section className="relative overflow-hidden rounded-brand-lg bg-brand-navy text-white">
        <img src={asset('/images/odisha/jagannath-temple-puri.webp')} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-navy via-brand-navy/85 to-brand-navy/30" />
        <KonarkWheel strokeWidth={0.7} className="absolute -right-16 -top-16 w-72 h-72 text-brand-gold/15" />
        <div className="relative p-6 sm:p-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-gold">{greeting}</p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold mt-2">{company.name}</h1>
          <p className="text-slate-300 mt-2 max-w-lg">Keep your fleet, tours and prices up to date. Changes show on the website in this browser as soon as you save.</p>
          <div className="flex flex-wrap gap-3 mt-6">
            <button type="button" className={btn.primary} onClick={() => onOpen('vehicles')}>
              <Car className="w-4 h-4" /> Manage fleet
            </button>
            <a href={import.meta.env.BASE_URL} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-white/10 hover:bg-white/15 border border-white/20 rounded-brand transition-colors">
              <ExternalLink className="w-4 h-4" /> View website
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, sub, key, icon: Icon }) => (
          <button key={label} type="button" onClick={() => onOpen(key)}
            className="group text-left p-5 bg-white rounded-brand-lg border border-brand-line shadow-subtle hover:border-brand-gold/60 hover:shadow-card transition-all">
            <span className="flex w-10 h-10 items-center justify-center rounded-full bg-brand-gold-light text-brand-gold-dark">
              <Icon className="w-5 h-5" />
            </span>
            <p className="text-3xl font-display font-bold text-brand-navy mt-4">{value}</p>
            <p className="text-sm font-semibold text-brand-navy">{label}</p>
            <p className="text-xs text-slate-500">{sub}</p>
          </button>
        ))}
      </div>

      {/* Quick edit */}
      <div>
        <h2 className="font-display text-xl font-bold text-brand-navy mb-4">Quick edit</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {sections.map(({ key, label, icon: Icon, description }) => (
            <button key={key} type="button" onClick={() => onOpen(key)}
              className="group flex items-start gap-3 p-4 text-left bg-white rounded-brand-lg border border-brand-line hover:border-brand-gold/60 hover:bg-brand-gold-light/40 transition-colors">
              <span className="flex w-9 h-9 shrink-0 items-center justify-center rounded-brand bg-brand-navy text-brand-gold">
                <Icon className="w-4 h-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2 text-sm font-semibold text-brand-navy">
                  {label}
                  {edited.includes(key) && <Badge tone="gold">Edited</Badge>}
                </span>
                <span className="block text-xs text-slate-500 mt-0.5 line-clamp-2">{description}</span>
              </span>
              <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-brand-gold-dark mt-2.5 shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* Demo data */}
      <Card title="Demo data" description="Your edits are stored in this browser only.">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold text-brand-navy">
              <HardDrive className="w-4 h-4 text-slate-400" /> Browser storage used
            </p>
            <div className="mt-2 h-2 rounded-full bg-brand-ivory border border-brand-line overflow-hidden">
              <div className={`h-full ${usedPct > 80 ? 'bg-red-500' : 'bg-brand-gold'}`} style={{ width: `${Math.max(usedPct, bytes ? 2 : 0)}%` }} />
            </div>
            <p className="text-xs text-slate-500 mt-1.5">
              {(bytes / 1024).toFixed(0)} KB of about 5 MB · {edited.length ? `${edited.length} section${edited.length > 1 ? 's' : ''} edited` : 'no edits yet'}. Uploaded photos use the most space.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 lg:justify-end">
            <button type="button" className={btn.secondary} onClick={download}>
              <Download className="w-4 h-4" /> Export content (JSON)
            </button>
            <button type="button" className={btn.danger} onClick={resetAll} disabled={edited.length === 0}>
              <RotateCcw className="w-4 h-4" /> Reset all edits
            </button>
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-4">The export contains every section with your edits applied, ready to load into a database when the site gets a real backend.</p>
      </Card>
    </div>
  );
};
