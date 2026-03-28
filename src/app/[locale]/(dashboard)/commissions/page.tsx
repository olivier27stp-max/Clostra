'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { StatCard } from '@/components/ui/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { cn } from '@/lib/utils/cn';
import {
  DollarSign,
  Percent,
  TrendingUp,
  CalendarClock,
  FileText,
  Wrench,
  CreditCard,
  Filter,
  Download,
} from 'lucide-react';

type Tab = 'commissions' | 'payout';

// --- Commissions tab cards ---
const commissionCards = [
  {
    label: 'Total Revenue',
    value: '$156,000',
    change: { value: '+12%', direction: 'up' as const },
    subtitle: 'This period',
  },
  {
    label: 'Total Earned',
    value: '$12,480',
    change: { value: '+18%', direction: 'up' as const },
    subtitle: 'Commission earned',
  },
  {
    label: 'Commission %',
    value: '8%',
    subtitle: 'Current rate',
  },
];

// --- Payout tab cards ---
const payoutCards = [
  {
    label: 'Future Services',
    value: '$33,600',
    subtitle: '7 scheduled upcoming',
  },
  {
    label: 'Invoices Opened',
    value: '$14,900',
    subtitle: '4 awaiting payment',
  },
  {
    label: 'Serviced',
    value: '$42,800',
    subtitle: '12 completed this period',
  },
  {
    label: 'Paid',
    value: '$9,360',
    change: { value: '+$2,400', direction: 'up' as const },
    subtitle: 'This month',
  },
];

const statusStyles: Record<string, string> = {
  pending: 'bg-warning/10 text-warning',
  approved: 'bg-info/10 text-info',
  paid: 'bg-success/10 text-success',
  reversed: 'bg-error/10 text-error',
};

const commissionEntries = [
  { id: '1', lead: 'Johnson Residence', rep: 'Sarah Chen', rule: 'Standard 8%', base: 4200, amount: 336, status: 'pending', date: 'Mar 27, 2026' },
  { id: '2', lead: 'Williams Family', rep: 'Marcus Davis', rule: 'Standard 8%', base: 3800, amount: 304, status: 'pending', date: 'Mar 27, 2026' },
  { id: '3', lead: 'Park Avenue Home', rep: 'Emily Rodriguez', rule: 'Premium 10%', base: 5100, amount: 510, status: 'approved', date: 'Mar 26, 2026' },
  { id: '4', lead: 'Garcia Home', rep: 'Alex Martin', rule: 'Standard 8%', base: 2800, amount: 224, status: 'approved', date: 'Mar 25, 2026' },
  { id: '5', lead: 'Thompson Family', rep: 'Sarah Chen', rule: 'Standard 8%', base: 3200, amount: 256, status: 'paid', date: 'Mar 24, 2026' },
  { id: '6', lead: 'Brown Residence', rep: 'Marcus Davis', rule: 'Standard 8%', base: 4600, amount: 368, status: 'paid', date: 'Mar 23, 2026' },
  { id: '7', lead: 'Cancelled Deal', rep: 'Alex Martin', rule: 'Standard 8%', base: 2200, amount: 176, status: 'reversed', date: 'Mar 22, 2026' },
];

const payoutEntries = [
  { id: '1', service: 'Johnson Residence — Solar Install', status: 'future', date: 'Apr 5, 2026', amount: 4200 },
  { id: '2', service: 'Park Avenue — Panel Upgrade', status: 'future', date: 'Apr 8, 2026', amount: 5100 },
  { id: '3', service: 'Williams Family — Full System', status: 'invoiced', date: 'Mar 27, 2026', amount: 3800 },
  { id: '4', service: 'Garcia Home — Maintenance', status: 'invoiced', date: 'Mar 26, 2026', amount: 2800 },
  { id: '5', service: 'Thompson Family — Install', status: 'serviced', date: 'Mar 24, 2026', amount: 3200 },
  { id: '6', service: 'Brown Residence — Repair', status: 'serviced', date: 'Mar 23, 2026', amount: 4600 },
  { id: '7', service: 'Lee Home — Full System', status: 'paid', date: 'Mar 20, 2026', amount: 5400 },
  { id: '8', service: 'Martinez Residence — Install', status: 'paid', date: 'Mar 18, 2026', amount: 3960 },
];

const payoutStatusStyles: Record<string, string> = {
  future: 'bg-info/10 text-info',
  invoiced: 'bg-warning/10 text-warning',
  serviced: 'bg-brand/10 text-brand',
  paid: 'bg-success/10 text-success',
};

export default function CommissionsPage() {
  const t = useTranslations('nav');
  const [activeTab, setActiveTab] = useState<Tab>('commissions');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">Commissions</h2>
          <p className="text-xs text-text-tertiary">
            Track earnings, approvals, and payouts
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5">
            <Download className="h-3 w-3" />
            Export
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Filter className="h-3 w-3" />
            Filters
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 rounded-lg border border-border-subtle p-0.5">
        {([
          { key: 'commissions' as Tab, label: 'Commissions' },
          { key: 'payout' as Tab, label: 'Payout' },
        ]).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              'flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all',
              activeTab === tab.key
                ? 'bg-surface-elevated text-text-primary shadow-sm'
                : 'text-text-muted hover:text-text-secondary'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* === COMMISSIONS TAB === */}
      {activeTab === 'commissions' && (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {commissionCards.map((card) => (
              <StatCard key={card.label} {...card} />
            ))}
          </div>

          {/* Commission entries table */}
          <Card>
            <CardHeader>
              <CardTitle>Commission Entries</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border-subtle">
                      <th className="px-5 py-2.5 text-left text-xs font-medium text-text-muted">Lead</th>
                      <th className="px-5 py-2.5 text-left text-xs font-medium text-text-muted">Rep</th>
                      <th className="px-5 py-2.5 text-left text-xs font-medium text-text-muted">Rule</th>
                      <th className="px-5 py-2.5 text-right text-xs font-medium text-text-muted">Base</th>
                      <th className="px-5 py-2.5 text-right text-xs font-medium text-text-muted">Commission</th>
                      <th className="px-5 py-2.5 text-left text-xs font-medium text-text-muted">Status</th>
                      <th className="px-5 py-2.5 text-left text-xs font-medium text-text-muted">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {commissionEntries.map((entry) => (
                      <tr key={entry.id} className="border-b border-border-subtle last:border-b-0 table-row-hover">
                        <td className="px-5 py-2.5 text-sm font-medium text-text-primary">{entry.lead}</td>
                        <td className="px-5 py-2.5">
                          <div className="flex items-center gap-2">
                            <Avatar name={entry.rep} size="sm" className="!h-5 !w-5 !text-[8px]" />
                            <span className="text-sm text-text-secondary">{entry.rep}</span>
                          </div>
                        </td>
                        <td className="px-5 py-2.5 text-sm text-text-muted">{entry.rule}</td>
                        <td className="px-5 py-2.5 text-right text-sm text-text-secondary">${entry.base.toLocaleString('en-US')}</td>
                        <td className="px-5 py-2.5 text-right text-sm font-medium text-text-primary">${entry.amount.toLocaleString('en-US')}</td>
                        <td className="px-5 py-2.5">
                          <span className={cn('inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium capitalize', statusStyles[entry.status] ?? 'bg-surface-elevated text-text-muted')}>
                            {entry.status}
                          </span>
                        </td>
                        <td className="px-5 py-2.5 text-sm text-text-muted">{entry.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* === PAYOUT TAB === */}
      {activeTab === 'payout' && (
        <>
          {/* Payout summary cards */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {payoutCards.map((card) => (
              <StatCard key={card.label} {...card} />
            ))}
          </div>

          {/* Payout entries table */}
          <Card>
            <CardHeader>
              <CardTitle>Payout Details</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border-subtle">
                      <th className="px-5 py-2.5 text-left text-xs font-medium text-text-muted">Service</th>
                      <th className="px-5 py-2.5 text-left text-xs font-medium text-text-muted">Status</th>
                      <th className="px-5 py-2.5 text-left text-xs font-medium text-text-muted">Date</th>
                      <th className="px-5 py-2.5 text-right text-xs font-medium text-text-muted">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payoutEntries.map((entry) => (
                      <tr key={entry.id} className="border-b border-border-subtle last:border-b-0 table-row-hover">
                        <td className="px-5 py-2.5 text-sm font-medium text-text-primary">{entry.service}</td>
                        <td className="px-5 py-2.5">
                          <span className={cn('inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium capitalize', payoutStatusStyles[entry.status] ?? 'bg-surface-elevated text-text-muted')}>
                            {entry.status}
                          </span>
                        </td>
                        <td className="px-5 py-2.5 text-sm text-text-muted">{entry.date}</td>
                        <td className="px-5 py-2.5 text-right text-sm font-medium text-text-primary">${entry.amount.toLocaleString('en-US')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
