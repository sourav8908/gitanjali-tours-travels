import React, { useState } from 'react';
import { Pencil, RotateCcw, X } from 'lucide-react';
import { hasDemoEdits, resetAllDemoEdits } from '../../content/store';

/**
 * Shown only in a browser that has demo edits from the admin panel, so the
 * owner never mistakes their local preview for the live site.
 */
export const DemoEditsPill: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);
  if (!hasDemoEdits || dismissed) return null;

  const reset = () => {
    if (window.confirm('Remove all demo edits in this browser and show the published website?')) {
      resetAllDemoEdits();
      window.location.reload();
    }
  };

  return (
    <div className="fixed left-4 bottom-20 md:bottom-6 z-40 flex items-center gap-1 pl-3 pr-1 py-1 bg-amber-100 border border-amber-300 text-amber-900 text-xs font-semibold rounded-full shadow-lg">
      <span>Demo edits active (this browser only)</span>
      <a href={`${import.meta.env.BASE_URL}admin/`} className="p-1.5 rounded-full hover:bg-amber-200" aria-label="Open admin">
        <Pencil className="w-3.5 h-3.5" />
      </a>
      <button type="button" onClick={reset} className="p-1.5 rounded-full hover:bg-amber-200" aria-label="Reset demo edits">
        <RotateCcw className="w-3.5 h-3.5" />
      </button>
      <button type="button" onClick={() => setDismissed(true)} className="p-1.5 rounded-full hover:bg-amber-200" aria-label="Hide this notice">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
