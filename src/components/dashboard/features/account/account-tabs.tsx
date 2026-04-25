'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Activity,
  BarChart3,
  Calendar,
  CheckCircle2,
  ClipboardList,
  Clock,
  ListChecks,
  Mail,
  Phone,
  Settings,
  Target,
  TrendingUp,
  User as UserIcon,
} from 'lucide-react';
import { Card, CardContent } from '@amdlre/design-system';

import { StatCard } from '@/components/dashboard/shared/stat-card';
import { AccountSettingsForm } from './account-settings-form';
import { AppearanceSection } from './appearance-section';

import type { AccountProfile, AccountTaskActivity } from '@/lib/api/dashboard/account';

type Tab = 'overview' | 'tasks' | 'stats' | 'settings';

interface Props {
  profile: AccountProfile;
  tasks: AccountTaskActivity[];
  locale: string;
}

function formatDate(value: string | null, locale: string): string {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return value;
  }
}

function formatDateTime(value: string | null, locale: string): string {
  if (!value) return '—';
  try {
    return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(value));
  } catch {
    return value;
  }
}

export function AccountTabs({ profile, tasks, locale }: Props) {
  const t = useTranslations('dashboard.account');
  const [tab, setTab] = useState<Tab>('overview');

  const tabs: Array<{ id: Tab; label: string; icon: React.ReactNode }> = useMemo(
    () => [
      { id: 'overview', label: t('tabs.overview'), icon: <UserIcon className="h-4 w-4" /> },
      { id: 'tasks', label: t('tabs.tasks'), icon: <ClipboardList className="h-4 w-4" /> },
      { id: 'stats', label: t('tabs.stats'), icon: <BarChart3 className="h-4 w-4" /> },
      { id: 'settings', label: t('tabs.settings'), icon: <Settings className="h-4 w-4" /> },
    ],
    [t],
  );

  return (
    <div className="space-y-6">
      <Card className="border-neutral-dashboard-border">
        <CardContent className="flex items-center gap-4 p-5">
          <div className="bg-dashboard-primary-50 text-dashboard-primary-600 border-dashboard-primary-100 flex h-14 w-14 items-center justify-center rounded-full border text-xl font-bold">
            {profile.fullName.charAt(0) || profile.username.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h2 className="text-neutral-dashboard-text text-base font-bold">{profile.fullName}</h2>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <span className="text-neutral-dashboard-muted font-mono text-xs">
                @{profile.username}
              </span>
              <span className="border-neutral-dashboard-border rounded-full border bg-slate-50 px-2 py-0.5 text-[10px] text-slate-600">
                {profile.roleLabel}
              </span>
              <span
                className={`flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] ${profile.isActive
                    ? 'border-emerald-100 bg-emerald-50 text-emerald-700'
                    : 'border-slate-200 bg-slate-50 text-slate-500'
                  }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${profile.isActive ? 'bg-emerald-500' : 'bg-slate-400'
                    }`}
                />
                {profile.isActive ? t('active') : t('inactive')}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <nav className="border-neutral-dashboard-border flex flex-wrap gap-1 border-b">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`-mb-px flex items-center gap-2 border-b-2 px-3 py-2 text-sm font-medium transition-colors ${tab === item.id
                ? 'border-dashboard-primary-600 text-dashboard-primary-600'
                : 'text-neutral-dashboard-muted hover:text-neutral-dashboard-text border-transparent'
              }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>

      {tab === 'overview' ? (
        <OverviewTab profile={profile} tasks={tasks} locale={locale} />
      ) : tab === 'tasks' ? (
        <TasksTab tasks={tasks} locale={locale} />
      ) : tab === 'stats' ? (
        <StatsTab profile={profile} />
      ) : (
        <div className="space-y-6">
          <AppearanceSection />
          <AccountSettingsForm />
        </div>
      )}
    </div>
  );
}

function OverviewTab({
  profile,
  tasks,
  locale,
}: {
  profile: AccountProfile;
  tasks: AccountTaskActivity[];
  locale: string;
}) {
  const t = useTranslations('dashboard.account');
  const recent = (profile.recentActivities.length ? profile.recentActivities : tasks).slice(0, 5);

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <Card className="border-neutral-dashboard-border">
        <CardContent className="p-5">
          <header className="mb-4 flex items-center gap-2">
            <UserIcon className="text-neutral-dashboard-muted h-4 w-4" />
            <h3 className="text-neutral-dashboard-text text-sm font-bold">{t('personalInfo')}</h3>
          </header>
          <dl className="divide-neutral-dashboard-border divide-y text-sm">
            <InfoRow label={t('fullName')} value={profile.fullName} />
            <InfoRow
              label={t('username')}
              value={`@${profile.username}`}
              valueClassName="font-mono text-xs"
            />
            <InfoRow
              label={t('email')}
              value={profile.email}
              icon={<Mail className="h-3 w-3" />}
            />
            <InfoRow
              label={t('phone')}
              value={profile.phone || t('noPhone')}
              icon={<Phone className="h-3 w-3" />}
            />
            <InfoRow label={t('role')} value={profile.roleLabel} />
            <InfoRow
              label={t('joinedAt')}
              value={formatDate(profile.createdAt, locale)}
              icon={<Calendar className="h-3 w-3" />}
            />
          </dl>
        </CardContent>
      </Card>

      <Card className="border-neutral-dashboard-border">
        <CardContent className="p-5">
          <header className="mb-4 flex items-center gap-2">
            <Activity className="text-neutral-dashboard-muted h-4 w-4" />
            <h3 className="text-neutral-dashboard-text text-sm font-bold">
              {t('recentActivities')}
            </h3>
          </header>
          {recent.length === 0 ? (
            <p className="text-neutral-dashboard-muted py-6 text-center text-sm">
              {t('noActivities')}
            </p>
          ) : (
            <ul className="space-y-2">
              {recent.map((a) => (
                <li
                  key={a.id}
                  className="border-neutral-dashboard-border bg-neutral-dashboard-card flex items-center gap-3 rounded border p-2.5"
                >
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-500" />
                  <div className="min-w-0 flex-1">
                    <p className="text-neutral-dashboard-text truncate text-xs font-medium">
                      {a.title}
                    </p>
                    <p className="text-neutral-dashboard-muted text-[10px]">
                      {formatDateTime(a.createdAt, locale)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function TasksTab({ tasks, locale }: { tasks: AccountTaskActivity[]; locale: string }) {
  const t = useTranslations('dashboard.account');

  if (tasks.length === 0) {
    return (
      <Card className="border-neutral-dashboard-border">
        <CardContent className="p-12 text-center">
          <ListChecks className="mx-auto mb-2 h-12 w-12 text-slate-300" />
          <p className="text-neutral-dashboard-muted text-sm">{t('tasksEmpty')}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-neutral-dashboard-border">
      <CardContent className="p-0">
        <ul className="divide-neutral-dashboard-border divide-y">
          {tasks.map((a) => (
            <li key={a.id} className="flex items-center gap-3 p-3  ">
              <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-500" />
              <div className="min-w-0 flex-1">
                <p className="text-neutral-dashboard-text text-sm font-medium">{a.title}</p>
                {a.activityType ? (
                  <span className="text-neutral-dashboard-muted text-[10px]">
                    {a.activityType}
                  </span>
                ) : null}
              </div>
              <span className="text-neutral-dashboard-muted text-[10px]">
                {formatDateTime(a.createdAt, locale)}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function StatsTab({ profile }: { profile: AccountProfile }) {
  const t = useTranslations('dashboard.account');

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
        <StatCard
          label={t('stats.todayActivities')}
          value={profile.todayActivities}
          subtitle={t('stats.todayActivitiesSub')}
          icon={<Activity className="text-slate-300" />}
        />
        <StatCard
          label={t('stats.totalActivities')}
          value={profile.totalActivities}
          subtitle={t('stats.totalActivitiesSub')}
          icon={<ListChecks className="text-slate-300" />}
        />
        <StatCard
          label={t('stats.todayBooked')}
          value={profile.bookedTodayCount}
          icon={<Calendar className="text-slate-300" />}
        />
        <StatCard
          label={t('stats.targetProgress')}
          value={`${profile.progressPercent}%`}
          subtitle={t('stats.dailyTarget')}
          icon={<Target className="text-slate-300" />}
          valueTone={profile.progressPercent >= 100 ? 'success' : 'default'}
        />
      </div>

      <Card className="border-neutral-dashboard-border">
        <CardContent className="p-5">
          <header className="mb-4 flex items-center gap-2">
            <TrendingUp className="text-neutral-dashboard-muted h-4 w-4" />
            <h3 className="text-neutral-dashboard-text text-sm font-bold">
              {t('stats.dailyTarget')}
            </h3>
          </header>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-dashboard-muted">
                {t('stats.todayBooked')}
              </span>
              <span className="font-bold">
                {profile.bookedTodayCount} / {profile.dailyTarget || '—'}
              </span>
            </div>
            <div className="bg-neutral-dashboard-border h-2 w-full overflow-hidden rounded-full">
              <div
                className="bg-dashboard-primary-600 h-full rounded-full transition-all"
                style={{ width: `${Math.min(profile.progressPercent, 100)}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Card className="border-neutral-dashboard-border">
          <CardContent className="flex items-center gap-3 p-4">
            <Clock className="h-8 w-8 text-amber-400" />
            <div>
              <p className="text-neutral-dashboard-muted text-xs">{t('stats.pendingTasks')}</p>
              <p className="text-neutral-dashboard-text text-xl font-bold">
                {profile.pendingTasksCount}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-neutral-dashboard-border">
          <CardContent className="flex items-center gap-3 p-4">
            <CheckCircle2 className="h-8 w-8 text-emerald-500" />
            <div>
              <p className="text-neutral-dashboard-muted text-xs">{t('stats.completedTasks')}</p>
              <p className="text-neutral-dashboard-text text-xl font-bold">
                {profile.totalActivities}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function InfoRow({
  label,
  value,
  icon,
  valueClassName,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <dt className="text-neutral-dashboard-muted flex items-center gap-2 text-xs">
        {icon}
        {label}
      </dt>
      <dd
        className={`text-neutral-dashboard-text text-sm font-medium ${valueClassName ?? ''}`}
      >
        {value}
      </dd>
    </div>
  );
}
