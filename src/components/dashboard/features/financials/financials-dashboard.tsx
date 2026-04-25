import { getTranslations } from 'next-intl/server';

import { HeaderInfo } from '@/components/dashboard/shared/header-info';
import { fetchTeamAchievement } from '@/lib/api/dashboard/transactions';

import { FinancialsTabs } from './financials-tabs';

export async function FinancialsDashboard() {
  const [t, achievement] = await Promise.all([
    getTranslations('dashboard.financials'),
    fetchTeamAchievement(),
  ]);

  const data = {
    daily: {
      income: achievement.dailyChallenge.todayIncome,
      occupancy: achievement.dailyChallenge.unitOccupancy,
      nights: achievement.dailyChallenge.guestNights,
      cancellations: achievement.dailyChallenge.totalCancellations,
    },
    weekly: {
      income: achievement.weeklyPerformance.revenueCollection,
      occupancy: achievement.weeklyPerformance.weeklyOccupancyRate,
      nights: achievement.weeklyPerformance.totalNights,
      cancellations: achievement.weeklyPerformance.totalCancellations,
    },
    monthly: {
      income: achievement.monthlyHarvest.projectIncome,
      occupancy: achievement.monthlyHarvest.monthlyOccupancyRate,
      nights: achievement.monthlyHarvest.nightsSales,
      cancellations: achievement.monthlyHarvest.totalCancellations,
    },
  };

  return (
    <div className="space-y-6">
      <HeaderInfo title={t('title')} subtitle={t('subtitle')} />

      <FinancialsTabs
        data={data}
        labels={{
          tabs: {
            daily: t('tabs.daily'),
            weekly: t('tabs.weekly'),
            monthly: t('tabs.monthly'),
          },
          income: t('stats.income'),
          occupiedUnits: t('stats.occupiedUnits'),
          occupancy: t('stats.occupancy'),
          nights: t('stats.nights'),
          cancellations: t('stats.cancellations'),
          currency: t('currency'),
          exportTitle: t('exportTitle'),
          exportFormat: t('exportFormat'),
          exportLabels: {
            daily: t('exportDaily'),
            weekly: t('exportWeekly'),
            monthly: t('exportMonthly'),
          },
        }}
        pdfTitles={{
          daily: t('performance.daily'),
          weekly: t('performance.weekly'),
          monthly: t('performance.monthly'),
        }}
      />
    </div>
  );
}
