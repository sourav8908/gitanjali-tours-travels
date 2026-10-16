import React, { useCallback, useEffect, useState } from 'react';
import { CheckCircle2, ChevronRight, ExternalLink, LayoutDashboard, Lock, LogOut, Menu, X } from 'lucide-react';
import { BrandBadge } from '../components/ui/BrandBadge';
import { KonarkWheel } from '../components/ui/KonarkWheel';
import { asset } from '../utils/asset';
import type { ContentKey } from '../types';
import { isSignedIn, signIn, signOut } from './auth';
import { Dashboard } from './Dashboard';
import { SectionEditor } from './SectionEditor';
import { sectionGroups, sections } from './sections';
import { btn, inputClass, labelClass } from './styles';

type Page = 'dashboard' | ContentKey;

const pageFromHash = (): Page => {
  const key = window.location.hash.slice(1);
  return sections.some((s) => s.key === key) ? (key as ContentKey) : 'dashboard';
};

// ------------------------------------------------------------------ Login

const Login: React.FC<{ onSignedIn: () => void }> = ({ onSignedIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (signIn(username, password)) onSignedIn();
    else setError('Incorrect username or password.');
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-brand-ivory">
      {/* Brand panel */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden bg-brand-navy">
        <img src={asset('/images/odisha/konark-dusk.webp')} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/70 to-brand-navy/40" />
        <KonarkWheel strokeWidth={0.6} className="absolute -right-24 -bottom-24 w-[420px] h-[420px] text-brand-gold/15" />
        <div className="relative flex items-center gap-3">
          <BrandBadge />
          <span className="font-display font-bold text-xl text-white">Gitanjali Tours & Travels</span>
        </div>
        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-gold mb-3">Admin</p>
          <h1 className="font-display text-4xl font-bold text-white leading-tight">
            Manage your fleet,<br /><span className="text-brand-gold italic">tours & prices.</span>
          </h1>
          <p className="text-slate-300 mt-4 max-w-sm">Update the website content in one place: cars, packages, offers, tariffs and the Trip Planner.</p>
        </div>
      </div>

      {/* Form */}
      <div className="flex items-center justify-center p-6">
        <form onSubmit={submit} className="w-full max-w-sm">
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <BrandBadge />
            <span className="font-display font-bold text-lg text-brand-navy">Gitanjali Tours</span>
          </div>
          <h2 className="font-display text-3xl font-bold text-brand-navy">Sign in</h2>
          <p className="text-sm text-slate-500 mt-1 mb-8">Welcome back. Sign in to manage your website.</p>

          <label htmlFor="login-user" className={labelClass}>Username</label>
          <input id="login-user" autoComplete="username" value={username} onChange={(e) => setUsername(e.target.value)} className={`${inputClass} mb-4`} autoFocus />
          <label htmlFor="login-pass" className={labelClass}>Password</label>
          <input id="login-pass" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} />
          {error && <p className="text-sm font-medium text-red-600 mt-3" role="alert">{error}</p>}

          <button type="submit" className={`${btn.primary} w-full mt-6 py-3`}>
            <Lock className="w-4 h-4" /> Sign in
          </button>

          <p className="mt-8 text-xs text-slate-500 leading-relaxed border-l-2 border-amber-400 pl-3">
            <strong className="text-brand-navy">Demo mode.</strong> Changes are saved only in this browser and don't affect the live website. This login is for demonstration and isn't secure.
          </p>
        </form>
      </div>
    </div>
  );
};

// ------------------------------------------------------------------ Shell

export const AdminApp: React.FC = () => {
  const [signedIn, setSignedIn] = useState(isSignedIn);
  const [page, setPage] = useState<Page>(pageFromHash);
  const [dirty, setDirty] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState('');

  const notify = useCallback((message: string) => setToast(message), []);
  const onDirtyChange = useCallback((d: boolean) => setDirty(d), []);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(''), 3500);
    return () => window.clearTimeout(t);
  }, [toast]);

  // Follow links like admin/#vehicles and the browser's back/forward buttons
  useEffect(() => {
    const onHash = () => setPage(pageFromHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // Warn before closing the tab with unsaved edits
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const go = (next: Page) => {
    if (next === page) return setMenuOpen(false);
    if (dirty && !window.confirm('You have unsaved changes. Leave this page and lose them?')) return;
    setDirty(false);
    setPage(next);
    setMenuOpen(false);
    window.history.replaceState(null, '', next === 'dashboard' ? window.location.pathname : `#${next}`);
    window.scrollTo(0, 0);
  };

  if (!signedIn) return <Login onSignedIn={() => setSignedIn(true)} />;

  const current = sections.find((s) => s.key === page);

  const navItem = (key: Page, label: string, Icon: React.ElementType) => {
    const active = page === key;
    return (
      <button
        key={key}
        type="button"
        onClick={() => go(key)}
        aria-current={active ? 'page' : undefined}
        className={`relative w-full flex items-center gap-3 pl-4 pr-3 py-2 rounded-brand text-sm font-medium transition-colors ${
          active ? 'bg-white/[0.08] text-white' : 'text-slate-400 hover:bg-white/[0.04] hover:text-white'
        }`}
      >
        {active && <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r bg-brand-gold" />}
        <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-brand-gold' : ''}`} />
        {label}
      </button>
    );
  };

  const sidebar = (
    <nav className="relative flex flex-col h-full overflow-hidden" aria-label="Admin">
      <KonarkWheel strokeWidth={0.7} className="absolute -left-20 -bottom-20 w-64 h-64 text-brand-gold/[0.06] pointer-events-none" />
      <div className="relative flex items-center gap-3 px-2 pb-5 mb-3 border-b border-white/10">
        <BrandBadge />
        <div>
          <p className="font-display font-bold text-white leading-tight">Gitanjali Tours</p>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-gold/90">Admin</p>
        </div>
      </div>
      <div className="relative space-y-0.5 flex-1 overflow-y-auto">
        {navItem('dashboard', 'Dashboard', LayoutDashboard)}
        {sectionGroups.map((group) => (
          <div key={group}>
            <p className="px-4 pt-5 pb-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">{group}</p>
            {sections.filter((s) => s.group === group).map((s) => navItem(s.key, s.label, s.icon))}
          </div>
        ))}
      </div>
      <div className="relative pt-3 mt-3 border-t border-white/10">
        <button type="button" onClick={() => { if (!dirty || window.confirm('Sign out and lose unsaved changes?')) { signOut(); setSignedIn(false); } }}
          className="w-full flex items-center gap-3 pl-4 pr-3 py-2 rounded-brand text-sm font-medium text-slate-400 hover:bg-white/[0.04] hover:text-white">
          <LogOut className="w-4 h-4" /> Sign out
        </button>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-brand-ivory lg:flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 bg-brand-navy px-3 py-5 sticky top-0 h-screen">{sidebar}</aside>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-brand-navy/60 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-brand-navy px-3 py-5 shadow-2xl">
            <button type="button" onClick={() => setMenuOpen(false)} className="absolute top-5 right-4 z-10 p-1 text-slate-300" aria-label="Close menu">
              <X className="w-5 h-5" />
            </button>
            {sidebar}
          </aside>
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <div className="sticky top-0 z-20 h-14 flex items-center gap-3 px-4 sm:px-8 bg-white/90 backdrop-blur border-b border-brand-line">
          <button type="button" onClick={() => setMenuOpen(true)} className="lg:hidden -ml-1 p-2 text-brand-navy" aria-label="Open menu">
            <Menu className="w-5 h-5" />
          </button>
          <p className="flex items-center gap-1.5 text-sm text-slate-500 min-w-0">
            <span className="hidden sm:inline">Admin</span>
            <ChevronRight className="hidden sm:inline w-3.5 h-3.5" />
            <span className="font-semibold text-brand-navy truncate">{current?.label ?? 'Dashboard'}</span>
          </p>
          <div className="ml-auto flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-[11px] font-semibold text-amber-800"
              title="Changes are saved only in this browser. Customers keep seeing the published website.">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Demo · saved in this browser
            </span>
            <a href={import.meta.env.BASE_URL} target="_blank" rel="noopener noreferrer" className={`${btn.secondary} !py-1.5`}>
              <ExternalLink className="w-3.5 h-3.5" /> <span className="hidden sm:inline">View website</span>
            </a>
          </div>
        </div>

        <main className="flex-1 px-4 sm:px-8 py-8 max-w-6xl w-full">
          {current ? (
            <SectionEditor key={current.key} def={current} onDirtyChange={onDirtyChange} notify={notify} />
          ) : (
            <Dashboard onOpen={go} notify={notify} />
          )}
        </main>
      </div>

      {toast && (
        <div className="fixed top-16 right-4 sm:right-8 z-50 flex items-center gap-2.5 pl-3 pr-4 py-3 bg-white border border-brand-line text-sm text-brand-navy rounded-brand-lg shadow-dropdown animate-fadeIn" role="status">
          <CheckCircle2 className="w-5 h-5 text-green-600" /> {toast}
        </div>
      )}
    </div>
  );
};
