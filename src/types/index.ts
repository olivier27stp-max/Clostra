/**
 * FieldPulse D2D Sales Platform — Application-Level Types
 *
 * Re-exports all database types and defines rich, relation-aware types
 * used throughout the application layer.
 */

export * from "./database";
export * from "./permissions";

import type {
  Row,
  UserRole,
  FeedPostType,
  FeedVisibility,
  ConversationType,
  MessageType,
  CommissionEntryStatus,
  PayrollPreviewStatus,
  ChallengeType,
  ChallengeStatus,
  BattleType,
  BattleStatus,
} from "./database";

// ---------------------------------------------------------------------------
// Relation types — enriched rows returned by joins / RPCs
// ---------------------------------------------------------------------------

/** A lead hydrated with its most common relations. */
export interface LeadWithRelations extends Row<"leads"> {
  household: Row<"households"> | null;
  assigned_rep: Row<"profiles"> | null;
  territory: Row<"territories"> | null;
  stage: Row<"pipeline_stages">;
  latest_activity: Row<"lead_activity_events"> | null;
}

/** An appointment with its associated lead and rep profile. */
export interface AppointmentWithRelations extends Row<"appointments"> {
  lead: Row<"leads"> | null;
  rep: Row<"profiles">;
}

/** A team with its leader, member list, and territory count. */
export interface TeamWithMembers extends Row<"teams"> {
  leader: Row<"profiles"> | null;
  members: Row<"profiles">[];
  territory_count: number;
}

/** A territory enriched with assignment and lead statistics. */
export interface TerritoryWithAssignments extends Row<"territories"> {
  assigned_reps: Row<"profiles">[];
  assigned_team: Row<"teams"> | null;
  lead_count: number;
  stats: {
    total_leads: number;
    open_leads: number;
    closed_won: number;
    closed_lost: number;
    revenue: number;
  };
}

// ---------------------------------------------------------------------------
// Leaderboard & Performance
// ---------------------------------------------------------------------------

/** A single row on any leaderboard view. */
export interface LeaderboardEntry {
  rank: number;
  profile: Row<"profiles">;
  closes: number;
  revenue: number;
  /** Percentage change vs. previous period. Positive = up. */
  trend: number;
  team: Row<"teams"> | null;
}

/** Full KPI breakdown for a single rep. */
export interface RepPerformanceDetail {
  doors_knocked: number;
  conversations: number;
  demos_set: number;
  demos_held: number;
  quotes_sent: number;
  closes: number;
  revenue: number;
  conversion_rate: number;
  average_ticket: number;
  follow_ups_completed: number;
}

// ---------------------------------------------------------------------------
// Social Feed
// ---------------------------------------------------------------------------

/** A feed post with aggregated reaction/comment counts and the current user's reaction. */
export interface FeedPostWithRelations extends Row<"feed_posts"> {
  profile: Row<"profiles">;
  reactions_count: number;
  comments_count: number;
  /** The emoji the current user reacted with, or null if none. */
  user_reaction: string | null;
}

// ---------------------------------------------------------------------------
// Messaging
// ---------------------------------------------------------------------------

/** A conversation summary suitable for an inbox list. */
export interface ConversationWithDetails extends Row<"conversations"> {
  participants: Row<"profiles">[];
  last_message: Row<"messages"> | null;
  unread_count: number;
}

// ---------------------------------------------------------------------------
// Commissions & Payroll
// ---------------------------------------------------------------------------

/** A commission entry joined with its related lead, rule, and rep profile. */
export interface CommissionEntryWithDetails extends Row<"commission_entries"> {
  lead: Row<"leads"> | null;
  rule: Row<"commission_rules">;
  profile: Row<"profiles">;
}

/** A payroll preview with all its commission entries. */
export interface PayrollPreviewWithEntries extends Row<"payroll_previews"> {
  entries: CommissionEntryWithDetails[];
}

// ---------------------------------------------------------------------------
// Challenges & Battles
// ---------------------------------------------------------------------------

/** A challenge with its participant list (each participant includes their profile). */
export interface ChallengeParticipant extends Row<"challenge_participants"> {
  profile: Row<"profiles">;
}

export interface ChallengeWithParticipants extends Row<"challenges"> {
  participants: ChallengeParticipant[];
}

/** A battle with full details for both sides. */
export interface BattleWithDetails extends Row<"battles"> {
  challenger_profile: Row<"profiles"> | null;
  challenger_team: Row<"teams"> | null;
  opponent_profile: Row<"profiles"> | null;
  opponent_team: Row<"teams"> | null;
}

// ---------------------------------------------------------------------------
// Map types — lightweight projections for map rendering
// ---------------------------------------------------------------------------

/** Minimal lead data for rendering map pins. */
export interface MapLead {
  id: string;
  latitude: number;
  longitude: number;
  stage_slug: string;
  stage_color: string;
  first_name: string;
  last_name: string;
  assigned_rep_id: string | null;
}

/** Territory boundary data for map polygon rendering. */
export interface MapTerritory {
  id: string;
  name: string;
  color: string;
  /** GeoJSON geometry object. */
  geometry: Record<string, unknown>;
  assigned_team_id: string | null;
  assigned_rep_ids: string[];
  lead_count: number;
}

/** Real-time rep position for live map tracking. */
export interface MapRepPosition {
  profile_id: string;
  latitude: number;
  longitude: number;
  accuracy: number | null;
  recorded_at: string;
  is_active: boolean;
  field_session_id: string | null;
}

// ---------------------------------------------------------------------------
// Offline & Sync
// ---------------------------------------------------------------------------

/** An item queued for sync when the device is offline. */
export interface OfflineQueueItem {
  id: string;
  /** The mutation verb: "insert" | "update" | "delete". */
  type: "insert" | "update" | "delete";
  /** The Supabase table name. */
  table: string;
  /** The row payload to sync. */
  data: Record<string, unknown>;
  created_at: string;
  synced: boolean;
  retry_count: number;
}

/** Global sync status for the offline queue. */
export interface SyncStatus {
  last_synced_at: string | null;
  pending_count: number;
  is_syncing: boolean;
  errors: string[];
}

// ---------------------------------------------------------------------------
// Quotes
// ---------------------------------------------------------------------------

/** A single line item within a quote or invoice. */
export interface QuoteLineItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------

/** KPIs shown on the owner / admin dashboard. */
export interface OwnerDashboardStats {
  total_revenue: number;
  total_closes: number;
  total_leads: number;
  total_doors_knocked: number;
  active_reps: number;
  active_field_sessions: number;
  conversion_rate: number;
  average_ticket: number;
  revenue_trend: number;
  closes_trend: number;
  top_reps: LeaderboardEntry[];
  pipeline_summary: { stage_id: string; stage_name: string; count: number }[];
}

/** KPIs shown on the individual rep dashboard. */
export interface RepDashboardStats {
  doors_knocked: number;
  conversations: number;
  demos_set: number;
  demos_held: number;
  quotes_sent: number;
  closes: number;
  revenue: number;
  conversion_rate: number;
  average_ticket: number;
  follow_ups_due: number;
  appointments_today: number;
  active_field_session: Row<"field_sessions"> | null;
  pending_commissions: number;
  recent_activity: Row<"lead_activity_events">[];
}

/** Union type covering both dashboard variants. */
export type DashboardStats = OwnerDashboardStats | RepDashboardStats;

// ---------------------------------------------------------------------------
// UI State types
// ---------------------------------------------------------------------------

/** Generic filter state usable across any table/list view. */
export interface FilterState {
  search: string;
  stage_ids: string[];
  territory_ids: string[];
  team_ids: string[];
  rep_ids: string[];
  sources: string[];
  statuses: string[];
  date_range: DateRange | null;
  tags: string[];
  [key: string]: unknown;
}

/** Pagination state for paginated list views. */
export interface PaginationState {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

/** A date range with inclusive start and end. */
export interface DateRange {
  /** ISO 8601 date string. */
  from: string;
  /** ISO 8601 date string. */
  to: string;
}
