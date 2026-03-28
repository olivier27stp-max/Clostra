'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { StatCard } from '@/components/ui/stat-card';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { cn } from '@/lib/utils/cn';
import { Link } from '@/i18n/navigation';
import {
  TrendingUp,
  TrendingDown,
  ChevronRight,
  Flame,
  Crown,
  Medal,
  X,
} from 'lucide-react';

type Period = 'daily' | 'weekly' | 'monthly';

interface RepData {
  rank: number;
  name: string;
  closes: number;
  revenue: number;
  trend: number;
  streak: number;
}

const podiumData: RepData[] = [
  { rank: 1, name: 'Sarah Chen', closes: 8, revenue: 34200, trend: 15, streak: 5 },
  { rank: 2, name: 'Marcus Davis', closes: 6, revenue: 28800, trend: 8, streak: 3 },
  { rank: 3, name: 'Emily Rodriguez', closes: 5, revenue: 24500, trend: -3, streak: 0 },
];

const leaderboardData: RepData[] = [
  { rank: 4, name: 'Alex Martin', closes: 4, revenue: 19200, trend: 12, streak: 2 },
  { rank: 5, name: 'Jordan Kim', closes: 4, revenue: 17800, trend: -5, streak: 0 },
  { rank: 6, name: 'Taylor Brooks', closes: 3, revenue: 15400, trend: 22, streak: 4 },
  { rank: 7, name: 'Casey Morgan', closes: 3, revenue: 14100, trend: 0, streak: 0 },
  { rank: 8, name: 'Riley Thompson', closes: 2, revenue: 11600, trend: -8, streak: 0 },
  { rank: 9, name: 'Quinn Harris', closes: 2, revenue: 9800, trend: 5, streak: 1 },
  { rank: 10, name: 'Drew Patel', closes: 1, revenue: 5200, trend: -15, streak: 0 },
];

const repDetailKPIs = [
  { label: 'Doors Knocked', value: '156' },
  { label: 'Conversations', value: '42' },
  { label: 'Demos Set', value: '18' },
  { label: 'Demos Held', value: '15' },
  { label: 'Quotes Sent', value: '12' },
  { label: 'Closes', value: '8' },
  { label: 'Revenue', value: '$34,200' },
  { label: 'Conversion Rate', value: '19%' },
  { label: 'Avg Ticket', value: '$4,275' },
  { label: 'Follow-ups Done', value: '24' },
];

const rankColors: Record<number, { bg: string; text: string; icon: string }> = {
  1: { bg: 'bg-amber-50', text: 'text-amber-700', icon: 'text-amber-500' },
  2: { bg: 'bg-slate-50', text: 'text-slate-600', icon: 'text-slate-400' },
  3: { bg: 'bg-orange-50', text: 'text-orange-700', icon: 'text-orange-500' },
};

function TrendBadge({ trend }: { trend: number }) {
  if (trend === 0) return null;
  const up = trend > 0;
  return (
    <span className={cn('inline-flex items-center gap-0.5 text-xs font-medium', up ? 'text-success' : 'text-error')}>
      {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
      {up ? '+' : ''}{trend}%
    </span>
  );
}

export default function LeaderboardPage() {
  const t = useTranslations('nav');
  const [period, setPeriod] = useState<Period>('weekly');
  const [selectedRep, setSelectedRep] = useState<string | null>(null);
  const selectedRepData = selectedRep ? [...podiumData, ...leaderboardData].find((r) => r.name === selectedRep) : null;
  const periodLabel = period === 'daily' ? 'day' : period === 'weekly' ? 'week' : 'month';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">Leaders</h2>
          <p className="mt-1 text-sm text-text-tertiary">Track performance across your team.</p>
        </div>
        <div className="flex items-center rounded-lg border border-border-subtle overflow-hidden">
          {(['daily', 'weekly', 'monthly'] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={cn(
                'px-3 py-1.5 text-xs font-medium transition-colors',
                period === p ? 'bg-white text-text-primary shadow-sm' : 'text-text-muted hover:text-text-secondary'
              )}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 */}
      <div className="grid grid-cols-3 gap-4">
        {podiumData.map((rep) => {
          const rc = rankColors[rep.rank];
          return (
            <button
              key={rep.rank}
              onClick={() => setSelectedRep(rep.name)}
              className="rounded-xl border border-border-subtle bg-white p-5 text-left transition-all duration-150 hover:border-border hover:shadow-md"
            >
              {/* Rank + streak */}
              <div className="flex items-center justify-between">
                <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold', rc.bg, rc.text)}>
                  {rep.rank === 1 ? <Crown className={cn('h-4 w-4', rc.icon)} /> : <span>#{rep.rank}</span>}
                </div>
                {rep.streak > 0 && (
                  <div className="flex items-center gap-1 text-xs text-warning font-medium">
                    <Flame className="h-3 w-3" />
                    {rep.streak}d
                  </div>
                )}
              </div>

              {/* Name */}
              <div className="mt-4 flex items-center gap-3">
                <Avatar name={rep.name} size="md" />
                <p className="text-sm font-semibold text-text-primary">{rep.name}</p>
              </div>

              {/* Stats */}
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-text-muted">Closes</p>
                  <p className="text-2xl font-bold text-text-primary">{rep.closes}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted">Revenue</p>
                  <p className="text-base font-semibold text-text-secondary">${(rep.revenue / 1000).toFixed(1)}k</p>
                </div>
              </div>

              {/* Trend */}
              <div className="mt-3">
                <TrendBadge trend={rep.trend} />
              </div>
            </button>
          );
        })}
      </div>

      {/* Rest of leaderboard */}
      <Card>
        <CardContent className="p-0">
          {leaderboardData.map((rep, i) => (
            <button
              key={rep.rank}
              onClick={() => setSelectedRep(rep.name)}
              className={cn(
                'flex w-full items-center gap-4 px-5 py-3 text-left transition-colors hover:bg-surface-elevated',
                i < leaderboardData.length - 1 && 'border-b border-border-subtle'
              )}
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-elevated text-xs font-semibold text-text-muted">
                {rep.rank}
              </div>

              <Link
                href={`/profile/${rep.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="flex flex-1 items-center gap-3 min-w-0 group"
                onClick={(e) => e.stopPropagation()}
              >
                <Avatar name={rep.name} size="sm" />
                <p className="text-sm font-semibold text-text-primary group-hover:text-brand transition-colors">{rep.name}</p>
              </Link>

              {rep.streak > 0 && (
                <div className="flex items-center gap-1 text-xs text-warning font-medium">
                  <Flame className="h-3 w-3" />
                  {rep.streak}d
                </div>
              )}

              <div className="text-right w-16">
                <p className="text-lg font-bold text-text-primary">{rep.closes}</p>
                <p className="text-[10px] text-text-muted font-medium">closes</p>
              </div>

              <div className="text-right w-20">
                <p className="text-sm font-semibold text-text-secondary">${(rep.revenue / 1000).toFixed(1)}k</p>
                <p className="text-[10px] text-text-muted font-medium">revenue</p>
              </div>

              <div className="w-14 flex justify-end">
                <TrendBadge trend={rep.trend} />
              </div>

              <ChevronRight className="h-4 w-4 text-text-muted" />
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Drawer */}
      {selectedRep && selectedRepData && (
        <>
          <div className="fixed inset-0 z-40 bg-black/20" onClick={() => setSelectedRep(null)} />
          <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white border-l border-border-subtle shadow-xl animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between border-b border-border-subtle px-5 py-4">
              <div className="flex items-center gap-3">
                <Avatar name={selectedRep} size="lg" />
                <div>
                  <h3 className="text-sm font-semibold text-text-primary">{selectedRep}</h3>
                  {selectedRepData.streak > 0 && (
                    <div className="mt-0.5 flex items-center gap-1 text-xs text-warning font-medium">
                      <Flame className="h-3 w-3" />
                      {selectedRepData.streak} day streak
                    </div>
                  )}
                </div>
              </div>
              <button onClick={() => setSelectedRep(null)} className="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-surface-elevated hover:text-text-secondary">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">Performance ({period})</h4>
              <div className="grid grid-cols-2 gap-2">
                {repDetailKPIs.map((kpi) => (
                  <div key={kpi.label} className="rounded-lg border border-border-subtle bg-surface-elevated px-3 py-3">
                    <p className="text-[10px] font-medium uppercase tracking-wider text-text-muted">{kpi.label}</p>
                    <p className="mt-1 text-base font-bold text-text-primary">{kpi.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">Conversion Funnel</h4>
                <div className="space-y-3">
                  {[
                    { label: 'Doors Knocked', value: 156, max: 156 },
                    { label: 'Conversations', value: 42, max: 156 },
                    { label: 'Demos', value: 15, max: 156 },
                    { label: 'Quotes', value: 12, max: 156 },
                    { label: 'Closes', value: 8, max: 156 },
                  ].map((step) => (
                    <div key={step.label}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-text-tertiary">{step.label}</span>
                        <span className="text-xs font-semibold text-text-primary">{step.value}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-surface-elevated">
                        <div
                          className="h-1.5 rounded-full bg-brand transition-all duration-500"
                          style={{ width: `${(step.value / step.max) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
