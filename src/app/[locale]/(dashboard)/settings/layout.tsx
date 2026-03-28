'use client';

import { usePathname } from '@/i18n/navigation';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils/cn';
import { Settings, Users, GitBranch, DollarSign, Calendar, Award, CreditCard, Globe } from 'lucide-react';

const tabs = [
  { href: '/settings/general', label: 'Général', icon: Settings },
  { href: '/settings/teams', label: 'Équipes', icon: Users },
  { href: '/settings/pipeline', label: 'Pipeline', icon: GitBranch },
  { href: '/settings/commissions', label: 'Commissions', icon: DollarSign },
  { href: '/settings/calendar', label: 'Calendrier', icon: Calendar },
  { href: '/settings/badges', label: 'Badges', icon: Award },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div>
      {/* Sub-nav */}
      <div className="-mx-6 -mt-6 mb-6 border-b border-border-subtle bg-surface">
        <div className="mx-auto max-w-3xl px-6">
          <nav className="flex gap-1 overflow-x-auto py-2">
            {tabs.map(({ href, label, icon: Icon }) => {
              const isActive = pathname.endsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-[12px] font-medium transition-colors',
                    isActive
                      ? 'bg-surface-elevated text-text-primary'
                      : 'text-text-muted hover:text-text-secondary hover:bg-surface-hover'
                  )}
                >
                  <Icon size={13} />
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {children}
    </div>
  );
}
