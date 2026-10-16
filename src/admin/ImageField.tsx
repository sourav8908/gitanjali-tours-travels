import React, { useRef, useState } from 'react';
import { Upload, Images, X, ImageOff } from 'lucide-react';
import { asset } from '../utils/asset';
import { defaultContent } from '../content/defaults';
import { btn } from './styles';

/** Every photo already used on the published site, for the picker. */
const siteImages = [
  ...new Set(
    [
      ...defaultContent.destinations.flatMap((d) => [d.image, d.heroImage]),
      ...defaultContent.vehicles.map((v) => v.image),
      ...defaultContent.tours.map((t) => t.image),
      ...defaultContent.photoCredits.map((c) => c.image),
    ].filter((src): src is string => Boolean(src))
  ),
];

const MAX_SIDE = 1280;

/**
 * Resize an uploaded photo and encode it as a compact data URL, so it fits in
 * browser storage (demo mode keeps uploads in localStorage, ~5 MB in total).
 */
async function toCompactDataUrl(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const webp = canvas.toDataURL('image/webp', 0.78);
  // Browsers without WebP encoding return PNG; JPEG is much smaller then
  return webp.startsWith('data:image/webp') ? webp : canvas.toDataURL('image/jpeg', 0.8);
}

const kb = (dataUrl: string) => Math.round((dataUrl.length * 3) / 4 / 1024);

interface ImageFieldProps {
  value: string;
  onChange: (value: string) => void;
  optional?: boolean;
}

export const ImageField: React.FC<ImageFieldProps> = ({ value, onChange, optional }) => {
  const fileInput = useRef<HTMLInputElement | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file (JPG, PNG or WebP).');
      return;
    }
    setBusy(true);
    setError('');
    try {
      onChange(await toCompactDataUrl(file));
      setShowPicker(false);
    } catch {
      setError("Couldn't read that image. Try a JPG or PNG.");
    } finally {
      setBusy(false);
      if (fileInput.current) fileInput.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
        <div className="w-full sm:w-48 aspect-[16/10] rounded-brand overflow-hidden bg-brand-ivory border border-brand-line flex items-center justify-center shrink-0">
          {value ? (
            <img src={asset(value)} alt="" className="w-full h-full object-cover" />
          ) : (
            <ImageOff className="w-7 h-7 text-slate-300" aria-hidden="true" />
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className={btn.secondary} onClick={() => fileInput.current?.click()} disabled={busy}>
            <Upload className="w-4 h-4" />
            {busy ? 'Processing…' : 'Upload photo'}
          </button>
          <button type="button" className={btn.secondary} onClick={() => setShowPicker((s) => !s)}>
            <Images className="w-4 h-4" />
            Choose from site
          </button>
          {optional && value && (
            <button type="button" className={btn.danger} onClick={() => onChange('')}>
              <X className="w-4 h-4" /> Remove
            </button>
          )}
          <input ref={fileInput} type="file" accept="image/*" className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])} />
        </div>
      </div>

      {value.startsWith('data:') && (
        <p className="text-xs text-slate-500">Uploaded photo · {kb(value)} KB · stored in this browser only (demo).</p>
      )}
      {error && <p className="text-xs text-red-600" role="alert">{error}</p>}

      {showPicker && (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 p-3 bg-brand-ivory rounded-brand border border-brand-line max-h-64 overflow-y-auto">
          {siteImages.map((src) => (
            <button
              key={src}
              type="button"
              onClick={() => { onChange(src); setShowPicker(false); }}
              className={`aspect-[4/3] rounded overflow-hidden border-2 transition-colors ${
                src === value ? 'border-brand-gold ring-2 ring-brand-gold/30' : 'border-transparent hover:border-brand-gold'
              }`}
              aria-label={`Use ${src.split('/').pop()}`}
            >
              <img src={asset(src)} alt="" loading="lazy" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
