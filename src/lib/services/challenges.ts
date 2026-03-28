/**
 * Challenge & Gamification Service
 *
 * Manages challenges, battles, badges, and the social feed.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { ChallengeStatus, BattleStatus, FeedVisibility } from '@/types/database';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Client = SupabaseClient<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ChallengeInsert = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type BattleInsert = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FeedPostInsert = any;

// ---------------------------------------------------------------------------
// Challenges
// ---------------------------------------------------------------------------

export async function createChallenge(
  supabase: Client,
  data: ChallengeInsert
) {
  const { data: challenge, error } = await supabase
    .from('challenges')
    .insert(data)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return challenge;
}

export async function joinChallenge(
  supabase: Client,
  challengeId: string,
  profileId: string
) {
  const { data, error } = await supabase
    .from('challenge_participants')
    .insert({
      challenge_id: challengeId,
      profile_id: profileId,
      current_value: 0,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateChallengeProgress(
  supabase: Client,
  challengeId: string
) {
  // Get challenge details
  const { data: challenge, error: cErr } = await supabase
    .from('challenges')
    .select('*')
    .eq('id', challengeId)
    .single();

  if (cErr) throw new Error(cErr.message);

  // Get all participants
  const { data: participants, error: pErr } = await supabase
    .from('challenge_participants')
    .select('*, profile:profiles(*)')
    .eq('challenge_id', challengeId);

  if (pErr) throw new Error(pErr.message);

  // Recalculate each participant's score based on the metric
  for (const participant of participants ?? []) {
    const { data: events } = await supabase
      .from('lead_activity_events')
      .select('*')
      .eq('profile_id', participant.profile_id)
      .eq('event_type', challenge.metric_slug)
      .gte('created_at', challenge.start_date)
      .lte('created_at', challenge.end_date);

    const score = events?.length ?? 0;

    await supabase
      .from('challenge_participants')
      .update({ current_value: score })
      .eq('id', participant.id);
  }
}

export async function evaluateChallenge(
  supabase: Client,
  challengeId: string
) {
  await updateChallengeProgress(supabase, challengeId);

  // Get participants sorted by score
  const { data: participants } = await supabase
    .from('challenge_participants')
    .select('*')
    .eq('challenge_id', challengeId)
    .order('current_value', { ascending: false });

  // Mark challenge as completed
  await supabase
    .from('challenges')
    .update({
      status: 'completed' as ChallengeStatus,
      updated_at: new Date().toISOString(),
    })
    .eq('id', challengeId);

  // Award badge to winner(s)
  if (participants && participants.length > 0) {
    const winner = participants[0];
    await checkAndAwardBadges(supabase, winner.profile_id);
  }

  return participants ?? [];
}

export async function getActiveChallenges(supabase: Client) {
  const { data, error } = await supabase
    .from('challenges')
    .select('*, participants:challenge_participants(*, profile:profiles(*))')
    .eq('status', 'active')
    .order('end_date', { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getRepChallenges(
  supabase: Client,
  profileId: string
) {
  const { data, error } = await supabase
    .from('challenge_participants')
    .select('*, challenge:challenges(*)')
    .eq('profile_id', profileId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

// ---------------------------------------------------------------------------
// Battles
// ---------------------------------------------------------------------------

export async function createBattle(
  supabase: Client,
  data: BattleInsert
) {
  const { data: battle, error } = await supabase
    .from('battles')
    .insert(data)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return battle;
}

export async function updateBattleScores(
  supabase: Client,
  battleId: string
) {
  const { data: battle, error } = await supabase
    .from('battles')
    .select('*')
    .eq('id', battleId)
    .single();

  if (error) throw new Error(error.message);

  // Count events for each side within the battle period
  const countEvents = async (profileId: string | null) => {
    if (!profileId) return 0;
    const { count } = await supabase
      .from('lead_activity_events')
      .select('*', { count: 'exact', head: true })
      .eq('profile_id', profileId)
      .eq('event_type', battle.metric_slug)
      .gte('created_at', battle.start_date)
      .lte('created_at', battle.end_date);
    return count ?? 0;
  };

  const challengerScore = await countEvents(battle.challenger_profile_id);
  const opponentScore = await countEvents(battle.opponent_profile_id);

  await supabase
    .from('battles')
    .update({
      challenger_score: challengerScore,
      opponent_score: opponentScore,
      updated_at: new Date().toISOString(),
    })
    .eq('id', battleId);

  return { challengerScore, opponentScore };
}

// ---------------------------------------------------------------------------
// Badges
// ---------------------------------------------------------------------------

export async function checkAndAwardBadges(
  supabase: Client,
  profileId: string
) {
  // Get all badges
  const { data: badges } = await supabase
    .from('badges')
    .select('*')
    .eq('is_active', true);

  // Get already-earned badges
  const { data: earned } = await supabase
    .from('rep_badges')
    .select('badge_id')
    .eq('profile_id', profileId);

  const earnedIds = new Set((earned ?? []).map((e) => e.badge_id));

  for (const badge of badges ?? []) {
    if (earnedIds.has(badge.id)) continue;

    // Evaluate condition based on badge criteria
    const criteria = badge.criteria as Record<string, unknown> | null;
    if (!criteria?.metric || !criteria?.threshold) continue;

    const { count } = await supabase
      .from('lead_activity_events')
      .select('*', { count: 'exact', head: true })
      .eq('profile_id', profileId)
      .eq('event_type', criteria.metric as string);

    if ((count ?? 0) >= (criteria.threshold as number)) {
      await supabase.from('rep_badges').insert({
        profile_id: profileId,
        badge_id: badge.id,
      });
    }
  }
}

export async function getRepBadges(supabase: Client, profileId: string) {
  const { data, error } = await supabase
    .from('rep_badges')
    .select('*, badge:badges(*)')
    .eq('profile_id', profileId)
    .order('earned_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

// ---------------------------------------------------------------------------
// Feed
// ---------------------------------------------------------------------------

export async function createFeedPost(
  supabase: Client,
  data: FeedPostInsert
) {
  const { data: post, error } = await supabase
    .from('feed_posts')
    .insert(data)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return post;
}

export async function getFeed(
  supabase: Client,
  visibility: FeedVisibility,
  teamId?: string,
  cursor?: string
) {
  let query = supabase
    .from('feed_posts')
    .select('*, profile:profiles(*)')
    .eq('visibility', visibility)
    .order('created_at', { ascending: false })
    .limit(20);

  if (teamId) {
    query = query.eq('team_id', teamId);
  }

  if (cursor) {
    query = query.lt('created_at', cursor);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function addReaction(
  supabase: Client,
  postId: string,
  profileId: string,
  type: string
) {
  const { data, error } = await supabase
    .from('feed_reactions')
    .insert({
      post_id: postId,
      profile_id: profileId,
      emoji: type,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function removeReaction(
  supabase: Client,
  postId: string,
  profileId: string
) {
  const { error } = await supabase
    .from('feed_reactions')
    .delete()
    .eq('post_id', postId)
    .eq('profile_id', profileId);

  if (error) throw new Error(error.message);
}

export async function addComment(
  supabase: Client,
  postId: string,
  profileId: string,
  content: string
) {
  const { data, error } = await supabase
    .from('feed_comments')
    .insert({
      post_id: postId,
      profile_id: profileId,
      content,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}
