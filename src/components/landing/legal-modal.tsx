'use client';

import { useTranslations, useLocale } from 'next-intl';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  ScrollArea,
  FullHTML,
} from '@amdlre/design-system';

interface LegalModalProps {
  isOpen: boolean;
  type: 'terms' | 'privacy' | null;
  onClose: () => void;
}

const LegalModal = ({ isOpen, type, onClose }: LegalModalProps) => {
  const t = useTranslations('landing.legal');
  const locale = useLocale();
  const direction = locale === 'ar' ? 'rtl' : 'ltr';

  const content = {
    terms: { title: t('termsTitle'), html: t.raw('termsHtml') as string },
    privacy: { title: t('privacyTitle'), html: t.raw('privacyHtml') as string },
  };

  const selected = type ? content[type] : { title: '', html: '' };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-hidden rounded-3xl p-0">
        <DialogHeader className="border-b border-border p-6 md:p-8">
          <DialogTitle className="text-xl font-black md:text-2xl">{selected.title}</DialogTitle>
          <DialogDescription className="sr-only">{selected.title}</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[50vh]">
          <div className="p-6 md:p-8">
            <FullHTML html={selected.html} direction={direction} />
          </div>
        </ScrollArea>

        <DialogFooter className="gap-3 border-t border-border bg-muted p-6">
          <Button
            variant="outline"
            onClick={onClose}
            className="rounded-xl px-6 font-bold"
          >
            {t('close')}
          </Button>
          {type === 'terms' && (
            <Button
              onClick={() => {
                onClose();
                document.getElementById('owners')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="rounded-xl bg-foreground px-6 font-bold text-white shadow-lg shadow-foreground/10 hover:bg-primary"
            >
              {t('agreeStart')}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LegalModal;
