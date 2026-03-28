/**
 * FieldPulse D2D Sales Platform — Permission System
 *
 * Defines a flat permission enum, a role-to-permissions map, and a
 * type-safe `hasPermission` utility type.
 */

import type { UserRole } from "./database";

// ---------------------------------------------------------------------------
// Permission enum
// ---------------------------------------------------------------------------

export enum Permission {
  // -- Leads ---------------------------------------------------------------
  VIEW_ALL_LEADS = "view_all_leads",
  VIEW_TEAM_LEADS = "view_team_leads",
  VIEW_OWN_LEADS = "view_own_leads",
  EDIT_ALL_LEADS = "edit_all_leads",
  EDIT_TEAM_LEADS = "edit_team_leads",
  EDIT_OWN_LEADS = "edit_own_leads",
  DELETE_LEADS = "delete_leads",
  ASSIGN_LEADS = "assign_leads",
  IMPORT_LEADS = "import_leads",
  EXPORT_LEADS = "export_leads",

  // -- Territories ---------------------------------------------------------
  MANAGE_TERRITORIES = "manage_territories",
  VIEW_ALL_TERRITORIES = "view_all_territories",
  VIEW_ASSIGNED_TERRITORY = "view_assigned_territory",

  // -- Teams & Users -------------------------------------------------------
  MANAGE_TEAMS = "manage_teams",
  MANAGE_USERS = "manage_users",
  VIEW_ALL_USERS = "view_all_users",
  VIEW_TEAM_MEMBERS = "view_team_members",
  INVITE_USERS = "invite_users",
  DEACTIVATE_USERS = "deactivate_users",

  // -- Appointments --------------------------------------------------------
  VIEW_ALL_APPOINTMENTS = "view_all_appointments",
  VIEW_OWN_APPOINTMENTS = "view_own_appointments",
  MANAGE_APPOINTMENTS = "manage_appointments",

  // -- Quotes & Contracts --------------------------------------------------
  CREATE_QUOTES = "create_quotes",
  APPROVE_QUOTES = "approve_quotes",
  CREATE_CONTRACTS = "create_contracts",
  VIEW_ALL_QUOTES = "view_all_quotes",
  VIEW_OWN_QUOTES = "view_own_quotes",

  // -- Jobs & Invoices -----------------------------------------------------
  MANAGE_JOBS = "manage_jobs",
  MANAGE_INVOICES = "manage_invoices",
  VIEW_ALL_INVOICES = "view_all_invoices",

  // -- Commissions & Payroll -----------------------------------------------
  MANAGE_COMMISSION_RULES = "manage_commission_rules",
  VIEW_ALL_COMMISSIONS = "view_all_commissions",
  VIEW_OWN_COMMISSIONS = "view_own_commissions",
  APPROVE_COMMISSIONS = "approve_commissions",
  MANAGE_PAYROLL = "manage_payroll",

  // -- Gamification --------------------------------------------------------
  MANAGE_BADGES = "manage_badges",
  MANAGE_CHALLENGES = "manage_challenges",
  MANAGE_BATTLES = "manage_battles",
  VIEW_LEADERBOARD = "view_leaderboard",

  // -- Feed & Messaging ----------------------------------------------------
  CREATE_FEED_POSTS = "create_feed_posts",
  PIN_FEED_POSTS = "pin_feed_posts",
  DELETE_ANY_FEED_POST = "delete_any_feed_post",
  SEND_MESSAGES = "send_messages",

  // -- Field Tracking ------------------------------------------------------
  VIEW_ALL_FIELD_SESSIONS = "view_all_field_sessions",
  VIEW_TEAM_FIELD_SESSIONS = "view_team_field_sessions",
  VIEW_OWN_FIELD_SESSIONS = "view_own_field_sessions",
  VIEW_LIVE_MAP = "view_live_map",

  // -- QR Cards ------------------------------------------------------------
  MANAGE_QR_CARDS = "manage_qr_cards",

  // -- Company Settings ----------------------------------------------------
  MANAGE_COMPANY_SETTINGS = "manage_company_settings",
  MANAGE_PIPELINE_STAGES = "manage_pipeline_stages",

  // -- Reporting -----------------------------------------------------------
  VIEW_COMPANY_REPORTS = "view_company_reports",
  VIEW_TEAM_REPORTS = "view_team_reports",
  VIEW_OWN_REPORTS = "view_own_reports",
}

// ---------------------------------------------------------------------------
// Role → Permission mapping
// ---------------------------------------------------------------------------

/**
 * Maps each role to the set of permissions it grants.
 * Roles are cumulative by convention — higher roles include lower-role
 * permissions. This map is the single source of truth; derive runtime
 * checks from it.
 */
export const RolePermissions: Record<UserRole, Permission[]> = {
  owner: Object.values(Permission), // full access

  admin: [
    // Leads
    Permission.VIEW_ALL_LEADS,
    Permission.VIEW_TEAM_LEADS,
    Permission.VIEW_OWN_LEADS,
    Permission.EDIT_ALL_LEADS,
    Permission.EDIT_TEAM_LEADS,
    Permission.EDIT_OWN_LEADS,
    Permission.DELETE_LEADS,
    Permission.ASSIGN_LEADS,
    Permission.IMPORT_LEADS,
    Permission.EXPORT_LEADS,
    // Territories
    Permission.MANAGE_TERRITORIES,
    Permission.VIEW_ALL_TERRITORIES,
    Permission.VIEW_ASSIGNED_TERRITORY,
    // Teams & Users
    Permission.MANAGE_TEAMS,
    Permission.MANAGE_USERS,
    Permission.VIEW_ALL_USERS,
    Permission.VIEW_TEAM_MEMBERS,
    Permission.INVITE_USERS,
    Permission.DEACTIVATE_USERS,
    // Appointments
    Permission.VIEW_ALL_APPOINTMENTS,
    Permission.VIEW_OWN_APPOINTMENTS,
    Permission.MANAGE_APPOINTMENTS,
    // Quotes & Contracts
    Permission.CREATE_QUOTES,
    Permission.APPROVE_QUOTES,
    Permission.CREATE_CONTRACTS,
    Permission.VIEW_ALL_QUOTES,
    Permission.VIEW_OWN_QUOTES,
    // Jobs & Invoices
    Permission.MANAGE_JOBS,
    Permission.MANAGE_INVOICES,
    Permission.VIEW_ALL_INVOICES,
    // Commissions
    Permission.MANAGE_COMMISSION_RULES,
    Permission.VIEW_ALL_COMMISSIONS,
    Permission.VIEW_OWN_COMMISSIONS,
    Permission.APPROVE_COMMISSIONS,
    Permission.MANAGE_PAYROLL,
    // Gamification
    Permission.MANAGE_BADGES,
    Permission.MANAGE_CHALLENGES,
    Permission.MANAGE_BATTLES,
    Permission.VIEW_LEADERBOARD,
    // Feed
    Permission.CREATE_FEED_POSTS,
    Permission.PIN_FEED_POSTS,
    Permission.DELETE_ANY_FEED_POST,
    Permission.SEND_MESSAGES,
    // Field Tracking
    Permission.VIEW_ALL_FIELD_SESSIONS,
    Permission.VIEW_TEAM_FIELD_SESSIONS,
    Permission.VIEW_OWN_FIELD_SESSIONS,
    Permission.VIEW_LIVE_MAP,
    // QR
    Permission.MANAGE_QR_CARDS,
    // Pipeline
    Permission.MANAGE_PIPELINE_STAGES,
    // Reports
    Permission.VIEW_COMPANY_REPORTS,
    Permission.VIEW_TEAM_REPORTS,
    Permission.VIEW_OWN_REPORTS,
  ],

  team_leader: [
    // Leads — team scope
    Permission.VIEW_TEAM_LEADS,
    Permission.VIEW_OWN_LEADS,
    Permission.EDIT_TEAM_LEADS,
    Permission.EDIT_OWN_LEADS,
    Permission.ASSIGN_LEADS,
    Permission.EXPORT_LEADS,
    // Territories
    Permission.VIEW_ALL_TERRITORIES,
    Permission.VIEW_ASSIGNED_TERRITORY,
    // Teams
    Permission.VIEW_TEAM_MEMBERS,
    // Appointments
    Permission.VIEW_ALL_APPOINTMENTS,
    Permission.VIEW_OWN_APPOINTMENTS,
    Permission.MANAGE_APPOINTMENTS,
    // Quotes & Contracts
    Permission.CREATE_QUOTES,
    Permission.CREATE_CONTRACTS,
    Permission.VIEW_ALL_QUOTES,
    Permission.VIEW_OWN_QUOTES,
    // Commissions
    Permission.VIEW_OWN_COMMISSIONS,
    // Gamification
    Permission.MANAGE_CHALLENGES,
    Permission.MANAGE_BATTLES,
    Permission.VIEW_LEADERBOARD,
    // Feed
    Permission.CREATE_FEED_POSTS,
    Permission.SEND_MESSAGES,
    // Field Tracking
    Permission.VIEW_TEAM_FIELD_SESSIONS,
    Permission.VIEW_OWN_FIELD_SESSIONS,
    Permission.VIEW_LIVE_MAP,
    // QR
    Permission.MANAGE_QR_CARDS,
    // Reports
    Permission.VIEW_TEAM_REPORTS,
    Permission.VIEW_OWN_REPORTS,
  ],

  sales_rep: [
    // Leads — own scope
    Permission.VIEW_OWN_LEADS,
    Permission.EDIT_OWN_LEADS,
    // Territories
    Permission.VIEW_ASSIGNED_TERRITORY,
    // Appointments
    Permission.VIEW_OWN_APPOINTMENTS,
    Permission.MANAGE_APPOINTMENTS,
    // Quotes & Contracts
    Permission.CREATE_QUOTES,
    Permission.CREATE_CONTRACTS,
    Permission.VIEW_OWN_QUOTES,
    // Commissions
    Permission.VIEW_OWN_COMMISSIONS,
    // Gamification
    Permission.VIEW_LEADERBOARD,
    // Feed
    Permission.CREATE_FEED_POSTS,
    Permission.SEND_MESSAGES,
    // Field Tracking
    Permission.VIEW_OWN_FIELD_SESSIONS,
    // QR
    Permission.MANAGE_QR_CARDS,
    // Reports
    Permission.VIEW_OWN_REPORTS,
  ],
};

// ---------------------------------------------------------------------------
// Utility helpers
// ---------------------------------------------------------------------------

/** Frozen set version for O(1) lookups at runtime. */
export const RolePermissionSets: Record<UserRole, ReadonlySet<Permission>> = {
  owner: new Set(RolePermissions.owner),
  admin: new Set(RolePermissions.admin),
  team_leader: new Set(RolePermissions.team_leader),
  sales_rep: new Set(RolePermissions.sales_rep),
};

/**
 * Check whether a role includes a specific permission.
 *
 * @example
 * ```ts
 * if (hasPermission(user.role, Permission.MANAGE_TERRITORIES)) {
 *   // show territory editor
 * }
 * ```
 */
export function hasPermission(role: UserRole, permission: Permission): boolean {
  return RolePermissionSets[role].has(permission);
}

/**
 * Check whether a role includes ALL of the provided permissions.
 */
export function hasAllPermissions(
  role: UserRole,
  permissions: Permission[],
): boolean {
  const set = RolePermissionSets[role];
  return permissions.every((p) => set.has(p));
}

/**
 * Check whether a role includes ANY of the provided permissions.
 */
export function hasAnyPermission(
  role: UserRole,
  permissions: Permission[],
): boolean {
  const set = RolePermissionSets[role];
  return permissions.some((p) => set.has(p));
}

/**
 * Type-level helper: narrows a UserRole to only those roles that hold a
 * given permission. Useful for generic guards.
 *
 * @example
 * ```ts
 * type CanManageTerritories = RoleWithPermission<Permission.MANAGE_TERRITORIES>;
 * // => "owner" | "admin"
 * ```
 */
export type RoleWithPermission<P extends Permission> = {
  [R in UserRole]: P extends (typeof RolePermissions)[R][number] ? R : never;
}[UserRole];
