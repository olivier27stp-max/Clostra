/**
 * Commission Service
 *
 * Calculate, approve, reverse, and query commission entries.
 * Manages commission rules and payroll preview aggregation.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { CommissionEntryStatus } from '@/types/database';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Client = SupabaseClient<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CommissionRuleInsert = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CommissionRuleUpdate = any;

// ---------------------------------------------------------------------------
// Calculate & Create
// ---------------------------------------------------------------------------

export async function calculateCommission(
  supabase: Client,
  leadId: string,
  repId: string
) {
  // Get lead with closed value
  const { data: lead, error: leadErr } = await supabase
    .from('leads')
    .select('*')
    .eq('id', leadId)
    .single();

  if (leadErr) throw new Error(leadErr.message);
  if (!lead.closed_value) throw new Error('Lead has no closed value.');

  // Find applicable commission rule
  const { data: rule, error: ruleErr } = await supabase
    .from('commission_rules')
    .select('*')
    .eq('is_active', true)
    .or(`applies_to_profile_id.eq.${repId},applies_to_profile_id.is.null`)
    .order('applies_to_profile_id', { ascending: false, nullsFirst: false })
    .limit(1)
    .single();

  if (ruleErr) throw new Error('No applicable commission rule found.');

  let amount = 0;

  switch (rule.type) {
    case 'flat':
      amount = rule.flat_amount ?? 0;
      break;
    case 'percentage':
      amount = lead.closed_value * ((rule.percentage ?? 0) / 100);
      break;
    case 'tiered': {
      const tiers = (rule.tiers ?? []) as Array<{
        min: number;
        max: number;
        rate: number;
      }>;
      const tier = tiers.find(
        (t) => lead.closed_value! >= t.min && lead.closed_value! <= t.max
      );
      if (tier) {
        amount = lead.closed_value * (tier.rate / 100);
      }
      break;
    }
  }

  const { data: entry, error: entryErr } = await supabase
    .from('commission_entries')
    .insert({
      company_id: lead.company_id,
      profile_id: repId,
      rule_id: rule.id,
      lead_id: leadId,
      amount: Math.round(amount * 100) / 100,
      base_amount: lead.closed_value,
      description: `Commission for ${lead.first_name} ${lead.last_name}`,
    })
    .select()
    .single();

  if (entryErr) throw new Error(entryErr.message);
  return entry;
}

// ---------------------------------------------------------------------------
// Query
// ---------------------------------------------------------------------------

export async function getCommissionEntries(
  supabase: Client,
  options: {
    profileId?: string;
    dateRange?: { from: string; to: string };
    status?: CommissionEntryStatus;
  } = {}
) {
  let query = supabase
    .from('commission_entries')
    .select(
      '*, lead:leads(*), rule:commission_rules(*), profile:profiles(*)'
    )
    .order('created_at', { ascending: false });

  if (options.profileId) {
    query = query.eq('profile_id', options.profileId);
  }
  if (options.status) {
    query = query.eq('status', options.status);
  }
  if (options.dateRange) {
    query = query
      .gte('created_at', options.dateRange.from)
      .lte('created_at', options.dateRange.to);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data ?? [];
}

// ---------------------------------------------------------------------------
// Payroll preview
// ---------------------------------------------------------------------------

export async function getPayrollPreview(
  supabase: Client,
  profileId: string,
  periodStart: string,
  periodEnd: string
) {
  const { data, error } = await supabase
    .from('commission_entries')
    .select('*')
    .eq('profile_id', profileId)
    .gte('created_at', periodStart)
    .lte('created_at', periodEnd);

  if (error) throw new Error(error.message);

  const entries = data ?? [];
  const totalPending = entries
    .filter((e) => e.status === 'pending')
    .reduce((sum, e) => sum + e.amount, 0);
  const totalApproved = entries
    .filter((e) => e.status === 'approved')
    .reduce((sum, e) => sum + e.amount, 0);
  const totalPaid = entries
    .filter((e) => e.status === 'paid')
    .reduce((sum, e) => sum + e.amount, 0);
  const totalReversed = entries
    .filter((e) => e.status === 'reversed')
    .reduce((sum, e) => sum + e.amount, 0);

  return {
    entries,
    summary: {
      total: entries.reduce((sum, e) => sum + e.amount, 0),
      pending: totalPending,
      approved: totalApproved,
      paid: totalPaid,
      reversed: totalReversed,
      count: entries.length,
    },
  };
}

// ---------------------------------------------------------------------------
// Approve / Reverse
// ---------------------------------------------------------------------------

export async function approveCommission(
  supabase: Client,
  entryId: string,
  approvedBy: string
) {
  const { data, error } = await supabase
    .from('commission_entries')
    .update({
      status: 'approved' as CommissionEntryStatus,
      approved_by: approvedBy,
      approved_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', entryId)
    .eq('status', 'pending')
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function reverseCommission(
  supabase: Client,
  entryId: string,
  _reason: string
) {
  // Do not reverse already-paid commissions
  const { data: existing, error: fetchErr } = await supabase
    .from('commission_entries')
    .select('*')
    .eq('id', entryId)
    .single();

  if (fetchErr) throw new Error(fetchErr.message);
  if (existing.status === 'paid') {
    throw new Error('Cannot reverse a commission that has already been paid.');
  }

  const { data, error } = await supabase
    .from('commission_entries')
    .update({
      status: 'reversed' as CommissionEntryStatus,
      updated_at: new Date().toISOString(),
    })
    .eq('id', entryId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// ---------------------------------------------------------------------------
// Recalculate for lead
// ---------------------------------------------------------------------------

export async function recalculateForLead(
  supabase: Client,
  leadId: string
) {
  // Find existing entries for the lead that are not already paid
  const { data: entries, error } = await supabase
    .from('commission_entries')
    .select('*')
    .eq('lead_id', leadId);

  if (error) throw new Error(error.message);

  for (const entry of entries ?? []) {
    // Guard: never reverse paid commissions
    if (entry.status === 'paid') continue;

    // Reverse the old entry
    await supabase
      .from('commission_entries')
      .update({ status: 'reversed' as CommissionEntryStatus })
      .eq('id', entry.id);

    // Recalculate
    await calculateCommission(supabase, leadId, entry.profile_id);
  }
}

// ---------------------------------------------------------------------------
// Commission Rules CRUD
// ---------------------------------------------------------------------------

export async function getCommissionRules(supabase: Client) {
  const { data, error } = await supabase
    .from('commission_rules')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function createCommissionRule(
  supabase: Client,
  data: CommissionRuleInsert
) {
  const { data: rule, error } = await supabase
    .from('commission_rules')
    .insert(data)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return rule;
}

export async function updateCommissionRule(
  supabase: Client,
  id: string,
  data: CommissionRuleUpdate
) {
  const { data: rule, error } = await supabase
    .from('commission_rules')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return rule;
}
