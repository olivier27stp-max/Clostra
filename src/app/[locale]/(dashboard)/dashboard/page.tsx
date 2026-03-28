'use client';

import { useTranslations } from 'next-intl';
import { StatCard } from '@/components/ui/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { cn } from '@/lib/utils/cn';
import {
  Users,
  DollarSign,
  Target,
  TrendingUp,
  Calendar,
  AlertTriangle,
  Trophy,
  Zap,
  MapPin,
  Clock,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Placeholder data
// ---------------------------------------------------------------------------

const ownerStats = [
  {
    icon: <Users className="h-4 w-4" />,
    label: 'Active Reps',
    value: '24',
    change: { value: '+3', direction: 'up' as const },
    subtitle: 'In the field right now',
  },
  {
    icon: <DollarSign className="h-4 w-4" />,
    label: 'Revenue Today',
    value: '$18,420',
    change: { value: '+12%', direction: 'up' as const },
    subtitle: 'vs. yesterday',
  },
  {
    icon: <Target className="h-4 w-4" />,
    label: 'Closes Today',
    value: '7',
    change: { value: '+2', direction: 'up' as const },
    subtitle: '85% conversion rate',
  },
  {
    icon: <TrendingUp className="h-4 w-4" />,
    label: 'Pipeline Value',
    value: '$142,800',
    change: { value: '+8%', direction: 'up' as const },
    subtitle: '38 active deals',
  },
];

const recentWins = [
  { rep: 'Sarah Chen', deal: 'Johnson Residence', value: '$4,200', time: '12 min ago' },
  { rep: 'Marcus Davis', deal: 'Williams Family', value: '$3,800', time: '45 min ago' },
  { rep: 'Emily Rodriguez', deal: 'Park Avenue Home', value: '$5,100', time: '1h ago' },
];

const needsAttention = [
  { type: 'overdue', message: '5 follow-ups overdue', priority: 'high' },
  { type: 'idle', message: '3 reps have no activity today', priority: 'medium' },
  { type: 'stale', message: '12 leads untouched for 7+ days', priority: 'medium' },
];

const repStats = [
  {
    icon: <MapPin className="h-4 w-4" />,
    label: 'Doors Knocked',
    value: '34',
    change: { value: '+8', direction: 'up' as const },
  },
  {
    icon: <Target className="h-4 w-4" />,
    label: 'Closes',
    value: '2',
    change: { value: '+1', direction: 'up' as const },
  },
  {
    icon: <DollarSign className="h-4 w-4" />,
    label: 'Revenue',
    value: '$6,400',
    change: { value: '+22%', direction: 'up' as const },
  },
  {
    icon: <Clock className="h-4 w-4" />,
    label: 'Time in Field',
    value: '4h 32m',
    subtitle: 'Session active',
  },
];

const todaySchedule = [
  { time: '10:00 AM', title: 'Follow-up: Garcia Home', status: 'completed' },
  { time: '11:30 AM', title: 'Demo: Patel Residence', status: 'upcoming' },
  { time: '2:00 PM', title: 'Follow-up: Thompson Family', status: 'upcoming' },
  { time: '4:00 PM', title: 'New prospect: Oak St', status: 'upcoming' },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function DashboardPage() {
  const t = useTranslations('nav');

  // TODO: Replace with actual role from auth store
  const isManager = true;

  if (isManager) {
    return <ManagerDashboard />;
  }

  return <RepDashboard />;
}

function ManagerDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-text-primary">Good morning, Alex</h2>
        <p className="mt-1 text-sm text-text-tertiary">
          Here is what is happening across your team today.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {ownerStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Recent wins */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-3.5 w-3.5 text-gold" />
              Recent Wins
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentWins.map((win, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg bg-surface-elevated px-3 py-2.5"
                >
                  <div className="flex items-center gap-3">
                    <Avatar name={win.rep} size="sm" />
                    <div>
                      <p className="text-[13px] font-medium text-text-primary">
                        {win.rep}
                      </p>
                      <p className="text-[11px] text-text-muted">{win.deal}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[13px] font-semibold text-success">{win.value}</p>
                    <p className="text-[10px] text-text-muted">{win.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Needs attention */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-3.5 w-3.5 text-warning" />
              Needs Attention
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {needsAttention.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-lg bg-surface-elevated px-3 py-2.5"
                >
                  <div
                    className={cn(
                      'h-1.5 w-1.5 shrink-0 rounded-full',
                      item.priority === 'high' ? 'bg-error' : 'bg-warning'
                    )}
                  />
                  <p className="text-[13px] text-text-secondary">{item.message}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function RepDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">Welcome back, Alex</h2>
          <p className="mt-0.5 text-xs text-text-tertiary">
            You are ranked <span className="font-medium text-brand">#3</span> today. Keep pushing!
          </p>
        </div>
        <Badge variant="success" className="px-2 py-0.5 text-[11px]">
          <Zap className="mr-1 h-3 w-3" />
          Session Active
        </Badge>
      </div>

      {/* Personal stats */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {repStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Today schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 text-brand" />
              Today's Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {todaySchedule.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-lg bg-surface-elevated px-3 py-2.5"
                >
                  <div
                    className={cn(
                      'h-1.5 w-1.5 shrink-0 rounded-full',
                      item.status === 'completed' ? 'bg-success' : 'bg-brand'
                    )}
                  />
                  <div className="flex-1">
                    <p className="text-[13px] font-medium text-text-primary">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-text-muted">{item.time}</p>
                  </div>
                  {item.status === 'completed' && (
                    <Badge variant="success" className="text-[10px]">Done</Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active challenges */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-3.5 w-3.5 text-gold" />
              Active Challenges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="rounded-lg border border-gold/15 bg-gold/5 p-3.5">
                <div className="flex items-center justify-between">
                  <p className="text-[13px] font-medium text-text-primary">
                    Weekly Door Blitz
                  </p>
                  <Badge variant="warning" className="text-[10px]">2d left</Badge>
                </div>
                <p className="mt-0.5 text-[11px] text-text-tertiary">
                  Knock 100 doors this week
                </p>
                <div className="mt-2.5 h-1.5 rounded-full bg-surface-elevated">
                  <div
                    className="h-1.5 rounded-full bg-gold"
                    style={{ width: '68%' }}
                  />
                </div>
                <p className="mt-1 text-[11px] text-text-muted">68 / 100 doors</p>
              </div>

              <div className="rounded-lg border border-brand/15 bg-brand/5 p-3.5">
                <div className="flex items-center justify-between">
                  <p className="text-[13px] font-medium text-text-primary">
                    Close King
                  </p>
                  <Badge className="text-[10px]">5d left</Badge>
                </div>
                <p className="mt-0.5 text-[11px] text-text-tertiary">
                  Most closes this week wins $200
                </p>
                <div className="mt-2.5 h-1.5 rounded-full bg-surface-elevated">
                  <div
                    className="h-1.5 rounded-full bg-brand"
                    style={{ width: '40%' }}
                  />
                </div>
                <p className="mt-1 text-[11px] text-text-muted">2 / 5 closes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
