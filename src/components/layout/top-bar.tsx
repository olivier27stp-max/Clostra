'use client';

import { useTranslations } from 'next-intl';
import { usePathname, Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils/cn';
import { Search, Bell, Command } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { useState } from 'react';

const routeTitles: Record<string, string> = {
  '/dashboard': 'dashboard',
  '/map': 'map',
  '/leads': 'leads',
  '/pipeline': 'pipeline',
  '/calendar': 'calendar',
  '/leaderboard': 'leaderboard',
  '/teams': 'teams',
  '/feed': 'feed',
  '/commissions': 'commissions',
  '/reports': 'reports',
  '/settings': 'settings',
  '/messages': 'messages',
};

export function TopBar() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [showNotifications, setShowNotifications] = useState(false);

  const currentRoute = Object.keys(routeTitles).find(
    (route) => pathname === route || pathname.startsWith(route + '/')
  );
  const pageTitle = currentRoute ? t(routeTitles[currentRoute]) : '';

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border-subtle bg-white px-6">
      <h1 className="text-sm font-semibold text-text-primary">{pageTitle}</h1>

      <div className="flex items-center gap-2">
        {/* Search */}
        <button className="flex items-center gap-2 rounded-lg border border-border-subtle bg-surface-elevated px-3 py-1.5 text-xs text-text-muted transition-colors hover:border-border hover:text-text-secondary">
          <Search className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Search...</span>
          <kbd className="ml-2 hidden rounded border border-border-subtle bg-white px-1 py-0.5 font-mono text-[10px] text-text-muted sm:inline-block">
            <Command className="inline h-2.5 w-2.5" />K
          </kbd>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative flex h-8 w-8 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-surface-elevated hover:text-text-secondary"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-error" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-72 rounded-xl border border-border-subtle bg-white p-4 shadow-lg">
              <p className="text-sm font-semibold text-text-primary">Notifications</p>
              <p className="mt-2 text-xs text-text-muted">No new notifications</p>
            </div>
          )}
        </div>

        {/* Language */}
        <div className="flex items-center rounded-lg border border-border-subtle overflow-hidden">
          <Link href={pathname} locale="fr" className="px-2 py-1 text-[10px] font-medium text-text-muted transition-colors hover:bg-surface-elevated hover:text-text-secondary">FR</Link>
          <div className="h-4 w-px bg-border-subtle" />
          <Link href={pathname} locale="en" className="px-2 py-1 text-[10px] font-medium text-text-muted transition-colors hover:bg-surface-elevated hover:text-text-secondary">EN</Link>
        </div>

        {/* User */}
        <button className="rounded-lg p-1 transition-colors hover:bg-surface-elevated">
          <Avatar name="Alex Martin" size="sm" />
        </button>
      </div>
    </header>
  );
}
