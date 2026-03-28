/**
 * Lead Service
 *
 * CRUD operations, stage transitions, bulk actions, and timeline
 * retrieval for leads. All functions expect a Supabase client to be
 * passed in (server or browser) so they work in both environments.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import type { FilterState, PaginationState, LeadWithRelations } from '@/types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Client = SupabaseClient<any>;
type LeadInsert = Database['public']['Tables']['leads']['Insert'];
type LeadUpdate = Database['public']['Tables']['leads']['Update'];

// ---------------------------------------------------------------------------
// Read
// ---------------------------------------------------------------------------

export async function getLeads(
  supabase: Client,
  filters: Partial<FilterState>,
  pagination: { page: number; per_page: number }
) {
  const { page, per_page } = pagination;
  const from = (page - 1) * per_page;
  const to = from + per_page - 1;

  let query = supabase
    .from('leads')
    .select(
      `
      *,
      household:households(*),
      assigned_rep:profiles!leads_assigned_rep_id_fkey(*),
      territory:territories(*),
      stage:pipeline_stages(*),
      latest_activity:lead_activity_events(*)
    `,
      { count: 'exact' }
    )
    .order('created_at', { ascending: false })
    .range(from, to);

  // Apply filters
  if (filters.search) {
    query = query.or(
      `first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,phone.ilike.%${filters.search}%,email.ilike.%${filters.search}%`
    );
  }
  if (filters.stage_ids && filters.stage_ids.length > 0) {
    query = query.in('stage_id', filters.stage_ids);
  }
  if (filters.territory_ids && filters.territory_ids.length > 0) {
    query = query.in('territory_id', filters.territory_ids);
  }
  if (filters.rep_ids && filters.rep_ids.length > 0) {
    query = query.in('assigned_rep_id', filters.rep_ids);
  }
  if (filters.sources && filters.sources.length > 0) {
    query = query.in('source', filters.sources);
  }
  if (filters.date_range) {
    query = query
      .gte('created_at', filters.date_range.from)
      .lte('created_at', filters.date_range.to);
  }

  const { data, error, count } = await query;

  if (error) throw new Error(error.message);

  const total = count ?? 0;
  const paginationResult: PaginationState = {
    page,
    per_page,
    total,
    total_pages: Math.ceil(total / per_page),
  };

  return { leads: (data ?? []) as LeadWithRelations[], pagination: paginationResult };
}

export async function getLeadById(supabase: Client, id: string) {
  const { data, error } = await supabase
    .from('leads')
    .select(
      `
      *,
      household:households(*),
      assigned_rep:profiles!leads_assigned_rep_id_fkey(*),
      territory:territories(*),
      stage:pipeline_stages(*),
      latest_activity:lead_activity_events(*)
    `
    )
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);
  return data as LeadWithRelations;
}

// ---------------------------------------------------------------------------
// Write
// ---------------------------------------------------------------------------

export async function createLead(
  supabase: Client,
  data: LeadInsert,
  createdBy: string
) {
  const { data: lead, error } = await supabase
    .from('leads')
    .insert(data)
    .select()
    .single();

  if (error) throw new Error(error.message);

  // Create activity event
  await supabase.from('lead_activity_events').insert({
    company_id: data.company_id,
    lead_id: lead.id,
    profile_id: createdBy,
    event_type: 'note_added',
    title: 'Lead created',
    metadata: { source: data.source },
  });

  return lead;
}

export async function updateLead(
  supabase: Client,
  id: string,
  data: LeadUpdate,
  updatedBy: string
) {
  const { data: lead, error } = await supabase
    .from('leads')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  await supabase.from('lead_activity_events').insert({
    company_id: lead.company_id,
    lead_id: id,
    profile_id: updatedBy,
    event_type: 'note_added',
    title: 'Lead updated',
    metadata: { fields_changed: Object.keys(data) },
  });

  return lead;
}

// ---------------------------------------------------------------------------
// Stage transitions
// ---------------------------------------------------------------------------

interface StageChangeMetadata {
  revenue?: number;
  lost_reason?: string;
  notes?: string;
}

export async function changeLeadStage(
  supabase: Client,
  leadId: string,
  newStageId: string,
  changedBy: string,
  metadata: StageChangeMetadata = {}
) {
  // Fetch the target stage to validate transition
  const { data: stage, error: stageError } = await supabase
    .from('pipeline_stages')
    .select('*')
    .eq('id', newStageId)
    .single();

  if (stageError) throw new Error(stageError.message);

  // Validation: closed_won requires revenue
  if (stage.is_closed_won && !metadata.revenue) {
    throw new Error('Revenue is required when closing a deal as won.');
  }

  // Validation: closed_lost requires a reason
  if (stage.is_closed_lost && !metadata.lost_reason) {
    throw new Error('A lost reason is required when closing a deal as lost.');
  }

  // Update lead
  const updatePayload: LeadUpdate = {
    stage_id: newStageId,
    updated_at: new Date().toISOString(),
  };

  if (stage.is_closed_won && metadata.revenue) {
    updatePayload.closed_value = metadata.revenue;
    updatePayload.closed_at = new Date().toISOString();
  }

  const { data: lead, error } = await supabase
    .from('leads')
    .update(updatePayload)
    .eq('id', leadId)
    .select('*, assigned_rep:profiles!leads_assigned_rep_id_fkey(*)')
    .single();

  if (error) throw new Error(error.message);

  // Create activity event
  await supabase.from('lead_activity_events').insert({
    company_id: lead.company_id,
    lead_id: leadId,
    profile_id: changedBy,
    event_type: 'status_change',
    title: `Stage changed to ${stage.name}`,
    metadata: {
      new_stage_id: newStageId,
      new_stage_name: stage.name,
      ...metadata,
    },
  });

  // Auto-create commission entry if closed won
  if (stage.is_closed_won && lead.assigned_rep_id && metadata.revenue) {
    // Find applicable commission rule
    const { data: rule } = await supabase
      .from('commission_rules')
      .select('*')
      .eq('is_active', true)
      .or(
        `applies_to_profile_id.eq.${lead.assigned_rep_id},applies_to_profile_id.is.null`
      )
      .order('applies_to_profile_id', { ascending: false, nullsFirst: false })
      .limit(1)
      .single();

    if (rule) {
      let amount = 0;
      if (rule.type === 'flat' && rule.flat_amount) {
        amount = rule.flat_amount;
      } else if (rule.type === 'percentage' && rule.percentage) {
        amount = metadata.revenue * (rule.percentage / 100);
      }

      if (amount > 0) {
        await supabase.from('commission_entries').insert({
          company_id: lead.company_id,
          profile_id: lead.assigned_rep_id,
          rule_id: rule.id,
          lead_id: leadId,
          amount,
          base_amount: metadata.revenue,
          description: `Commission for ${lead.first_name} ${lead.last_name}`,
        });
      }
    }
  }

  return lead;
}

// ---------------------------------------------------------------------------
// Bulk actions
// ---------------------------------------------------------------------------

export async function bulkAssignRep(
  supabase: Client,
  leadIds: string[],
  repId: string
) {
  const { error } = await supabase
    .from('leads')
    .update({
      assigned_rep_id: repId,
      updated_at: new Date().toISOString(),
    })
    .in('id', leadIds);

  if (error) throw new Error(error.message);
}

export async function bulkChangeStatus(
  supabase: Client,
  leadIds: string[],
  stageId: string
) {
  const { error } = await supabase
    .from('leads')
    .update({
      stage_id: stageId,
      updated_at: new Date().toISOString(),
    })
    .in('id', leadIds);

  if (error) throw new Error(error.message);
}

// ---------------------------------------------------------------------------
// Timeline
// ---------------------------------------------------------------------------

export async function getLeadTimeline(supabase: Client, leadId: string) {
  const { data, error } = await supabase
    .from('lead_activity_events')
    .select('*, profile:profiles(*)')
    .eq('lead_id', leadId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}
