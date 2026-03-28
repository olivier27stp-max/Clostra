'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname, Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils/cn';
import {
  LayoutDashboard,
  Map,
  GitBranch,
  Award,
  MessageSquare,
  DollarSign,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Mail,
} from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { ClostraLogomark } from '@/components/ui/clostra-logo';

interface NavItem {
  key: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { key: 'dashboard', href: '/dashboard', icon: LayoutDashboard },
  { key: 'map', href: '/map', icon: Map },
  { key: 'pipeline', href: '/pipeline', icon: GitBranch },
  { key: 'leaderboard', href: '/leaderboard', icon: Award },
  { key: 'feed', href: '/feed', icon: MessageSquare },
  { key: 'commissions', href: '/commissions', icon: DollarSign },
  { key: 'reports', href: '/reports', icon: BarChart3 },
  { key: 'settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <aside
      className={cn(
        'relative flex h-full flex-col border-r border-[#1E2430] bg-[#121620] transition-all duration-200',
        collapsed ? 'w-[var(--sidebar-collapsed-width)]' : 'w-[var(--sidebar-width)]'
      )}
    >
      {/* Logo */}
      <div className="flex h-14 items-center gap-2.5 border-b border-[#1E2430] px-4">
        <ClostraLogomark />
        {!collapsed && (
          <span className="text-sm font-semibold tracking-tight text-white">Clostra</span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 py-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.key}
              href={item.href}
              className={cn(
                'group flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors duration-150',
                active
                  ? 'bg-white/10 text-white'
                  : 'text-[#8B95A5] hover:bg-white/5 hover:text-white'
              )}
            >
              <Icon className={cn('h-4 w-4 shrink-0', active ? 'text-white' : 'text-[#5A6478] group-hover:text-[#8B95A5]')} />
              {!collapsed && <span>{t(item.key)}</span>}
            </Link>
          );
        })}

        {/* Messages */}
        <Link
          href="/messages"
          className={cn(
            'group flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors duration-150',
            isActive('/messages') ? 'bg-white/10 text-white' : 'text-[#8B95A5] hover:bg-white/5 hover:text-white'
          )}
        >
          <div className="relative shrink-0">
            <Mail className={cn('h-4 w-4', isActive('/messages') ? 'text-white' : 'text-[#5A6478] group-hover:text-[#8B95A5]')} />
            <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-error text-[8px] font-bold text-white">3</span>
          </div>
          {!collapsed && <span>{t('messages')}</span>}
        </Link>
      </nav>

      {/* User */}
      <div className="relative border-t border-[#1E2430] p-2">
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 transition-colors hover:bg-white/5"
        >
          <Avatar name="Alex Martin" size="sm" />
          {!collapsed && (
            <div className="flex-1 text-left">
              <p className="text-[13px] font-medium text-white">Alex Martin</p>
              <p className="text-[11px] text-[#5A6478]">Sales Rep</p>
            </div>
          )}
        </button>

        {showUserMenu && !collapsed && (
          <div className="absolute bottom-full left-2 right-2 mb-1 rounded-lg border border-[#1E2430] bg-[#1A1F2E] p-1 shadow-xl">
            <Link
              href="/settings"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-xs text-[#8B95A5] transition-colors hover:bg-white/5 hover:text-white"
              onClick={() => setShowUserMenu(false)}
            >
              <Settings className="h-3.5 w-3.5" />
              {t('settings')}
            </Link>
            <button
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs text-red-400 transition-colors hover:bg-white/5"
              onClick={() => setShowUserMenu(false)}
            >
              <LogOut className="h-3.5 w-3.5" />
              {t('logout')}
            </button>
          </div>
        )}
      </div>

      {/* Collapse */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-[4.5rem] flex h-6 w-6 items-center justify-center rounded-full border border-border-subtle bg-white text-text-muted shadow-sm transition-colors hover:bg-surface-elevated hover:text-text-secondary"
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </button>
    </aside>
  );
}
