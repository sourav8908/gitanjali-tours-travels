import React from 'react';
import { Info } from 'lucide-react';

interface NoticeProps {
  title: string;
  children: React.ReactNode;
  tone?: 'info' | 'neutral';
  /**
   * Data file the site owner edits to change this content. Shown only in
   * development so visitors never see source paths.
   */
  editHint?: string;
}

const toneStyles = {
  info: {
    box: 'bg-blue-50/80 border-blue-200/80 text-blue-900',
    icon: 'text-blue-700',
    code: 'bg-blue-100 text-blue-950',
  },
  neutral: {
    box: 'bg-slate-50 border-slate-200 text-slate-700',
    icon: 'text-brand-ocean',
    code: 'bg-slate-200 text-slate-800',
  },
};

export const Notice: React.FC<NoticeProps> = ({ title, children, tone = 'neutral', editHint }) => {
  const styles = toneStyles[tone];

  return (
    <div className={`mb-8 p-3.5 border rounded-brand text-xs flex items-start sm:items-center gap-2.5 ${styles.box}`}>
      <Info className={`w-4 h-4 shrink-0 mt-0.5 sm:mt-0 ${styles.icon}`} />
      <span>
        <strong>{title}:</strong> {children}
        {import.meta.env.DEV && editHint && (
          <>
            {' '}(Editable in <code className={`font-mono px-1 py-0.5 rounded ${styles.code}`}>{editHint}</code>).
          </>
        )}
      </span>
    </div>
  );
};
