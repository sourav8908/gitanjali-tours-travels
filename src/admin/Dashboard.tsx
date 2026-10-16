import React, { useState } from 'react';
import { Download, ExternalLink, HardDrive, RotateCcw } from 'lucide-react';
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

  const vehicles = loadSection('vehicles');
  const stats = [
    { label: 'Vehicles', value: vehicles.filter((v) => !v.hidden).length, sub: `${vehicles.filter((v) => !v.hidden && v.isAvailable).length} available`, key: 'vehicles' as const },
    { label: 'Tour packages', value: loadSection('tours').filter((t) => !t.hidden).length, sub: 'shown on site', key: 'tours' as const },
    { label: 'Offers', value: loadSection('offers').filter((o) => !o.hidden).length, sub: 'shown on site', key: 'offers' as const },
    { label: 'Genuine reviews', value: loadSection('testimonials').filter((t) => !t.isDemoData).length, sub: 'samples excluded', key: 'testimonials' as const },
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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <button key={s.label} type="button" onClick={() => onOpen(s.key)}
            className="text-left p-5 bg-white rounded-brand-lg border border-slate-200 shadow-subtle hover:border-brand-gold/60 hover:shadow-card transition-all">
            <p className="text-3xl font-display font-bold text-brand-navy">{s.value}</p>
            <p className="text-sm font-semibold text-slate-700 mt-1">{s.label}</p>
            <p className="text-xs text-slate-500">{s.sub}</p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Your demo edits" description="Sections you've changed in this browser.">
          {edited.length === 0 ? (
            <p className="text-sm text-slate-500">No edits yet. The site shows the published content.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {edited.map((key) => {
                const def = sections.find((s) => s.key === key);
                return def ? (
                  <button key={key} type="button" onClick={() => onOpen(key)}><Badge tone="blue">{def.label}</Badge></button>
                ) : null;
              })}
            </div>
          )}
          <div className="mt-5 pt-5 border-t border-slate-100">
            <p className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <HardDrive className="w-4 h-4 text-slate-400" /> Browser storage used
            </p>
            <div className="mt-2 h-2 rounded-full bg-slate-100 overflow-hidden">
              <div className={`h-full ${usedPct > 80 ? 'bg-red-500' : 'bg-brand-ocean'}`} style={{ width: `${Math.max(usedPct, bytes ? 2 : 0)}%` }} />
            </div>
            <p className="text-xs text-slate-500 mt-1.5">
              {(bytes / 1024).toFixed(0)} KB of about 5 MB. Uploaded photos use the most space.
            </p>
          </div>
        </Card>

        <Card title="Actions">
          <div className="flex flex-col gap-3">
            <a href={import.meta.env.BASE_URL} target="_blank" rel="noopener noreferrer" className={btn.dark}>
              <ExternalLink className="w-4 h-4" /> View website with my edits
            </a>
            <button type="button" className={btn.ghost} onClick={download}>
              <Download className="w-4 h-4" /> Export all content (JSON)
            </button>
            <button type="button" className={btn.danger} onClick={resetAll} disabled={edited.length === 0}>
              <RotateCcw className="w-4 h-4" /> Reset all demo edits
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-4 leading-relaxed">
            The export contains every section with your edits applied, ready to load into a database when the site gets a real backend.
          </p>
        </Card>
      </div>
    </div>
  );
};
