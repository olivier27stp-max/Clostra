/**
 * Flat permission constants and role-permission map.
 *
 * This mirrors the enum-based system in @/types/permissions but uses plain
 * string constants, which are friendlier for runtime guards and component props.
 */

export const PERMISSIONS = {
  // Dashboard
  VIEW_DASHBOARD: 'view_dashboard',
  VIEW_ALL_STATS: 'view_all_stats',
  VIEW_TEAM_STATS: 'view_team_stats',
  VIEW_OWN_STATS: 'view_own_stats',
  // Leads
  VIEW_ALL_LEADS: 'view_all_leads',
  VIEW_TEAM_LEADS: 'view_team_leads',
  VIEW_OWN_LEADS: 'view_own_leads',
  CREATE_LEAD: 'create_lead',
  EDIT_ANY_LEAD: 'edit_any_lead',
  EDIT_OWN_LEAD: 'edit_own_lead',
  DELETE_LEAD: 'delete_lead',
  BULK_ASSIGN_LEADS: 'bulk_assign_leads',
  // Map & Territories / Zones
  VIEW_MAP: 'view_map',
  MANAGE_TERRITORIES: 'manage_territories',
  CREATE_ZONE: 'create_zone',
  ASSIGN_ZONE: 'assign_zone',
  EDIT_ANY_ZONE: 'edit_any_zone',
  DELETE_ANY_ZONE: 'delete_any_zone',
  DELETE_OWN_ZONE: 'delete_own_zone',
  VIEW_ALL_ZONES: 'view_all_zones',
  VIEW_ASSIGNED_ZONES: 'view_assigned_zones',
  VIEW_LIVE_TRACKING: 'view_live_tracking',
  VIEW_TEAM_TRACKING: 'view_team_tracking',
  // Pipeline
  VIEW_PIPELINE: 'view_pipeline',
  CONFIGURE_PIPELINE: 'configure_pipeline',
  // Calendar
  VIEW_ALL_CALENDARS: 'view_all_calendars',
  VIEW_TEAM_CALENDARS: 'view_team_calendars',
  VIEW_OWN_CALENDAR: 'view_own_calendar',
  MANAGE_CALENDAR_INTEGRATIONS: 'manage_calendar_integrations',
  // Leaderboard
  VIEW_LEADERBOARD: 'view_leaderboard',
  VIEW_REP_DETAILS: 'view_rep_details',
  // Teams
  MANAGE_ALL_TEAMS: 'manage_all_teams',
  MANAGE_OWN_TEAM: 'manage_own_team',
  // Commissions
  VIEW_ALL_COMMISSIONS: 'view_all_commissions',
  VIEW_TEAM_COMMISSIONS: 'view_team_commissions',
  VIEW_OWN_COMMISSIONS: 'view_own_commissions',
  CONFIGURE_COMMISSIONS: 'configure_commissions',
  APPROVE_COMMISSIONS: 'approve_commissions',
  // Reports
  VIEW_ALL_REPORTS: 'view_all_reports',
  VIEW_TEAM_REPORTS: 'view_team_reports',
  EXPORT_REPORTS: 'export_reports',
  // Settings
  MANAGE_COMPANY_SETTINGS: 'manage_company_settings',
  MANAGE_ROLES: 'manage_roles',
  MANAGE_BADGES: 'manage_badges',
  MANAGE_CHALLENGES: 'manage_challenges',
  // Communication
  VIEW_ALL_MESSAGES: 'view_all_messages',
  SEND_MESSAGES: 'send_messages',
  // Feed
  VIEW_FEED: 'view_feed',
  POST_TO_FEED: 'post_to_feed',
  // Quotes & Contracts
  CREATE_QUOTE: 'create_quote',
  CREATE_CONTRACT: 'create_contract',
  SIGN_CONTRACT: 'sign_contract',
  // Field
  START_FIELD_SESSION: 'start_field_session',
  VIEW_FIELD_SESSIONS: 'view_field_sessions',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  owner: Object.values(PERMISSIONS),
  admin: Object.values(PERMISSIONS).filter(
    (p) => p !== PERMISSIONS.MANAGE_COMPANY_SETTINGS
  ),
  team_leader: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_TEAM_STATS,
    PERMISSIONS.VIEW_OWN_STATS,
    PERMISSIONS.VIEW_TEAM_LEADS,
    PERMISSIONS.VIEW_OWN_LEADS,
    PERMISSIONS.CREATE_LEAD,
    PERMISSIONS.EDIT_OWN_LEAD,
    PERMISSIONS.BULK_ASSIGN_LEADS,
    PERMISSIONS.VIEW_MAP,
    PERMISSIONS.CREATE_ZONE,
    PERMISSIONS.ASSIGN_ZONE,
    PERMISSIONS.DELETE_OWN_ZONE,
    PERMISSIONS.VIEW_ALL_ZONES,
    PERMISSIONS.VIEW_TEAM_TRACKING,
    PERMISSIONS.VIEW_PIPELINE,
    PERMISSIONS.VIEW_TEAM_CALENDARS,
    PERMISSIONS.VIEW_OWN_CALENDAR,
    PERMISSIONS.VIEW_LEADERBOARD,
    PERMISSIONS.VIEW_REP_DETAILS,
    PERMISSIONS.MANAGE_OWN_TEAM,
    PERMISSIONS.VIEW_TEAM_COMMISSIONS,
    PERMISSIONS.VIEW_OWN_COMMISSIONS,
    PERMISSIONS.VIEW_TEAM_REPORTS,
    PERMISSIONS.VIEW_FEED,
    PERMISSIONS.POST_TO_FEED,
    PERMISSIONS.SEND_MESSAGES,
    PERMISSIONS.CREATE_QUOTE,
    PERMISSIONS.CREATE_CONTRACT,
    PERMISSIONS.START_FIELD_SESSION,
    PERMISSIONS.VIEW_FIELD_SESSIONS,
  ],
  sales_rep: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_OWN_STATS,
    PERMISSIONS.VIEW_OWN_LEADS,
    PERMISSIONS.CREATE_LEAD,
    PERMISSIONS.EDIT_OWN_LEAD,
    PERMISSIONS.VIEW_MAP,
    PERMISSIONS.VIEW_ASSIGNED_ZONES,
    PERMISSIONS.VIEW_PIPELINE,
    PERMISSIONS.VIEW_OWN_CALENDAR,
    PERMISSIONS.VIEW_LEADERBOARD,
    PERMISSIONS.VIEW_OWN_COMMISSIONS,
    PERMISSIONS.VIEW_FEED,
    PERMISSIONS.POST_TO_FEED,
    PERMISSIONS.SEND_MESSAGES,
    PERMISSIONS.CREATE_QUOTE,
    PERMISSIONS.SIGN_CONTRACT,
    PERMISSIONS.START_FIELD_SESSION,
  ],
};
