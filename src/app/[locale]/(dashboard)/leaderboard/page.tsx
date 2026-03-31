'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils/cn';
import { getRepAvatar } from '@/lib/constants/avatars';
import { Link } from '@/i18n/navigation';
import {
  TrendingUp,
  TrendingDown,
  ChevronRight,
  Flame,
  Crown,
  X,
} from 'lucide-react';

type Period = 'daily' | 'weekly' | 'monthly';

interface RepData {
  rank: number;
  name: string;
  avatar: string;
  closes: number;
  revenue: number;
  trend: number;
  streak: number;
}

// ---------------------------------------------------------------------------
// Data per period
// ---------------------------------------------------------------------------

const dataByPeriod: Record<Period, { podium: RepData[]; rest: RepData[] }> = {
  daily: {
    podium: [
      { rank: 1, name: 'Marcus Davis', avatar: getRepAvatar('Marcus Davis')!, closes: 3, revenue: 12600, trend: 20, streak: 3 },
      { rank: 2, name: 'Sarah Chen', avatar: getRepAvatar('Sarah Chen')!, closes: 2, revenue: 9400, trend: 10, streak: 5 },
      { rank: 3, name: 'Jordan Kim', avatar: getRepAvatar('Jordan Kim')!, closes: 2, revenue: 8100, trend: 5, streak: 1 },
    ],
    rest: [
      { rank: 4, name: 'Emily Rodriguez', avatar: getRepAvatar('Emily Rodriguez')!, closes: 1, revenue: 5200, trend: -3, streak: 0 },
      { rank: 5, name: 'Alex Martin', avatar: getRepAvatar('Alex Martin')!, closes: 1, revenue: 4800, trend: 8, streak: 2 },
      { rank: 6, name: 'Taylor Brooks', avatar: getRepAvatar('Taylor Brooks')!, closes: 1, revenue: 3900, trend: 15, streak: 4 },
      { rank: 7, name: 'Casey Morgan', avatar: getRepAvatar('Casey Morgan')!, closes: 0, revenue: 0, trend: 0, streak: 0 },
      { rank: 8, name: 'Riley Thompson', avatar: getRepAvatar('Riley Thompson')!, closes: 0, revenue: 0, trend: -12, streak: 0 },
      { rank: 9, name: 'Quinn Harris', avatar: getRepAvatar('Quinn Harris')!, closes: 0, revenue: 0, trend: 0, streak: 0 },
      { rank: 10, name: 'Drew Patel', avatar: getRepAvatar('Drew Patel')!, closes: 0, revenue: 0, trend: -5, streak: 0 },
    ],
  },
  weekly: {
    podium: [
      { rank: 1, name: 'Sarah Chen', avatar: getRepAvatar('Sarah Chen')!, closes: 8, revenue: 34200, trend: 15, streak: 5 },
      { rank: 2, name: 'Marcus Davis', avatar: getRepAvatar('Marcus Davis')!, closes: 6, revenue: 28800, trend: 8, streak: 3 },
      { rank: 3, name: 'Emily Rodriguez', avatar: getRepAvatar('Emily Rodriguez')!, closes: 5, revenue: 24500, trend: -3, streak: 0 },
    ],
    rest: [
      { rank: 4, name: 'Alex Martin', avatar: getRepAvatar('Alex Martin')!, closes: 4, revenue: 19200, trend: 12, streak: 2 },
      { rank: 5, name: 'Jordan Kim', avatar: getRepAvatar('Jordan Kim')!, closes: 4, revenue: 17800, trend: -5, streak: 0 },
      { rank: 6, name: 'Taylor Brooks', avatar: getRepAvatar('Taylor Brooks')!, closes: 3, revenue: 15400, trend: 22, streak: 4 },
      { rank: 7, name: 'Casey Morgan', avatar: getRepAvatar('Casey Morgan')!, closes: 3, revenue: 14100, trend: 0, streak: 0 },
      { rank: 8, name: 'Riley Thompson', avatar: getRepAvatar('Riley Thompson')!, closes: 2, revenue: 11600, trend: -8, streak: 0 },
      { rank: 9, name: 'Quinn Harris', avatar: getRepAvatar('Quinn Harris')!, closes: 2, revenue: 9800, trend: 5, streak: 1 },
      { rank: 10, name: 'Drew Patel', avatar: getRepAvatar('Drew Patel')!, closes: 1, revenue: 5200, trend: -15, streak: 0 },
    ],
  },
  monthly: {
    podium: [
      { rank: 1, name: 'Sarah Chen', avatar: getRepAvatar('Sarah Chen')!, closes: 28, revenue: 118400, trend: 18, streak: 5 },
      { rank: 2, name: 'Taylor Brooks', avatar: getRepAvatar('Taylor Brooks')!, closes: 22, revenue: 96800, trend: 25, streak: 4 },
      { rank: 3, name: 'Marcus Davis', avatar: getRepAvatar('Marcus Davis')!, closes: 20, revenue: 89200, trend: 6, streak: 3 },
    ],
    rest: [
      { rank: 4, name: 'Emily Rodriguez', avatar: getRepAvatar('Emily Rodriguez')!, closes: 18, revenue: 78500, trend: 10, streak: 0 },
      { rank: 5, name: 'Alex Martin', avatar: getRepAvatar('Alex Martin')!, closes: 15, revenue: 68400, trend: 14, streak: 2 },
      { rank: 6, name: 'Jordan Kim', avatar: getRepAvatar('Jordan Kim')!, closes: 14, revenue: 62100, trend: -2, streak: 1 },
      { rank: 7, name: 'Casey Morgan', avatar: getRepAvatar('Casey Morgan')!, closes: 12, revenue: 54300, trend: 3, streak: 0 },
      { rank: 8, name: 'Quinn Harris', avatar: getRepAvatar('Quinn Harris')!, closes: 10, revenue: 45600, trend: 7, streak: 1 },
      { rank: 9, name: 'Riley Thompson', avatar: getRepAvatar('Riley Thompson')!, closes: 8, revenue: 38200, trend: -10, streak: 0 },
      { rank: 10, name: 'Drew Patel', avatar: getRepAvatar('Drew Patel')!, closes: 5, revenue: 22800, trend: -18, streak: 0 },
    ],
  },
};

const detailKPIsByPeriod: Record<Period, { key: string; value: string }[]> = {
  daily: [
    { key: 'doors_knocked', value: '34' },
    { key: 'conversations', value: '12' },
    { key: 'demos_set', value: '4' },
    { key: 'demos_held', value: '3' },
    { key: 'quotes_sent', value: '3' },
    { key: 'closes', value: '3' },
    { key: 'revenue', value: '$12,600' },
    { key: 'conversion_rate', value: '25%' },
  ],
  weekly: [
    { key: 'doors_knocked', value: '156' },
    { key: 'conversations', value: '42' },
    { key: 'demos_set', value: '18' },
    { key: 'demos_held', value: '15' },
    { key: 'quotes_sent', value: '12' },
    { key: 'closes', value: '8' },
    { key: 'revenue', value: '$34,200' },
    { key: 'conversion_rate', value: '19%' },
  ],
  monthly: [
    { key: 'doors_knocked', value: '620' },
    { key: 'conversations', value: '168' },
    { key: 'demos_set', value: '72' },
    { key: 'demos_held', value: '58' },
    { key: 'quotes_sent', value: '45' },
    { key: 'closes', value: '28' },
    { key: 'revenue', value: '$118,400' },
    { key: 'conversion_rate', value: '16%' },
  ],
};

const funnelByPeriod: Record<Period, { key: string; value: number; max: number }[]> = {
  daily: [
    { key: 'doors_knocked', value: 34, max: 34 },
    { key: 'conversations', value: 12, max: 34 },
    { key: 'demos_held', value: 3, max: 34 },
    { key: 'quotes_sent', value: 3, max: 34 },
    { key: 'closes', value: 3, max: 34 },
  ],
  weekly: [
    { key: 'doors_knocked', value: 156, max: 156 },
    { key: 'conversations', value: 42, max: 156 },
    { key: 'demos_held', value: 15, max: 156 },
    { key: 'quotes_sent', value: 12, max: 156 },
    { key: 'closes', value: 8, max: 156 },
  ],
  monthly: [
    { key: 'doors_knocked', value: 620, max: 620 },
    { key: 'conversations', value: 168, max: 620 },
    { key: 'demos_held', value: 58, max: 620 },
    { key: 'quotes_sent', value: 45, max: 620 },
    { key: 'closes', value: 28, max: 620 },
  ],
};

// ---------------------------------------------------------------------------
// Card styles
// ---------------------------------------------------------------------------

interface CardStyle {
  gradient: string;
  overlay: string;
  rankBg: string;
  rankBorder: string;
  rankIcon: string;
  shadow: string;
}

const cardStyles: Record<number, CardStyle> = {
  1: {
    gradient: 'linear-gradient(135deg, #F59E0B 0%, #F97316 100%)',
    overlay: 'rgba(255,255,255,0.08)',
    rankBg: 'rgba(255,255,255,0.15)',
    rankBorder: 'rgba(255,255,255,0.25)',
    rankIcon: '#FFF7ED',
    shadow: '0 10px 30px rgba(245,158,11,0.25), 0 4px 12px rgba(0,0,0,0.1)',
  },
  2: {
    gradient: 'linear-gradient(135deg, #64748B 0%, #334155 100%)',
    overlay: 'rgba(255,255,255,0.06)',
    rankBg: 'rgba(255,255,255,0.12)',
    rankBorder: 'rgba(255,255,255,0.2)',
    rankIcon: '#E2E8F0',
    shadow: '0 10px 30px rgba(51,65,85,0.3), 0 4px 12px rgba(0,0,0,0.1)',
  },
  3: {
    gradient: 'linear-gradient(135deg, #FB923C 0%, #EA580C 100%)',
    overlay: 'rgba(255,255,255,0.07)',
    rankBg: 'rgba(255,255,255,0.12)',
    rankBorder: 'rgba(255,255,255,0.2)',
    rankIcon: '#FFEDD5',
    shadow: '0 10px 30px rgba(234,88,12,0.25), 0 4px 12px rgba(0,0,0,0.1)',
  },
};

const noiseTexture = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

// ---------------------------------------------------------------------------
// Trend badge
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function LeaderboardPage() {
  const t = useTranslations('leaderboard');
  const [period, setPeriod] = useState<Period>('weekly');
  const [selectedRep, setSelectedRep] = useState<string | null>(null);

  const { podium: podiumData, rest: leaderboardData } = dataByPeriod[period];
  const allReps = [...podiumData, ...leaderboardData];
  const selectedRepData = selectedRep ? allReps.find((r) => r.name === selectedRep) : null;
  const repDetailKPIs = detailKPIsByPeriod[period];
  const funnelSteps = funnelByPeriod[period];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">{t('rankings')}</h2>
          <p className="mt-1 text-sm text-text-tertiary">{t('team_ranking')}</p>
        </div>
        <div className="flex items-center rounded-lg border border-border-subtle overflow-hidden">
          {(['daily', 'weekly', 'monthly'] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={cn(
                'px-3 py-1.5 text-xs font-medium transition-colors',
                period === p ? 'bg-white text-text-primary shadow-sm' : 'text-text-muted hover:text-text-secondary',
              )}
            >
              {t(p)}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {podiumData.map((rep) => {
          const s = cardStyles[rep.rank];
          return (
            <button
              key={rep.rank}
              onClick={() => setSelectedRep(rep.name)}
              className="group relative overflow-hidden rounded-[16px] p-6 text-left transition-all duration-200 hover:-translate-y-0.5"
              style={{
                background: s.gradient,
                boxShadow: s.shadow,
              }}
            >
              {/* Radial glass overlay */}
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  backgroundImage: `radial-gradient(circle at 20% 30%, rgba(255,255,255,0.15), transparent 40%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.1), transparent 50%)`,
                }}
              />
              {/* Noise grain */}
              <div
                className="pointer-events-none absolute inset-0 rounded-[16px]"
                style={{ backgroundImage: noiseTexture, opacity: 0.04, mixBlendMode: 'overlay' }}
              />
              {/* Light overlay */}
              <div className="pointer-events-none absolute inset-0" style={{ background: s.overlay }} />

              {/* Rank badge */}
              <div className="relative flex items-center justify-between">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold"
                  style={{
                    background: s.rankBg,
                    border: `1px solid ${s.rankBorder}`,
                    backdropFilter: 'blur(8px)',
                    color: s.rankIcon,
                  }}
                >
                  {rep.rank === 1 ? <Crown className="h-4 w-4" /> : rep.rank}
                </div>
                {rep.streak > 0 && (
                  <div
                    className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
                    style={{ background: 'rgba(255,255,255,0.12)', color: s.rankIcon }}
                  >
                    <Flame className="h-3 w-3" />
                    {rep.streak}d
                  </div>
                )}
              </div>

              {/* Avatar + name */}
              <div className="relative mt-5 flex flex-col items-center">
                <img
                  src={rep.avatar}
                  alt={rep.name}
                  className="h-[72px] w-[72px] rounded-full object-cover shadow-lg ring-2 ring-white/20"
                />
                <p className="mt-3 text-base font-semibold text-white">{rep.name}</p>
              </div>

              {/* Closes */}
              <p className="relative mt-4 text-center text-sm font-semibold text-white/90">
                {rep.closes} {t('closes').toLowerCase()}
              </p>

              {/* Revenue */}
              <p className="relative mt-3 text-center text-2xl font-bold text-white">
                ${(rep.revenue / 1000).toFixed(1)}k
              </p>
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
                i < leaderboardData.length - 1 && 'border-b border-border-subtle',
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
                <img src={rep.avatar} alt={rep.name} className="h-7 w-7 rounded-full object-cover" />
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
                <p className="text-[10px] text-text-muted font-medium">{t('closes').toLowerCase()}</p>
              </div>

              <div className="text-right w-20">
                <p className="text-sm font-semibold text-text-secondary">${(rep.revenue / 1000).toFixed(1)}k</p>
                <p className="text-[10px] text-text-muted font-medium">{t('revenue').toLowerCase()}</p>
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
                <img src={selectedRepData.avatar} alt={selectedRep} className="h-11 w-11 rounded-full object-cover" />
                <div>
                  <h3 className="text-sm font-semibold text-text-primary">{selectedRep}</h3>
                  {selectedRepData.streak > 0 && (
                    <div className="mt-0.5 flex items-center gap-1 text-xs text-warning font-medium">
                      <Flame className="h-3 w-3" />
                      {selectedRepData.streak}d streak
                    </div>
                  )}
                </div>
              </div>
              <button onClick={() => setSelectedRep(null)} className="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-surface-elevated hover:text-text-secondary">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">{t('performance_detail')} ({t(period)})</h4>
              <div className="grid grid-cols-2 gap-2">
                {repDetailKPIs.map((kpi) => (
                  <div key={kpi.key} className="rounded-lg border border-border-subtle bg-surface-elevated px-3 py-3">
                    <p className="text-[10px] font-medium uppercase tracking-wider text-text-muted">{t(kpi.key)}</p>
                    <p className="mt-1 text-base font-bold text-text-primary">{kpi.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">{t('conversion_rate')}</h4>
                <div className="space-y-3">
                  {funnelSteps.map((step) => (
                    <div key={step.key}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-text-tertiary">{t(step.key)}</span>
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
