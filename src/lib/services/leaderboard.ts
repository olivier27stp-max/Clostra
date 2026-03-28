/**
 * Leaderboard & Performance Service
 *
 * Reads from materialized rep_stat_snapshots for historical data and
 * computes real-time stats from lead_activity_events for the current day.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { PeriodType } from '@/types/database';
import type { LeaderboardEntry, RepPerformanceDetail } from '@/types';
import { startOfDay, startOfWeek, startOfMonth, endOfDay, endOfWeek, endOfMonth, format } from 'date-fns';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Client = SupabaseClient<any>;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function periodRange(period: PeriodType, date: Date = new Date()) {
  switch (period) {
    case 'daily':
      return {
        start: format(startOfDay(date), 'yyyy-MM-dd'),
        end: format(endOfDay(date), 'yyyy-MM-dd'),
      };
    case 'weekly':
      return {
        start: format(startOfWeek(date, { weekStartsOn: 1 }), 'yyyy-MM-dd'),
        end: format(endOfWeek(date, { weekStartsOn: 1 }), 'yyyy-MM-dd'),
      };
    case 'monthly':
      return {
        start: format(startOfMonth(date), 'yyyy-MM-dd'),
        end: format(endOfMonth(date), 'yyyy-MM-dd'),
      };
  }
}

// ---------------------------------------------------------------------------
// Leaderboard
// ---------------------------------------------------------------------------

export async function getLeaderboard(
  supabase: Client,
  period: PeriodType,
  date?: Date,
  teamId?: string
): Promise<LeaderboardEntry[]> {
  const range = periodRange(period, date);

  let query = supabase
    .from('rep_stat_snapshots')
    .select('*, profile:profiles(*, team:teams(*))')
    .eq('period', period)
    .gte('period_start', range.start)
    .lte('period_start', range.end)
    .order('revenue', { ascending: false });

  if (teamId) {
    query = query.eq('profile.team_id', teamId);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  return (data ?? []).map((row, index) => ({
    rank: index + 1,
    profile: row.profile as LeaderboardEntry['profile'],
    closes: row.closes,
    revenue: row.revenue,
    trend: 0, // TODO: compute from previous period
    team: (row.profile as Record<string, unknown>)?.team as LeaderboardEntry['team'],
  }));
}

// ---------------------------------------------------------------------------
// Rep Performance
// ---------------------------------------------------------------------------

export async function getRepPerformance(
  supabase: Client,
  profileId: string,
  dateRange: { from: string; to: string }
): Promise<RepPerformanceDetail> {
  const { data, error } = await supabase
    .from('rep_stat_snapshots')
    .select('*')
    .eq('profile_id', profileId)
    .gte('period_start', dateRange.from)
    .lte('period_end', dateRange.to);

  if (error) throw new Error(error.message);

  // Aggregate all snapshots in the range
  const agg: RepPerformanceDetail = {
    doors_knocked: 0,
    conversations: 0,
    demos_set: 0,
    demos_held: 0,
    quotes_sent: 0,
    closes: 0,
    revenue: 0,
    conversion_rate: 0,
    average_ticket: 0,
    follow_ups_completed: 0,
  };

  for (const row of data ?? []) {
    agg.doors_knocked += row.doors_knocked;
    agg.conversations += row.conversations;
    agg.demos_set += row.demos_set;
    agg.demos_held += row.demos_held;
    agg.quotes_sent += row.quotes_sent;
    agg.closes += row.closes;
    agg.revenue += row.revenue;
    agg.follow_ups_completed += row.follow_ups_completed;
  }

  agg.conversion_rate =
    agg.conversations > 0
      ? Math.round((agg.closes / agg.conversations) * 100 * 10) / 10
      : 0;
  agg.average_ticket =
    agg.closes > 0 ? Math.round(agg.revenue / agg.closes) : 0;

  return agg;
}

// ---------------------------------------------------------------------------
// Calculate real-time stats from events
// ---------------------------------------------------------------------------

export async function calculateRepStats(
  supabase: Client,
  profileId: string,
  date: Date = new Date()
) {
  const dayStart = startOfDay(date).toISOString();
  const dayEnd = endOfDay(date).toISOString();

  const { data: events, error } = await supabase
    .from('lead_activity_events')
    .select('*')
    .eq('profile_id', profileId)
    .gte('created_at', dayStart)
    .lte('created_at', dayEnd);

  if (error) throw new Error(error.message);

  const stats: RepPerformanceDetail = {
    doors_knocked: 0,
    conversations: 0,
    demos_set: 0,
    demos_held: 0,
    quotes_sent: 0,
    closes: 0,
    revenue: 0,
    conversion_rate: 0,
    average_ticket: 0,
    follow_ups_completed: 0,
  };

  for (const event of events ?? []) {
    switch (event.event_type) {
      case 'door_knock':
        stats.doors_knocked++;
        break;
      case 'conversation':
        stats.conversations++;
        break;
      case 'demo_set':
        stats.demos_set++;
        break;
      case 'demo_held':
        stats.demos_held++;
        break;
      case 'quote_sent':
        stats.quotes_sent++;
        break;
      case 'follow_up':
        stats.follow_ups_completed++;
        break;
      case 'status_change': {
        const meta = event.metadata as Record<string, unknown> | null;
        if (meta?.new_stage_name === 'Closed Won') {
          stats.closes++;
          if (typeof meta.revenue === 'number') {
            stats.revenue += meta.revenue;
          }
        }
        break;
      }
    }
  }

  stats.conversion_rate =
    stats.conversations > 0
      ? Math.round((stats.closes / stats.conversations) * 100 * 10) / 10
      : 0;
  stats.average_ticket =
    stats.closes > 0 ? Math.round(stats.revenue / stats.closes) : 0;

  return stats;
}

// ---------------------------------------------------------------------------
// Snapshot (cron job function)
// ---------------------------------------------------------------------------

export async function snapshotDailyStats(supabase: Client) {
  const { data: profiles, error: pError } = await supabase
    .from('profiles')
    .select('id, company_id')
    .eq('is_active', true)
    .in('role', ['sales_rep', 'team_leader']);

  if (pError) throw new Error(pError.message);

  const today = new Date();
  const dayStart = format(startOfDay(today), 'yyyy-MM-dd');
  const dayEnd = format(endOfDay(today), 'yyyy-MM-dd');

  for (const profile of profiles ?? []) {
    const stats = await calculateRepStats(supabase, profile.id, today);

    await supabase.from('rep_stat_snapshots').upsert(
      {
        company_id: profile.company_id,
        profile_id: profile.id,
        period: 'daily' as PeriodType,
        period_start: dayStart,
        period_end: dayEnd,
        ...stats,
      },
      { onConflict: 'profile_id,period,period_start' }
    );
  }
}

// ---------------------------------------------------------------------------
// Team leaderboard
// ---------------------------------------------------------------------------

export async function getTeamLeaderboard(
  supabase: Client,
  period: PeriodType,
  date?: Date
) {
  const range = periodRange(period, date);

  const { data, error } = await supabase
    .from('rep_stat_snapshots')
    .select('*, profile:profiles(team_id, team:teams(*))')
    .eq('period', period)
    .gte('period_start', range.start)
    .lte('period_start', range.end);

  if (error) throw new Error(error.message);

  // Aggregate by team
  const teamMap = new Map<
    string,
    { team: Record<string, unknown>; closes: number; revenue: number }
  >();

  for (const row of data ?? []) {
    const profile = row.profile as Record<string, unknown> | null;
    const teamId = profile?.team_id as string | null;
    if (!teamId) continue;

    if (!teamMap.has(teamId)) {
      teamMap.set(teamId, {
        team: (profile?.team as Record<string, unknown>) ?? {},
        closes: 0,
        revenue: 0,
      });
    }

    const entry = teamMap.get(teamId)!;
    entry.closes += row.closes;
    entry.revenue += row.revenue;
  }

  return Array.from(teamMap.values())
    .sort((a, b) => b.revenue - a.revenue)
    .map((entry, index) => ({
      rank: index + 1,
      ...entry,
    }));
}
