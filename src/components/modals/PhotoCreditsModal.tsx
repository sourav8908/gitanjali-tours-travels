import React from 'react';
import { Modal } from '../ui/Modal';
import { photoCredits } from '../../data/photoCredits';
import { asset } from '../../utils/asset';

interface PhotoCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PhotoCreditsModal: React.FC<PhotoCreditsModalProps> = ({ isOpen, onClose }) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Photo Credits" maxWidth="max-w-2xl">
    <p className="text-sm text-slate-600 mb-4">
      Photos from Wikimedia Commons, used under their licences. Images were resized and converted to WebP for this website.
    </p>
    <ul className="divide-y divide-slate-100">
      {photoCredits.map((credit) => (
        <li key={credit.image} className="py-3 flex items-center gap-3">
          <img src={asset(credit.image)} alt="" loading="lazy" className="w-14 h-10 rounded object-cover shrink-0 bg-slate-100" />
          <div className="min-w-0 text-sm">
            <a href={credit.sourceUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-navy hover:text-brand-ocean">
              {credit.subject}
            </a>
            <p className="text-xs text-slate-500">
              by {credit.author} ·{' '}
              {credit.licenseUrl ? (
                <a href={credit.licenseUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-brand-ocean">
                  {credit.license}
                </a>
              ) : (
                credit.license
              )}
            </p>
          </div>
        </li>
      ))}
    </ul>
  </Modal>
);
