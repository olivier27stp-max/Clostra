'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { cn } from '@/lib/utils/cn';
import { Settings, Plus, DollarSign, GripVertical } from 'lucide-react';

const stages = [
  {
    name: 'New Lead',
    slug: 'new_lead',
    color: '#58A6FF',
    count: 14,
    value: '$28,400',
    leads: [
      { name: 'John Garcia', rep: 'Sarah Chen', value: '$2,100', time: '2h ago' },
      { name: 'Robert Williams', rep: 'Alex Martin', value: '$1,800', time: '30m ago' },
      { name: 'Chris Lee', rep: 'Marcus Davis', value: '$3,200', time: '1h ago' },
    ],
  },
  {
    name: 'Must Recall',
    slug: 'must_recall',
    color: '#D29922',
    count: 8,
    value: '$18,600',
    leads: [
      { name: 'Maria Santos', rep: 'Marcus Davis', value: '$2,400', time: '1d ago' },
      { name: 'Jennifer Brown', rep: 'Emily Rodriguez', value: '$1,900', time: '2d ago' },
    ],
  },
  {
    name: 'Quote Sent',
    slug: 'quote_sent',
    color: '#A371F7',
    count: 6,
    value: '$32,200',
    leads: [
      { name: 'David Thompson', rep: 'Emily Rodriguez', value: '$5,100', time: '3h ago' },
      { name: 'Michael Patel', rep: 'Marcus Davis', value: '$4,800', time: '6h ago' },
      { name: 'Karen White', rep: 'Sarah Chen', value: '$3,600', time: '1d ago' },
    ],
  },
  {
    name: 'Closed Won',
    slug: 'closed_won',
    color: '#3FB950',
    count: 12,
    value: '$64,800',
    leads: [
      { name: 'Lisa Johnson', rep: 'Sarah Chen', value: '$4,200', time: '5h ago' },
      { name: 'Tony Russo', rep: 'Alex Martin', value: '$6,100', time: '1d ago' },
    ],
  },
  {
    name: 'Closed Lost',
    slug: 'closed_lost',
    color: '#F85149',
    count: 5,
    value: '$12,400',
    leads: [
      { name: 'Amanda Nguyen', rep: 'Alex Martin', value: '$2,200', time: '1w ago' },
    ],
  },
];

export default function PipelinePage() {
  const t = useTranslations('nav');

  return (
    <div className="flex h-[calc(100vh-3rem)] flex-col -mx-6 -my-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border-subtle px-6 py-2.5">
        <div>
          <h2 className="text-sm font-semibold text-text-primary">Pipeline</h2>
          <p className="text-[11px] text-text-muted">
            Drag leads between stages to update their status
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5">
            <Settings className="h-3 w-3" />
            Configure
          </Button>
          <Button size="sm" className="gap-1.5">
            <Plus className="h-3 w-3" />
            New Lead
          </Button>
        </div>
      </div>

      {/* Board */}
      <div className="flex flex-1 gap-3 overflow-x-auto p-4">
        {stages.map((stage) => (
          <div
            key={stage.slug}
            className="flex w-[272px] shrink-0 flex-col rounded-xl bg-white border border-border-subtle"
          >
            {/* Column header */}
            <div
              className="flex items-center justify-between rounded-t-xl px-3 py-2.5"
              style={{ backgroundColor: stage.color }}
            >
              <div className="flex items-center gap-2">
                <h3 className="text-[13px] font-semibold text-white">
                  {stage.name}
                </h3>
                <span className="text-[11px] font-semibold text-white">
                  {stage.count}
                </span>
              </div>
              <span className="text-[11px] font-semibold text-white">
                {stage.value}
              </span>
            </div>

            {/* Cards */}
            <div className="flex-1 space-y-1.5 overflow-y-auto px-2 pt-2 pb-2">
              {stage.leads.map((lead, i) => (
                <div
                  key={i}
                  className="group cursor-grab rounded-lg border border-border-subtle bg-surface p-3 transition-all duration-150 hover:border-border hover:bg-surface-elevated"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-[13px] font-medium text-text-primary">
                        {lead.name}
                      </p>
                      <div className="mt-1.5 flex items-center gap-1.5">
                        <Avatar name={lead.rep} size="sm" className="!h-5 !w-5 !text-[8px]" />
                        <span className="text-[11px] text-text-muted">
                          {lead.rep}
                        </span>
                      </div>
                    </div>
                    <GripVertical className="h-3.5 w-3.5 text-text-muted opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[11px] font-medium text-text-secondary">
                      {lead.value}
                    </span>
                    <span className="text-[10px] text-text-muted">{lead.time}</span>
                  </div>
                </div>
              ))}

              {/* Add card button */}
              <button className="flex w-full items-center justify-center gap-1 rounded-lg border border-dashed border-border-subtle py-2 text-[11px] text-text-muted transition-colors hover:border-border hover:text-text-secondary">
                <Plus className="h-3 w-3" />
                Add lead
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
