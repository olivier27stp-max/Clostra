'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { StatCard } from '@/components/ui/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { cn } from '@/lib/utils/cn';
import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Target,
  Calendar,
  Download,
  Filter,
  ChevronDown,
  MapPin,
} from 'lucide-react';

const summaryStats = [
  {
    icon: <DollarSign className="h-4 w-4" />,
    label: 'Total Revenue',
    value: '$284,600',
    change: { value: '+14%', direction: 'up' as const },
    subtitle: 'This month',
  },
  {
    icon: <Target className="h-4 w-4" />,
    label: 'Total Closes',
    value: '62',
    change: { value: '+8', direction: 'up' as const },
    subtitle: 'vs. last month',
  },
  {
    icon: <Users className="h-4 w-4" />,
    label: 'Active Reps',
    value: '24',
    subtitle: '92% field rate',
  },
  {
    icon: <TrendingUp className="h-4 w-4" />,
    label: 'Avg Conversion',
    value: '18.4%',
    change: { value: '+2.1%', direction: 'up' as const },
    subtitle: 'Doors to close',
  },
  {
    icon: <MapPin className="h-4 w-4" />,
    label: 'Doors Knocked',
    value: '3,420',
    change: { value: '+340', direction: 'up' as const },
    subtitle: 'This month',
  },
];

const repPerformance = [
  { name: 'Sarah Chen', team: 'Alpha', doors: 312, conversations: 84, demos: 22, closes: 8, revenue: 34200, conversion: 9.5 },
  { name: 'Marcus Davis', team: 'Bravo', doors: 280, conversations: 72, demos: 18, closes: 6, revenue: 28800, conversion: 8.3 },
  { name: 'Emily Rodriguez', team: 'Alpha', doors: 245, conversations: 65, demos: 16, closes: 5, revenue: 24500, conversion: 7.7 },
  { name: 'Alex Martin', team: 'Bravo', doors: 220, conversations: 58, demos: 14, closes: 4, revenue: 19200, conversion: 6.9 },
  { name: 'Jordan Kim', team: 'Charlie', doors: 198, conversations: 52, demos: 12, closes: 4, revenue: 17800, conversion: 7.7 },
];

export default function ReportsPage() {
  const t = useTranslations('nav');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">Reports</h2>
          <p className="text-xs text-text-tertiary">
            Analytics and performance insights
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5">
            <Calendar className="h-3 w-3" />
            Mar 1 - Mar 27, 2026
            <ChevronDown className="h-2.5 w-2.5" />
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Filter className="h-3 w-3" />
            Filters
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Download className="h-3 w-3" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {summaryStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Chart placeholders */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-3.5 w-3.5 text-brand" />
              Revenue Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-border-subtle bg-surface-elevated">
              <div className="text-center">
                <BarChart3 className="mx-auto h-6 w-6 text-text-muted" />
                <p className="mt-2 text-xs text-text-muted">
                  Chart integration pending
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-3.5 w-3.5 text-brand" />
              Conversion Funnel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-border-subtle bg-surface-elevated">
              <div className="text-center">
                <TrendingUp className="mx-auto h-6 w-6 text-text-muted" />
                <p className="mt-2 text-xs text-text-muted">
                  Chart integration pending
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed table */}
      <Card>
        <CardHeader>
          <CardTitle>Rep Performance Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border-subtle">
                  {['Rep', 'Team', 'Doors', 'Conversations', 'Demos', 'Closes', 'Revenue', 'Conv %'].map(
                    (col) => (
                      <th
                        key={col}
                        className="px-5 py-2.5 text-left text-[11px] font-medium text-text-muted"
                      >
                        {col}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {repPerformance.map((rep) => (
                  <tr key={rep.name} className="border-b border-border-subtle last:border-b-0 table-row-hover">
                    <td className="px-5 py-2.5">
                      <div className="flex items-center gap-2">
                        <Avatar name={rep.name} size="sm" className="!h-5 !w-5 !text-[8px]" />
                        <span className="text-[13px] font-medium text-text-primary">
                          {rep.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-2.5">
                      <Badge variant="secondary" className="text-[10px]">
                        {rep.team}
                      </Badge>
                    </td>
                    <td className="px-5 py-2.5 text-[13px] text-text-secondary">
                      {rep.doors}
                    </td>
                    <td className="px-5 py-2.5 text-[13px] text-text-secondary">
                      {rep.conversations}
                    </td>
                    <td className="px-5 py-2.5 text-[13px] text-text-secondary">
                      {rep.demos}
                    </td>
                    <td className="px-5 py-2.5 text-[13px] font-semibold text-text-primary">
                      {rep.closes}
                    </td>
                    <td className="px-5 py-2.5 text-[13px] font-medium text-text-primary">
                      ${rep.revenue.toLocaleString('en-US')}
                    </td>
                    <td className="px-5 py-2.5 text-[13px] text-text-secondary">
                      {rep.conversion}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
