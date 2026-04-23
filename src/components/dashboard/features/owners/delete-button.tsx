'use client';

import { useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { Trash2 } from 'lucide-react';

import { useRouter } from '@/i18n/navigation';
import { useConfirm } from '@/components/shared/confirm-modal';
import { deleteOwnerAction } from '@/actions/dashboard/entities';

interface Props {
  ownerId: string;
  ownerName: string;
}

export function OwnerDeleteButton({ ownerId, ownerName }: Props) {
  const t = useTranslations('dashboard.ownerDetail');
  const router = useRouter();
  const confirm = useConfirm();
  const [isPending, startTransition] = useTransition();

  async function onClick() {
    const ok = await confirm({
      iconVariant: 'danger',
      title: t('deleteTitle'),
      description: t('deleteConfirm', { name: ownerName }),
      confirmLabel: t('deleteConfirmLabel'),
      cancelLabel: t('cancel'),
      confirmVariant: 'destructive',
    });
    if (!ok) return;
    startTransition(async () => {
      const result = await deleteOwnerAction(ownerId);
      if (!result.success) {
        await confirm({
          iconVariant: 'danger',
          title: t('deleteFailed'),
          description: result.message || t('deleteFailed'),
          confirmLabel: t('cancel'),
          cancelLabel: '',
        });
        return;
      }
      router.push('/dashboard/owners');
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isPending}
      className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 disabled:opacity-60"
    >
      <Trash2 className="h-4 w-4" />
      <span>{t('delete')}</span>
    </button>
  );
}
