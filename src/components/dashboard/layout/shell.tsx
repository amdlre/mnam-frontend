'use client';

import { useState } from 'react';

import { DashboardHeader } from './header';
import { DashboardMobileBottomNav } from './mobile-bottom-nav';
import { DashboardSidebar } from './sidebar';

import type { DashboardUser } from '@/types/dashboard';

interface ShellProps {
  user: DashboardUser;
  children: React.ReactNode;
}

export function DashboardShell({ user, children }: ShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="bg-neutral-dashboard-bg flex h-screen overflow-hidden font-sans">
      {sidebarOpen ? (
        <div
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}

      <div
        className={[
          'fixed inset-y-0 end-0 z-50 transform transition-transform duration-500 lg:relative lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0',
        ].join(' ')}
      >
        <DashboardSidebar role={user.role} onClose={() => setSidebarOpen(false)} />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardHeader user={user} onToggleSidebar={() => setSidebarOpen(true)} />
        <main className="custom-scrollbar flex-1 overflow-y-auto p-4 md:p-8 lg:p-12">
          <div className="mx-auto max-w-7xl space-y-8 pb-32 lg:pb-24">{children}</div>
        </main>
      </div>

      <DashboardMobileBottomNav role={user.role} onToggleSidebar={() => setSidebarOpen(true)} />
    </div>
  );
}
