'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { getRepAvatar } from '@/lib/constants/avatars';
import { cn } from '@/lib/utils/cn';
import { Settings, Plus, GripVertical } from 'lucide-react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Lead {
  id: string;
  name: string;
  rep: string;
  value: string;
  time: string;
}

interface Stage {
  name: string;
  slug: string;
  color: string;
  value: string;
  leads: Lead[];
}

const initialStages: Stage[] = [
  {
    name: 'New Lead',
    slug: 'new_lead',
    color: '#58A6FF',
    value: '$28,400',
    leads: [
      { id: 'lead-1', name: 'John Garcia', rep: 'Sarah Chen', value: '$2,100', time: '2h ago' },
      { id: 'lead-2', name: 'Robert Williams', rep: 'Alex Martin', value: '$1,800', time: '30m ago' },
      { id: 'lead-3', name: 'Chris Lee', rep: 'Marcus Davis', value: '$3,200', time: '1h ago' },
    ],
  },
  {
    name: 'Must Recall',
    slug: 'must_recall',
    color: '#D29922',
    value: '$18,600',
    leads: [
      { id: 'lead-4', name: 'Maria Santos', rep: 'Marcus Davis', value: '$2,400', time: '1d ago' },
      { id: 'lead-5', name: 'Jennifer Brown', rep: 'Emily Rodriguez', value: '$1,900', time: '2d ago' },
    ],
  },
  {
    name: 'Quote Sent',
    slug: 'quote_sent',
    color: '#A371F7',
    value: '$32,200',
    leads: [
      { id: 'lead-6', name: 'David Thompson', rep: 'Emily Rodriguez', value: '$5,100', time: '3h ago' },
      { id: 'lead-7', name: 'Michael Patel', rep: 'Marcus Davis', value: '$4,800', time: '6h ago' },
      { id: 'lead-8', name: 'Karen White', rep: 'Sarah Chen', value: '$3,600', time: '1d ago' },
    ],
  },
  {
    name: 'Closed Won',
    slug: 'closed_won',
    color: '#3FB950',
    value: '$64,800',
    leads: [
      { id: 'lead-9', name: 'Lisa Johnson', rep: 'Sarah Chen', value: '$4,200', time: '5h ago' },
      { id: 'lead-10', name: 'Tony Russo', rep: 'Alex Martin', value: '$6,100', time: '1d ago' },
    ],
  },
  {
    name: 'Closed Lost',
    slug: 'closed_lost',
    color: '#F85149',
    value: '$12,400',
    leads: [
      { id: 'lead-11', name: 'Amanda Nguyen', rep: 'Alex Martin', value: '$2,200', time: '1w ago' },
    ],
  },
];

function LeadCard({ lead, isDragging }: { lead: Lead; isDragging?: boolean }) {
  return (
    <div
      className={cn(
        'group rounded-lg border border-border-subtle bg-surface p-3 transition-all duration-150',
        isDragging
          ? 'rotate-[2deg] scale-105 border-brand bg-surface-elevated shadow-lg'
          : 'hover:border-border hover:bg-surface-elevated'
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-[13px] font-medium text-text-primary">{lead.name}</p>
          <div className="mt-1.5 flex items-center gap-1.5">
            <Avatar name={lead.rep} src={getRepAvatar(lead.rep)} size="sm" className="!h-5 !w-5 !text-[8px]" />
            <span className="text-[11px] text-text-muted">{lead.rep}</span>
          </div>
        </div>
        <GripVertical className="h-3.5 w-3.5 text-text-muted opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-[11px] font-medium text-text-secondary">{lead.value}</span>
        <span className="text-[10px] text-text-muted">{lead.time}</span>
      </div>
    </div>
  );
}

function SortableLeadCard({ lead }: { lead: Lead }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lead.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
      <LeadCard lead={lead} />
    </div>
  );
}

function StageColumn({
  stage,
  isOver,
}: {
  stage: Stage;
  isOver: boolean;
}) {
  return (
    <div
      className={cn(
        'flex w-[272px] shrink-0 flex-col rounded-xl bg-white border transition-colors duration-200',
        isOver ? 'border-brand/50 bg-brand/5' : 'border-border-subtle'
      )}
    >
      {/* Column header */}
      <div
        className="flex items-center justify-between rounded-t-xl px-3 py-2.5"
        style={{ backgroundColor: stage.color }}
      >
        <div className="flex items-center gap-2">
          <h3 className="text-[13px] font-semibold text-white">{stage.name}</h3>
          <span className="text-[11px] font-semibold text-white">{stage.leads.length}</span>
        </div>
        <span className="text-[11px] font-semibold text-white">{stage.value}</span>
      </div>

      {/* Cards */}
      <div className="flex-1 space-y-1.5 overflow-y-auto px-2 pt-2 pb-2 min-h-[80px]">
        <SortableContext items={stage.leads.map((l) => l.id)} strategy={verticalListSortingStrategy}>
          {stage.leads.map((lead) => (
            <SortableLeadCard key={lead.id} lead={lead} />
          ))}
        </SortableContext>

        {/* Add card button */}
        <button className="flex w-full items-center justify-center gap-1 rounded-lg border border-dashed border-border-subtle py-2 text-[11px] text-text-muted transition-colors hover:border-border hover:text-text-secondary">
          <Plus className="h-3 w-3" />
          Add lead
        </button>
      </div>
    </div>
  );
}

export default function PipelinePage() {
  const t = useTranslations('nav');
  const [stages, setStages] = useState<Stage[]>(initialStages);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const findStageByLeadId = (leadId: string): Stage | undefined =>
    stages.find((s) => s.leads.some((l) => l.id === leadId));

  const findLeadById = (leadId: string): Lead | undefined => {
    for (const stage of stages) {
      const lead = stage.leads.find((l) => l.id === leadId);
      if (lead) return lead;
    }
    return undefined;
  };

  const activeLead = activeId ? findLeadById(activeId) : undefined;

  // Find which stage slug is being hovered
  const getOverStageSlug = (): string | null => {
    if (!overId) return null;
    // overId could be a lead id or a stage slug
    const stageBySlug = stages.find((s) => s.slug === overId);
    if (stageBySlug) return stageBySlug.slug;
    const stageByLead = findStageByLeadId(overId);
    return stageByLead?.slug ?? null;
  };

  const overStageSlug = getOverStageSlug();

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) {
      setOverId(null);
      return;
    }

    setOverId(over.id as string);

    const activeStage = findStageByLeadId(active.id as string);
    // Determine if over is a stage or a lead
    let overStage = stages.find((s) => s.slug === (over.id as string));
    if (!overStage) {
      overStage = findStageByLeadId(over.id as string);
    }

    if (!activeStage || !overStage || activeStage.slug === overStage.slug) return;

    // Move lead to the new stage
    setStages((prev) => {
      const activeLeadIndex = activeStage.leads.findIndex((l) => l.id === active.id);
      const lead = activeStage.leads[activeLeadIndex];

      // Determine insertion index
      let overIndex = overStage!.leads.findIndex((l) => l.id === over.id);
      if (overIndex === -1) overIndex = overStage!.leads.length;

      return prev.map((s) => {
        if (s.slug === activeStage.slug) {
          return { ...s, leads: s.leads.filter((l) => l.id !== active.id) };
        }
        if (s.slug === overStage!.slug) {
          const newLeads = [...s.leads];
          newLeads.splice(overIndex, 0, lead);
          return { ...s, leads: newLeads };
        }
        return s;
      });
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);
    setOverId(null);

    if (!over) return;

    const activeStage = findStageByLeadId(active.id as string);
    if (!activeStage) return;

    // Reorder within the same stage
    if (active.id !== over.id) {
      const oldIndex = activeStage.leads.findIndex((l) => l.id === active.id);
      const newIndex = activeStage.leads.findIndex((l) => l.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        setStages((prev) =>
          prev.map((s) => {
            if (s.slug === activeStage.slug) {
              return { ...s, leads: arrayMove(s.leads, oldIndex, newIndex) };
            }
            return s;
          })
        );
      }
    }
  }

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
          <Button size="sm" className="gap-1.5 bg-[#121620] text-white hover:bg-[#1A1F2E]">
            <Plus className="h-3 w-3" />
            New Lead
          </Button>
        </div>
      </div>

      {/* Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-1 gap-3 overflow-x-auto p-4">
          {stages.map((stage) => (
            <StageColumn
              key={stage.slug}
              stage={stage}
              isOver={overStageSlug === stage.slug && findStageByLeadId(activeId ?? '')?.slug !== stage.slug}
            />
          ))}
        </div>

        <DragOverlay dropAnimation={{ duration: 200, easing: 'ease' }}>
          {activeLead ? (
            <div className="w-[248px]">
              <LeadCard lead={activeLead} isDragging />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
