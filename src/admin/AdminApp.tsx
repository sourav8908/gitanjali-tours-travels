import React, { useCallback, useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle2, ExternalLink, LayoutDashboard, Lock, LogOut, Menu, X } from 'lucide-react';
import { BrandBadge } from '../components/ui/BrandBadge';
import { KonarkWheel } from '../components/ui/KonarkWheel';
import type { ContentKey } from '../types';
import { isSignedIn, signIn, signOut } from './auth';
import { Dashboard } from './Dashboard';
import { SectionEditor } from './SectionEditor';
import { sections } from './sections';
import { btn, inputClass } from './styles';

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
    <div className="min-h-screen bg-brand-navy flex items-center justify-center p-4 relative overflow-hidden">
      <KonarkWheel strokeWidth={0.6} className="absolute -right-32 -bottom-32 w-[520px] h-[520px] text-brand-gold/10" />
      <form onSubmit={submit} className="relative w-full max-w-sm bg-white rounded-brand-lg shadow-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <BrandBadge />
          <div>
            <p className="font-display font-bold text-lg text-brand-navy leading-tight">Gitanjali Tours</p>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-sandstone">Admin</p>
          </div>
        </div>

        <label htmlFor="login-user" className="block text-sm font-semibold text-slate-700 mb-1.5">Username</label>
        <input id="login-user" autoComplete="username" value={username} onChange={(e) => setUsername(e.target.value)} className={`${inputClass} mb-4`} autoFocus />
        <label htmlFor="login-pass" className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
        <input id="login-pass" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} />
        {error && <p className="text-sm text-red-600 mt-3" role="alert">{error}</p>}

        <button type="submit" className={`${btn.primary} w-full mt-6 py-3`}>
          <Lock className="w-4 h-4" /> Sign in
        </button>

        <p className="mt-6 text-xs text-slate-500 leading-relaxed bg-amber-50 border border-amber-200 rounded-brand p-3">
          <strong className="text-amber-900">Demo mode.</strong> Changes are saved only in this browser and don't affect the live website. This login is for demonstration and isn't secure.
        </p>
      </form>
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
  const navItem = (key: Page, label: string, Icon: React.ElementType) => (
    <button
      key={key}
      type="button"
      onClick={() => go(key)}
      aria-current={page === key ? 'page' : undefined}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-brand text-sm font-medium transition-colors ${
        page === key ? 'bg-white/10 text-brand-gold' : 'text-slate-300 hover:bg-white/5 hover:text-white'
      }`}
    >
      <Icon className="w-4 h-4 shrink-0" />
      {label}
    </button>
  );

  const sidebar = (
    <nav className="flex flex-col h-full" aria-label="Admin">
      <div className="flex items-center gap-3 px-2 pb-5 mb-4 border-b border-white/10">
        <BrandBadge />
        <div>
          <p className="font-display font-bold text-white leading-tight">Gitanjali Tours</p>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-brand-gold/90">Admin · Demo</p>
        </div>
      </div>
      <div className="space-y-1 flex-1 overflow-y-auto">
        {navItem('dashboard', 'Dashboard', LayoutDashboard)}
        <p className="px-3 pt-4 pb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Content</p>
        {sections.map((s) => navItem(s.key, s.label, s.icon))}
      </div>
      <div className="pt-4 mt-4 border-t border-white/10 space-y-1">
        <a href={import.meta.env.BASE_URL} target="_blank" rel="noopener noreferrer"
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-brand text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white">
          <ExternalLink className="w-4 h-4" /> View website
        </a>
        <button type="button" onClick={() => { if (!dirty || window.confirm('Sign out and lose unsaved changes?')) { signOut(); setSignedIn(false); } }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-brand text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white">
          <LogOut className="w-4 h-4" /> Sign out
        </button>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen lg:flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 bg-brand-navy p-4 sticky top-0 h-screen">{sidebar}</aside>

      {/* Mobile top bar + drawer */}
      <div className="lg:hidden sticky top-0 z-30 bg-brand-navy flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <BrandBadge />
          <span className="font-display font-bold text-white">Admin</span>
        </div>
        <button type="button" onClick={() => setMenuOpen(true)} className="p-2 text-white" aria-label="Open menu">
          <Menu className="w-6 h-6" />
        </button>
      </div>
      {menuOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-brand-navy/70" onClick={() => setMenuOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-brand-navy p-4">
            <button type="button" onClick={() => setMenuOpen(false)} className="absolute top-4 right-4 p-1 text-slate-300" aria-label="Close menu">
              <X className="w-5 h-5" />
            </button>
            {sidebar}
          </aside>
        </div>
      )}

      <main className="flex-1 min-w-0 px-4 sm:px-8 pb-16">
        <div className="mt-4 mb-6 flex items-start gap-2.5 p-3 bg-amber-50 border border-amber-200 rounded-brand text-sm text-amber-900">
          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-amber-600" />
          <p><strong>Demo mode:</strong> changes are saved only in this browser. Customers keep seeing the published website.</p>
        </div>

        <header className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-brand-navy">{current?.label ?? 'Dashboard'}</h1>
          <p className="text-sm text-slate-500 mt-1">{current?.description ?? 'Overview of your website content.'}</p>
        </header>

        {current ? (
          <SectionEditor key={current.key} def={current} onDirtyChange={onDirtyChange} notify={notify} />
        ) : (
          <Dashboard onOpen={go} notify={notify} />
        )}
      </main>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-3 bg-brand-navy text-white text-sm rounded-brand shadow-2xl animate-fadeIn" role="status">
          <CheckCircle2 className="w-4 h-4 text-green-400" /> {toast}
        </div>
      )}
    </div>
  );
};
