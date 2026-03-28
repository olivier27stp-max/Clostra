/**
 * Field Session Service
 *
 * Manages field sessions (start, pause, resume, end), check-in records,
 * GPS tracking points, and queries for active sessions.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { FieldSessionStatus } from '@/types/database';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Client = SupabaseClient<any>;

// ---------------------------------------------------------------------------
// Session lifecycle
// ---------------------------------------------------------------------------

export async function startSession(
  supabase: Client,
  options: {
    profileId: string;
    companyId: string;
    territoryId?: string;
    latitude: number;
    longitude: number;
  }
) {
  const { profileId, companyId, territoryId, latitude, longitude } = options;

  // Ensure no active session already exists
  const { data: existing } = await supabase
    .from('field_sessions')
    .select('id')
    .eq('profile_id', profileId)
    .eq('status', 'active')
    .maybeSingle();

  if (existing) {
    throw new Error('An active field session already exists. End it before starting a new one.');
  }

  // Create field session
  const { data: session, error } = await supabase
    .from('field_sessions')
    .insert({
      company_id: companyId,
      profile_id: profileId,
      territory_id: territoryId ?? null,
      status: 'active' as FieldSessionStatus,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  // Create check-in record
  await supabase.from('check_in_records').insert({
    company_id: companyId,
    profile_id: profileId,
    field_session_id: session.id,
    type: 'check_in',
    latitude,
    longitude,
  });

  return session;
}

export async function endSession(
  supabase: Client,
  sessionId: string,
  latitude: number,
  longitude: number
) {
  const { data: session, error: fetchErr } = await supabase
    .from('field_sessions')
    .select('*')
    .eq('id', sessionId)
    .single();

  if (fetchErr) throw new Error(fetchErr.message);

  const startedAt = new Date(session.started_at);
  const now = new Date();
  const durationMinutes = Math.round(
    (now.getTime() - startedAt.getTime()) / 60000
  );

  const { data: updated, error } = await supabase
    .from('field_sessions')
    .update({
      status: 'completed' as FieldSessionStatus,
      completed_at: now.toISOString(),
      total_duration_minutes: durationMinutes,
      updated_at: now.toISOString(),
    })
    .eq('id', sessionId)
    .select()
    .single();

  if (error) throw new Error(error.message);

  // Create check-out record
  await supabase.from('check_in_records').insert({
    company_id: session.company_id,
    profile_id: session.profile_id,
    field_session_id: sessionId,
    type: 'check_out',
    latitude,
    longitude,
  });

  return updated;
}

export async function pauseSession(supabase: Client, sessionId: string) {
  const { data, error } = await supabase
    .from('field_sessions')
    .update({
      status: 'paused' as FieldSessionStatus,
      paused_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', sessionId)
    .eq('status', 'active')
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function resumeSession(supabase: Client, sessionId: string) {
  const { data, error } = await supabase
    .from('field_sessions')
    .update({
      status: 'active' as FieldSessionStatus,
      paused_at: null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', sessionId)
    .eq('status', 'paused')
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// ---------------------------------------------------------------------------
// GPS tracking
// ---------------------------------------------------------------------------

export async function recordGpsPoint(
  supabase: Client,
  sessionId: string,
  profileId: string,
  lat: number,
  lng: number,
  accuracy: number | null = null
) {
  const { data, error } = await supabase
    .from('gps_points')
    .insert({
      field_session_id: sessionId,
      profile_id: profileId,
      latitude: lat,
      longitude: lng,
      accuracy,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

export async function getActiveSession(supabase: Client, profileId: string) {
  const { data, error } = await supabase
    .from('field_sessions')
    .select('*, territory:territories(*)')
    .eq('profile_id', profileId)
    .in('status', ['active', 'paused'])
    .order('started_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}

export async function getSessionHistory(
  supabase: Client,
  profileId: string,
  dateRange: { from: string; to: string }
) {
  const { data, error } = await supabase
    .from('field_sessions')
    .select('*, territory:territories(*)')
    .eq('profile_id', profileId)
    .gte('started_at', dateRange.from)
    .lte('started_at', dateRange.to)
    .order('started_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getActiveSessions(supabase: Client) {
  const { data, error } = await supabase
    .from('field_sessions')
    .select('*, profile:profiles(*), territory:territories(*)')
    .eq('status', 'active')
    .order('started_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}
