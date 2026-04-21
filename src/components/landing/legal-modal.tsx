'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

interface LegalModalProps {
  isOpen: boolean;
  type: 'terms' | 'privacy' | null;
  onClose: () => void;
}

const LegalModal = ({ isOpen, type, onClose }: LegalModalProps) => {
  const [animate, setAnimate] = useState(false);
  const t = useTranslations('landing.legal');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => setAnimate(true), 10);
    } else {
      setAnimate(false);
      setTimeout(() => {
        document.body.style.overflow = 'unset';
      }, 300);
    }
  }, [isOpen]);

  if (!isOpen && !animate) return null;

  const content = {
    terms: {
      title: t('termsTitle'),
      body: (
        <div className="space-y-6 text-sm leading-relaxed text-muted-foreground md:text-base">
          <div className="mb-6 rounded-xl border border-amber-100 bg-amber-50 p-4">
            <h4 className="mb-2 font-bold text-amber-800">{t('importantNote')}</h4>
            <p className="text-sm text-amber-700">
              {t('importantNoteDesc')}
            </p>
          </div>

          <div>
            <h4 className="mb-2 font-bold text-foreground">{t('terms1Title')}</h4>
            <ul className="mr-2 list-inside list-disc space-y-1">
              <li>{t('terms1Item1')}</li>
              <li>{t('terms1Item2')}</li>
              <li>{t('terms1Item3')}</li>
            </ul>
          </div>

          <div>
            <h4 className="mb-2 font-bold text-foreground">{t('terms2Title')}</h4>
            <ul className="mr-2 list-inside list-disc space-y-1">
              <li>{t('terms2Item1')}</li>
              <li>{t('terms2Item2')}</li>
              <li>{t('terms2Item3')}</li>
            </ul>
          </div>

          <div>
            <h4 className="mb-2 font-bold text-foreground">{t('terms3Title')}</h4>
            <p className="mb-2">
              {t('terms3Intro')}
            </p>
            <ul className="mr-2 list-inside list-disc space-y-1">
              <li>{t('terms3Item1')}</li>
              <li>{t('terms3Item2')}</li>
              <li>{t('terms3Item3')}</li>
            </ul>
            <p className="mt-2 text-xs text-muted-foreground">{t('terms3Note')}</p>
          </div>

          <div>
            <h4 className="mb-2 font-bold text-foreground">{t('terms4Title')}</h4>
            <ul className="mr-2 list-inside list-disc space-y-1">
              <li>{t('terms4Item1')}</li>
              <li>{t('terms4Item2')}</li>
              <li>{t('terms4Item3')}</li>
            </ul>
          </div>
        </div>
      ),
    },
    privacy: {
      title: t('privacyTitle'),
      body: (
        <div className="space-y-6 text-sm leading-relaxed text-muted-foreground md:text-base">
          <p>
            {t('privacyIntro')}
          </p>

          <div>
            <h4 className="mb-2 font-bold text-foreground">{t('privacyCollectTitle')}</h4>
            <p>
              {t('privacyCollectDesc')}
            </p>
          </div>

          <div>
            <h4 className="mb-2 font-bold text-foreground">{t('privacyUseTitle')}</h4>
            <p>
              {t('privacyUseDesc')}
            </p>
          </div>

          <div>
            <h4 className="mb-2 font-bold text-foreground">{t('privacyShareTitle')}</h4>
            <p>
              {t('privacyShareDesc')}
            </p>
          </div>
        </div>
      ),
    },
  };

  const selectedContent = type ? content[type] : { title: '', body: null };

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 ${isOpen ? 'visible' : 'invisible'}`}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-foreground/60 backdrop-blur-sm transition-opacity duration-300 ${animate ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div
        className={`relative flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl transition-all duration-500 ${
          animate ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-10 scale-95 opacity-0'
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-white p-6 md:p-8">
          <h3 className="text-xl font-black text-foreground md:text-2xl">{selectedContent.title}</h3>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-border"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-6 md:p-8">{selectedContent.body}</div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-border bg-muted p-6">
          <button
            onClick={onClose}
            className="rounded-xl border border-border px-6 py-2.5 font-bold text-muted-foreground transition-colors hover:bg-white"
          >
            {t('close')}
          </button>
          {type === 'terms' && (
            <button
              onClick={() => {
                onClose();
                document.getElementById('owners')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="rounded-xl bg-foreground px-6 py-2.5 font-bold text-white shadow-lg shadow-foreground/10 transition-colors hover:bg-primary"
            >
              {t('agreeStart')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LegalModal;
