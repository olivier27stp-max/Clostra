/**
 * FieldPulse D2D Sales Platform — Supabase Database Types
 *
 * Auto-generated style compatible with the Supabase CLI `supabase gen types` output.
 * Every table exposes Row (select), Insert, and Update variants.
 */

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

export type UserRole = "owner" | "admin" | "team_leader" | "sales_rep";

export type LeadSource =
  | "door_knock"
  | "referral"
  | "qr_scan"
  | "inbound"
  | "manual"
  | "calendly";

export type ActivityEventType =
  | "door_knock"
  | "conversation"
  | "demo_set"
  | "demo_held"
  | "quote_sent"
  | "follow_up"
  | "status_change"
  | "note_added"
  | "appointment_created"
  | "appointment_completed"
  | "call"
  | "sms"
  | "email"
  | "check_in"
  | "qr_scan";

export type AppointmentStatus =
  | "scheduled"
  | "completed"
  | "cancelled"
  | "no_show"
  | "rescheduled";

export type AppointmentSource = "manual" | "google" | "outlook" | "calendly";

export type CalendarProvider = "google" | "outlook" | "calendly";

export type QuoteStatus = "draft" | "sent" | "accepted" | "rejected" | "expired";

export type ContractStatus = "draft" | "sent" | "signed" | "cancelled";

export type TerritoryStatus = "active" | "inactive" | "archived";

export type FieldSessionStatus = "active" | "paused" | "completed";

export type CheckInType = "check_in" | "check_out";

export type CommissionType = "flat" | "percentage" | "tiered";

export type CommissionEntryStatus = "pending" | "approved" | "paid" | "reversed";

export type ChallengeType = "daily" | "weekly";

export type ChallengeStatus = "active" | "completed" | "cancelled";

export type BattleType = "rep_vs_rep" | "team_vs_team";

export type BattleStatus = "pending" | "active" | "completed" | "cancelled";

export type FeedPostType =
  | "win"
  | "milestone"
  | "badge"
  | "challenge"
  | "battle"
  | "manual";

export type FeedVisibility = "company" | "team";

export type ConversationType = "direct" | "group" | "team";

export type MessageType = "text" | "image" | "file" | "system";

export type PeriodType = "daily" | "weekly" | "monthly";

export type JobStatus = "pending" | "in_progress" | "completed" | "cancelled";

export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue" | "cancelled";

export type PayrollPreviewStatus = "draft" | "reviewed" | "finalized";

// ---------------------------------------------------------------------------
// Database interface
// ---------------------------------------------------------------------------

export interface Database {
  public: {
    Tables: {
      // ---------------------------------------------------------------
      // Company & Organisation
      // ---------------------------------------------------------------

      company_settings: {
        Row: {
          id: string;
          company_name: string;
          logo_url: string | null;
          primary_color: string | null;
          timezone: string;
          currency: string;
          default_commission_type: CommissionType | null;
          default_commission_value: number | null;
          require_gps_tracking: boolean;
          require_check_in_photo: boolean;
          auto_assign_territories: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_name: string;
          logo_url?: string | null;
          primary_color?: string | null;
          timezone?: string;
          currency?: string;
          default_commission_type?: CommissionType | null;
          default_commission_value?: number | null;
          require_gps_tracking?: boolean;
          require_check_in_photo?: boolean;
          auto_assign_territories?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_name?: string;
          logo_url?: string | null;
          primary_color?: string | null;
          timezone?: string;
          currency?: string;
          default_commission_type?: CommissionType | null;
          default_commission_value?: number | null;
          require_gps_tracking?: boolean;
          require_check_in_photo?: boolean;
          auto_assign_territories?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };

      pipeline_stages: {
        Row: {
          id: string;
          company_id: string;
          name: string;
          slug: string;
          color: string;
          sort_order: number;
          is_default: boolean;
          is_closed_won: boolean;
          is_closed_lost: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          name: string;
          slug: string;
          color?: string;
          sort_order?: number;
          is_default?: boolean;
          is_closed_won?: boolean;
          is_closed_lost?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          name?: string;
          slug?: string;
          color?: string;
          sort_order?: number;
          is_default?: boolean;
          is_closed_won?: boolean;
          is_closed_lost?: boolean;
          created_at?: string;
        };
      };

      profiles: {
        Row: {
          id: string;
          company_id: string;
          email: string;
          first_name: string;
          last_name: string;
          phone: string | null;
          avatar_url: string | null;
          role: UserRole;
          team_id: string | null;
          is_active: boolean;
          hire_date: string | null;
          bio: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          company_id: string;
          email: string;
          first_name: string;
          last_name: string;
          phone?: string | null;
          avatar_url?: string | null;
          role?: UserRole;
          team_id?: string | null;
          is_active?: boolean;
          hire_date?: string | null;
          bio?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          email?: string;
          first_name?: string;
          last_name?: string;
          phone?: string | null;
          avatar_url?: string | null;
          role?: UserRole;
          team_id?: string | null;
          is_active?: boolean;
          hire_date?: string | null;
          bio?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };

      teams: {
        Row: {
          id: string;
          company_id: string;
          name: string;
          leader_id: string | null;
          color: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          name: string;
          leader_id?: string | null;
          color?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          name?: string;
          leader_id?: string | null;
          color?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };

      // ---------------------------------------------------------------
      // Territories
      // ---------------------------------------------------------------

      territories: {
        Row: {
          id: string;
          company_id: string;
          name: string;
          color: string;
          /** GeoJSON Polygon or MultiPolygon stored as JSONB */
          geometry: Record<string, unknown>;
          status: TerritoryStatus;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          name: string;
          color?: string;
          geometry: Record<string, unknown>;
          status?: TerritoryStatus;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          name?: string;
          color?: string;
          geometry?: Record<string, unknown>;
          status?: TerritoryStatus;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };

      territory_assignments: {
        Row: {
          id: string;
          territory_id: string;
          profile_id: string | null;
          team_id: string | null;
          assigned_by: string;
          assigned_at: string;
          unassigned_at: string | null;
        };
        Insert: {
          id?: string;
          territory_id: string;
          profile_id?: string | null;
          team_id?: string | null;
          assigned_by: string;
          assigned_at?: string;
          unassigned_at?: string | null;
        };
        Update: {
          id?: string;
          territory_id?: string;
          profile_id?: string | null;
          team_id?: string | null;
          assigned_by?: string;
          assigned_at?: string;
          unassigned_at?: string | null;
        };
      };

      // ---------------------------------------------------------------
      // Households & Leads
      // ---------------------------------------------------------------

      households: {
        Row: {
          id: string;
          company_id: string;
          address_line1: string;
          address_line2: string | null;
          city: string;
          state: string;
          zip_code: string;
          country: string;
          latitude: number | null;
          longitude: number | null;
          territory_id: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          address_line1: string;
          address_line2?: string | null;
          city: string;
          state: string;
          zip_code: string;
          country?: string;
          latitude?: number | null;
          longitude?: number | null;
          territory_id?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          address_line1?: string;
          address_line2?: string | null;
          city?: string;
          state?: string;
          zip_code?: string;
          country?: string;
          latitude?: number | null;
          longitude?: number | null;
          territory_id?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };

      leads: {
        Row: {
          id: string;
          company_id: string;
          household_id: string | null;
          first_name: string;
          last_name: string;
          email: string | null;
          phone: string | null;
          source: LeadSource;
          stage_id: string;
          assigned_rep_id: string | null;
          territory_id: string | null;
          latitude: number | null;
          longitude: number | null;
          address_line1: string | null;
          address_line2: string | null;
          city: string | null;
          state: string | null;
          zip_code: string | null;
          notes: string | null;
          estimated_value: number | null;
          closed_value: number | null;
          closed_at: string | null;
          follow_up_date: string | null;
          tags: string[];
          custom_fields: Record<string, unknown> | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          household_id?: string | null;
          first_name: string;
          last_name: string;
          email?: string | null;
          phone?: string | null;
          source?: LeadSource;
          stage_id: string;
          assigned_rep_id?: string | null;
          territory_id?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          address_line1?: string | null;
          address_line2?: string | null;
          city?: string | null;
          state?: string | null;
          zip_code?: string | null;
          notes?: string | null;
          estimated_value?: number | null;
          closed_value?: number | null;
          closed_at?: string | null;
          follow_up_date?: string | null;
          tags?: string[];
          custom_fields?: Record<string, unknown> | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          household_id?: string | null;
          first_name?: string;
          last_name?: string;
          email?: string | null;
          phone?: string | null;
          source?: LeadSource;
          stage_id?: string;
          assigned_rep_id?: string | null;
          territory_id?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          address_line1?: string | null;
          address_line2?: string | null;
          city?: string | null;
          state?: string | null;
          zip_code?: string | null;
          notes?: string | null;
          estimated_value?: number | null;
          closed_value?: number | null;
          closed_at?: string | null;
          follow_up_date?: string | null;
          tags?: string[];
          custom_fields?: Record<string, unknown> | null;
          created_at?: string;
          updated_at?: string;
        };
      };

      lead_activity_events: {
        Row: {
          id: string;
          company_id: string;
          lead_id: string;
          profile_id: string;
          event_type: ActivityEventType;
          title: string;
          description: string | null;
          metadata: Record<string, unknown> | null;
          latitude: number | null;
          longitude: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          lead_id: string;
          profile_id: string;
          event_type: ActivityEventType;
          title: string;
          description?: string | null;
          metadata?: Record<string, unknown> | null;
          latitude?: number | null;
          longitude?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          lead_id?: string;
          profile_id?: string;
          event_type?: ActivityEventType;
          title?: string;
          description?: string | null;
          metadata?: Record<string, unknown> | null;
          latitude?: number | null;
          longitude?: number | null;
          created_at?: string;
        };
      };

      // ---------------------------------------------------------------
      // Appointments & Calendar
      // ---------------------------------------------------------------

      appointments: {
        Row: {
          id: string;
          company_id: string;
          lead_id: string | null;
          rep_id: string;
          title: string;
          description: string | null;
          status: AppointmentStatus;
          source: AppointmentSource;
          start_time: string;
          end_time: string;
          location: string | null;
          latitude: number | null;
          longitude: number | null;
          external_event_id: string | null;
          reminder_sent: boolean;
          outcome_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          lead_id?: string | null;
          rep_id: string;
          title: string;
          description?: string | null;
          status?: AppointmentStatus;
          source?: AppointmentSource;
          start_time: string;
          end_time: string;
          location?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          external_event_id?: string | null;
          reminder_sent?: boolean;
          outcome_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          lead_id?: string | null;
          rep_id?: string;
          title?: string;
          description?: string | null;
          status?: AppointmentStatus;
          source?: AppointmentSource;
          start_time?: string;
          end_time?: string;
          location?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          external_event_id?: string | null;
          reminder_sent?: boolean;
          outcome_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };

      calendar_connections: {
        Row: {
          id: string;
          profile_id: string;
          provider: CalendarProvider;
          access_token: string;
          refresh_token: string | null;
          token_expires_at: string | null;
          calendar_id: string | null;
          is_active: boolean;
          last_synced_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          provider: CalendarProvider;
          access_token: string;
          refresh_token?: string | null;
          token_expires_at?: string | null;
          calendar_id?: string | null;
          is_active?: boolean;
          last_synced_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          provider?: CalendarProvider;
          access_token?: string;
          refresh_token?: string | null;
          token_expires_at?: string | null;
          calendar_id?: string | null;
          is_active?: boolean;
          last_synced_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };

      external_calendar_events: {
        Row: {
          id: string;
          calendar_connection_id: string;
          external_id: string;
          title: string;
          description: string | null;
          start_time: string;
          end_time: string;
          location: string | null;
          is_all_day: boolean;
          raw_data: Record<string, unknown> | null;
          synced_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          calendar_connection_id: string;
          external_id: string;
          title: string;
          description?: string | null;
          start_time: string;
          end_time: string;
          location?: string | null;
          is_all_day?: boolean;
          raw_data?: Record<string, unknown> | null;
          synced_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          calendar_connection_id?: string;
          external_id?: string;
          title?: string;
          description?: string | null;
          start_time?: string;
          end_time?: string;
          location?: string | null;
          is_all_day?: boolean;
          raw_data?: Record<string, unknown> | null;
          synced_at?: string;
          created_at?: string;
        };
      };

      // ---------------------------------------------------------------
      // Quotes, Contracts & Documents
      // ---------------------------------------------------------------

      quotes: {
        Row: {
          id: string;
          company_id: string;
          lead_id: string;
          created_by: string;
          quote_number: string;
          status: QuoteStatus;
          title: string;
          description: string | null;
          line_items: Record<string, unknown>[];
          subtotal: number;
          tax_rate: number;
          tax_amount: number;
          discount_amount: number;
          total: number;
          valid_until: string | null;
          sent_at: string | null;
          accepted_at: string | null;
          rejected_at: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          lead_id: string;
          created_by: string;
          quote_number: string;
          status?: QuoteStatus;
          title: string;
          description?: string | null;
          line_items?: Record<string, unknown>[];
          subtotal?: number;
          tax_rate?: number;
          tax_amount?: number;
          discount_amount?: number;
          total?: number;
          valid_until?: string | null;
          sent_at?: string | null;
          accepted_at?: string | null;
          rejected_at?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          lead_id?: string;
          created_by?: string;
          quote_number?: string;
          status?: QuoteStatus;
          title?: string;
          description?: string | null;
          line_items?: Record<string, unknown>[];
          subtotal?: number;
          tax_rate?: number;
          tax_amount?: number;
          discount_amount?: number;
          total?: number;
          valid_until?: string | null;
          sent_at?: string | null;
          accepted_at?: string | null;
          rejected_at?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };

      contracts: {
        Row: {
          id: string;
          company_id: string;
          lead_id: string;
          quote_id: string | null;
          created_by: string;
          contract_number: string;
          status: ContractStatus;
          title: string;
          content: string;
          sent_at: string | null;
          signed_at: string | null;
          cancelled_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          lead_id: string;
          quote_id?: string | null;
          created_by: string;
          contract_number: string;
          status?: ContractStatus;
          title: string;
          content: string;
          sent_at?: string | null;
          signed_at?: string | null;
          cancelled_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          lead_id?: string;
          quote_id?: string | null;
          created_by?: string;
          contract_number?: string;
          status?: ContractStatus;
          title?: string;
          content?: string;
          sent_at?: string | null;
          signed_at?: string | null;
          cancelled_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };

      signatures: {
        Row: {
          id: string;
          contract_id: string;
          signer_name: string;
          signer_email: string;
          signature_data: string;
          ip_address: string | null;
          user_agent: string | null;
          signed_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          contract_id: string;
          signer_name: string;
          signer_email: string;
          signature_data: string;
          ip_address?: string | null;
          user_agent?: string | null;
          signed_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          contract_id?: string;
          signer_name?: string;
          signer_email?: string;
          signature_data?: string;
          ip_address?: string | null;
          user_agent?: string | null;
          signed_at?: string;
          created_at?: string;
        };
      };

      attachments: {
        Row: {
          id: string;
          company_id: string;
          uploaded_by: string;
          entity_type: string;
          entity_id: string;
          file_name: string;
          file_url: string;
          file_size: number;
          mime_type: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          uploaded_by: string;
          entity_type: string;
          entity_id: string;
          file_name: string;
          file_url: string;
          file_size: number;
          mime_type: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          uploaded_by?: string;
          entity_type?: string;
          entity_id?: string;
          file_name?: string;
          file_url?: string;
          file_size?: number;
          mime_type?: string;
          created_at?: string;
        };
      };

      // ---------------------------------------------------------------
      // Customers, Jobs & Invoices
      // ---------------------------------------------------------------

      customers: {
        Row: {
          id: string;
          company_id: string;
          lead_id: string | null;
          first_name: string;
          last_name: string;
          email: string | null;
          phone: string | null;
          address_line1: string | null;
          address_line2: string | null;
          city: string | null;
          state: string | null;
          zip_code: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          lead_id?: string | null;
          first_name: string;
          last_name: string;
          email?: string | null;
          phone?: string | null;
          address_line1?: string | null;
          address_line2?: string | null;
          city?: string | null;
          state?: string | null;
          zip_code?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          lead_id?: string | null;
          first_name?: string;
          last_name?: string;
          email?: string | null;
          phone?: string | null;
          address_line1?: string | null;
          address_line2?: string | null;
          city?: string | null;
          state?: string | null;
          zip_code?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };

      jobs: {
        Row: {
          id: string;
          company_id: string;
          customer_id: string;
          lead_id: string | null;
          assigned_rep_id: string | null;
          quote_id: string | null;
          contract_id: string | null;
          job_number: string;
          title: string;
          description: string | null;
          status: JobStatus;
          scheduled_start: string | null;
          scheduled_end: string | null;
          completed_at: string | null;
          total_amount: number;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          customer_id: string;
          lead_id?: string | null;
          assigned_rep_id?: string | null;
          quote_id?: string | null;
          contract_id?: string | null;
          job_number: string;
          title: string;
          description?: string | null;
          status?: JobStatus;
          scheduled_start?: string | null;
          scheduled_end?: string | null;
          completed_at?: string | null;
          total_amount?: number;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          customer_id?: string;
          lead_id?: string | null;
          assigned_rep_id?: string | null;
          quote_id?: string | null;
          contract_id?: string | null;
          job_number?: string;
          title?: string;
          description?: string | null;
          status?: JobStatus;
          scheduled_start?: string | null;
          scheduled_end?: string | null;
          completed_at?: string | null;
          total_amount?: number;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };

      invoices: {
        Row: {
          id: string;
          company_id: string;
          customer_id: string;
          job_id: string | null;
          quote_id: string | null;
          created_by: string;
          invoice_number: string;
          status: InvoiceStatus;
          line_items: Record<string, unknown>[];
          subtotal: number;
          tax_rate: number;
          tax_amount: number;
          discount_amount: number;
          total: number;
          due_date: string | null;
          sent_at: string | null;
          paid_at: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          customer_id: string;
          job_id?: string | null;
          quote_id?: string | null;
          created_by: string;
          invoice_number: string;
          status?: InvoiceStatus;
          line_items?: Record<string, unknown>[];
          subtotal?: number;
          tax_rate?: number;
          tax_amount?: number;
          discount_amount?: number;
          total?: number;
          due_date?: string | null;
          sent_at?: string | null;
          paid_at?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          customer_id?: string;
          job_id?: string | null;
          quote_id?: string | null;
          created_by?: string;
          invoice_number?: string;
          status?: InvoiceStatus;
          line_items?: Record<string, unknown>[];
          subtotal?: number;
          tax_rate?: number;
          tax_amount?: number;
          discount_amount?: number;
          total?: number;
          due_date?: string | null;
          sent_at?: string | null;
          paid_at?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };

      // ---------------------------------------------------------------
      // Gamification — Badges, Achievements, Leaderboard
      // ---------------------------------------------------------------

      badges: {
        Row: {
          id: string;
          company_id: string;
          name: string;
          description: string;
          icon_url: string | null;
          criteria: Record<string, unknown>;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          name: string;
          description: string;
          icon_url?: string | null;
          criteria?: Record<string, unknown>;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          name?: string;
          description?: string;
          icon_url?: string | null;
          criteria?: Record<string, unknown>;
          is_active?: boolean;
          created_at?: string;
        };
      };

      achievements: {
        Row: {
          id: string;
          company_id: string;
          name: string;
          description: string;
          badge_id: string | null;
          threshold_type: string;
          threshold_value: number;
          period: PeriodType | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          name: string;
          description: string;
          badge_id?: string | null;
          threshold_type: string;
          threshold_value: number;
          period?: PeriodType | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          name?: string;
          description?: string;
          badge_id?: string | null;
          threshold_type?: string;
          threshold_value?: number;
          period?: PeriodType | null;
          is_active?: boolean;
          created_at?: string;
        };
      };

      rep_badges: {
        Row: {
          id: string;
          profile_id: string;
          badge_id: string;
          achievement_id: string | null;
          awarded_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          badge_id: string;
          achievement_id?: string | null;
          awarded_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          badge_id?: string;
          achievement_id?: string | null;
          awarded_at?: string;
        };
      };

      leaderboard_metric_definitions: {
        Row: {
          id: string;
          company_id: string;
          name: string;
          slug: string;
          description: string | null;
          calculation_type: string;
          source_event_type: ActivityEventType | null;
          is_active: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          name: string;
          slug: string;
          description?: string | null;
          calculation_type: string;
          source_event_type?: ActivityEventType | null;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          calculation_type?: string;
          source_event_type?: ActivityEventType | null;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
        };
      };

      rep_stat_snapshots: {
        Row: {
          id: string;
          company_id: string;
          profile_id: string;
          period: PeriodType;
          period_start: string;
          period_end: string;
          doors_knocked: number;
          conversations: number;
          demos_set: number;
          demos_held: number;
          quotes_sent: number;
          closes: number;
          revenue: number;
          follow_ups_completed: number;
          average_ticket: number;
          conversion_rate: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          profile_id: string;
          period: PeriodType;
          period_start: string;
          period_end: string;
          doors_knocked?: number;
          conversations?: number;
          demos_set?: number;
          demos_held?: number;
          quotes_sent?: number;
          closes?: number;
          revenue?: number;
          follow_ups_completed?: number;
          average_ticket?: number;
          conversion_rate?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          profile_id?: string;
          period?: PeriodType;
          period_start?: string;
          period_end?: string;
          doors_knocked?: number;
          conversations?: number;
          demos_set?: number;
          demos_held?: number;
          quotes_sent?: number;
          closes?: number;
          revenue?: number;
          follow_ups_completed?: number;
          average_ticket?: number;
          conversion_rate?: number;
          created_at?: string;
        };
      };

      // ---------------------------------------------------------------
      // Challenges & Battles
      // ---------------------------------------------------------------

      challenges: {
        Row: {
          id: string;
          company_id: string;
          created_by: string;
          name: string;
          description: string | null;
          type: ChallengeType;
          status: ChallengeStatus;
          metric_slug: string;
          target_value: number;
          start_date: string;
          end_date: string;
          prize_description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          created_by: string;
          name: string;
          description?: string | null;
          type: ChallengeType;
          status?: ChallengeStatus;
          metric_slug: string;
          target_value: number;
          start_date: string;
          end_date: string;
          prize_description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          created_by?: string;
          name?: string;
          description?: string | null;
          type?: ChallengeType;
          status?: ChallengeStatus;
          metric_slug?: string;
          target_value?: number;
          start_date?: string;
          end_date?: string;
          prize_description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };

      challenge_participants: {
        Row: {
          id: string;
          challenge_id: string;
          profile_id: string;
          current_value: number;
          completed_at: string | null;
          joined_at: string;
        };
        Insert: {
          id?: string;
          challenge_id: string;
          profile_id: string;
          current_value?: number;
          completed_at?: string | null;
          joined_at?: string;
        };
        Update: {
          id?: string;
          challenge_id?: string;
          profile_id?: string;
          current_value?: number;
          completed_at?: string | null;
          joined_at?: string;
        };
      };

      battles: {
        Row: {
          id: string;
          company_id: string;
          created_by: string;
          type: BattleType;
          status: BattleStatus;
          metric_slug: string;
          challenger_profile_id: string | null;
          challenger_team_id: string | null;
          opponent_profile_id: string | null;
          opponent_team_id: string | null;
          challenger_score: number;
          opponent_score: number;
          winner_profile_id: string | null;
          winner_team_id: string | null;
          start_date: string;
          end_date: string;
          prize_description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          created_by: string;
          type: BattleType;
          status?: BattleStatus;
          metric_slug: string;
          challenger_profile_id?: string | null;
          challenger_team_id?: string | null;
          opponent_profile_id?: string | null;
          opponent_team_id?: string | null;
          challenger_score?: number;
          opponent_score?: number;
          winner_profile_id?: string | null;
          winner_team_id?: string | null;
          start_date: string;
          end_date: string;
          prize_description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          created_by?: string;
          type?: BattleType;
          status?: BattleStatus;
          metric_slug?: string;
          challenger_profile_id?: string | null;
          challenger_team_id?: string | null;
          opponent_profile_id?: string | null;
          opponent_team_id?: string | null;
          challenger_score?: number;
          opponent_score?: number;
          winner_profile_id?: string | null;
          winner_team_id?: string | null;
          start_date?: string;
          end_date?: string;
          prize_description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };

      // ---------------------------------------------------------------
      // Social Feed
      // ---------------------------------------------------------------

      feed_posts: {
        Row: {
          id: string;
          company_id: string;
          profile_id: string;
          type: FeedPostType;
          visibility: FeedVisibility;
          team_id: string | null;
          title: string;
          body: string | null;
          image_url: string | null;
          reference_type: string | null;
          reference_id: string | null;
          is_pinned: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          profile_id: string;
          type: FeedPostType;
          visibility?: FeedVisibility;
          team_id?: string | null;
          title: string;
          body?: string | null;
          image_url?: string | null;
          reference_type?: string | null;
          reference_id?: string | null;
          is_pinned?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          profile_id?: string;
          type?: FeedPostType;
          visibility?: FeedVisibility;
          team_id?: string | null;
          title?: string;
          body?: string | null;
          image_url?: string | null;
          reference_type?: string | null;
          reference_id?: string | null;
          is_pinned?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };

      feed_reactions: {
        Row: {
          id: string;
          post_id: string;
          profile_id: string;
          emoji: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          profile_id: string;
          emoji: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          post_id?: string;
          profile_id?: string;
          emoji?: string;
          created_at?: string;
        };
      };

      feed_comments: {
        Row: {
          id: string;
          post_id: string;
          profile_id: string;
          body: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          profile_id: string;
          body: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          post_id?: string;
          profile_id?: string;
          body?: string;
          created_at?: string;
          updated_at?: string;
        };
      };

      // ---------------------------------------------------------------
      // Field Tracking & GPS
      // ---------------------------------------------------------------

      field_sessions: {
        Row: {
          id: string;
          company_id: string;
          profile_id: string;
          territory_id: string | null;
          status: FieldSessionStatus;
          started_at: string;
          paused_at: string | null;
          completed_at: string | null;
          total_duration_minutes: number | null;
          doors_knocked: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          profile_id: string;
          territory_id?: string | null;
          status?: FieldSessionStatus;
          started_at?: string;
          paused_at?: string | null;
          completed_at?: string | null;
          total_duration_minutes?: number | null;
          doors_knocked?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          profile_id?: string;
          territory_id?: string | null;
          status?: FieldSessionStatus;
          started_at?: string;
          paused_at?: string | null;
          completed_at?: string | null;
          total_duration_minutes?: number | null;
          doors_knocked?: number;
          created_at?: string;
          updated_at?: string;
        };
      };

      gps_points: {
        Row: {
          id: string;
          field_session_id: string;
          profile_id: string;
          latitude: number;
          longitude: number;
          accuracy: number | null;
          altitude: number | null;
          speed: number | null;
          heading: number | null;
          recorded_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          field_session_id: string;
          profile_id: string;
          latitude: number;
          longitude: number;
          accuracy?: number | null;
          altitude?: number | null;
          speed?: number | null;
          heading?: number | null;
          recorded_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          field_session_id?: string;
          profile_id?: string;
          latitude?: number;
          longitude?: number;
          accuracy?: number | null;
          altitude?: number | null;
          speed?: number | null;
          heading?: number | null;
          recorded_at?: string;
          created_at?: string;
        };
      };

      check_in_records: {
        Row: {
          id: string;
          company_id: string;
          profile_id: string;
          field_session_id: string | null;
          type: CheckInType;
          latitude: number;
          longitude: number;
          accuracy: number | null;
          photo_url: string | null;
          notes: string | null;
          recorded_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          profile_id: string;
          field_session_id?: string | null;
          type: CheckInType;
          latitude: number;
          longitude: number;
          accuracy?: number | null;
          photo_url?: string | null;
          notes?: string | null;
          recorded_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          profile_id?: string;
          field_session_id?: string | null;
          type?: CheckInType;
          latitude?: number;
          longitude?: number;
          accuracy?: number | null;
          photo_url?: string | null;
          notes?: string | null;
          recorded_at?: string;
          created_at?: string;
        };
      };

      // ---------------------------------------------------------------
      // Commissions & Payroll
      // ---------------------------------------------------------------

      commission_rules: {
        Row: {
          id: string;
          company_id: string;
          name: string;
          description: string | null;
          type: CommissionType;
          flat_amount: number | null;
          percentage: number | null;
          /** For tiered commissions: array of { min, max, rate } */
          tiers: Record<string, unknown>[] | null;
          applies_to_role: UserRole | null;
          applies_to_profile_id: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          name: string;
          description?: string | null;
          type: CommissionType;
          flat_amount?: number | null;
          percentage?: number | null;
          tiers?: Record<string, unknown>[] | null;
          applies_to_role?: UserRole | null;
          applies_to_profile_id?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          name?: string;
          description?: string | null;
          type?: CommissionType;
          flat_amount?: number | null;
          percentage?: number | null;
          tiers?: Record<string, unknown>[] | null;
          applies_to_role?: UserRole | null;
          applies_to_profile_id?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };

      commission_entries: {
        Row: {
          id: string;
          company_id: string;
          profile_id: string;
          rule_id: string;
          lead_id: string | null;
          job_id: string | null;
          status: CommissionEntryStatus;
          amount: number;
          base_amount: number;
          description: string | null;
          approved_by: string | null;
          approved_at: string | null;
          paid_at: string | null;
          payroll_preview_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          profile_id: string;
          rule_id: string;
          lead_id?: string | null;
          job_id?: string | null;
          status?: CommissionEntryStatus;
          amount: number;
          base_amount: number;
          description?: string | null;
          approved_by?: string | null;
          approved_at?: string | null;
          paid_at?: string | null;
          payroll_preview_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          profile_id?: string;
          rule_id?: string;
          lead_id?: string | null;
          job_id?: string | null;
          status?: CommissionEntryStatus;
          amount?: number;
          base_amount?: number;
          description?: string | null;
          approved_by?: string | null;
          approved_at?: string | null;
          paid_at?: string | null;
          payroll_preview_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };

      payroll_previews: {
        Row: {
          id: string;
          company_id: string;
          created_by: string;
          status: PayrollPreviewStatus;
          period_start: string;
          period_end: string;
          total_amount: number;
          entry_count: number;
          notes: string | null;
          finalized_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          created_by: string;
          status?: PayrollPreviewStatus;
          period_start: string;
          period_end: string;
          total_amount?: number;
          entry_count?: number;
          notes?: string | null;
          finalized_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          created_by?: string;
          status?: PayrollPreviewStatus;
          period_start?: string;
          period_end?: string;
          total_amount?: number;
          entry_count?: number;
          notes?: string | null;
          finalized_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };

      // ---------------------------------------------------------------
      // Messaging
      // ---------------------------------------------------------------

      conversations: {
        Row: {
          id: string;
          company_id: string;
          type: ConversationType;
          name: string | null;
          team_id: string | null;
          created_by: string;
          last_message_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          type: ConversationType;
          name?: string | null;
          team_id?: string | null;
          created_by: string;
          last_message_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          type?: ConversationType;
          name?: string | null;
          team_id?: string | null;
          created_by?: string;
          last_message_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };

      conversation_participants: {
        Row: {
          id: string;
          conversation_id: string;
          profile_id: string;
          last_read_at: string | null;
          is_muted: boolean;
          joined_at: string;
          left_at: string | null;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          profile_id: string;
          last_read_at?: string | null;
          is_muted?: boolean;
          joined_at?: string;
          left_at?: string | null;
        };
        Update: {
          id?: string;
          conversation_id?: string;
          profile_id?: string;
          last_read_at?: string | null;
          is_muted?: boolean;
          joined_at?: string;
          left_at?: string | null;
        };
      };

      messages: {
        Row: {
          id: string;
          conversation_id: string;
          sender_id: string;
          type: MessageType;
          body: string;
          file_url: string | null;
          file_name: string | null;
          reply_to_id: string | null;
          is_edited: boolean;
          edited_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          sender_id: string;
          type?: MessageType;
          body: string;
          file_url?: string | null;
          file_name?: string | null;
          reply_to_id?: string | null;
          is_edited?: boolean;
          edited_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          conversation_id?: string;
          sender_id?: string;
          type?: MessageType;
          body?: string;
          file_url?: string | null;
          file_name?: string | null;
          reply_to_id?: string | null;
          is_edited?: boolean;
          edited_at?: string | null;
          created_at?: string;
        };
      };

      // ---------------------------------------------------------------
      // QR Cards
      // ---------------------------------------------------------------

      qr_cards: {
        Row: {
          id: string;
          company_id: string;
          profile_id: string;
          slug: string;
          title: string;
          description: string | null;
          landing_url: string | null;
          qr_image_url: string | null;
          scan_count: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          profile_id: string;
          slug: string;
          title: string;
          description?: string | null;
          landing_url?: string | null;
          qr_image_url?: string | null;
          scan_count?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          profile_id?: string;
          slug?: string;
          title?: string;
          description?: string | null;
          landing_url?: string | null;
          qr_image_url?: string | null;
          scan_count?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };

      qr_scans: {
        Row: {
          id: string;
          qr_card_id: string;
          scanned_by_ip: string | null;
          user_agent: string | null;
          latitude: number | null;
          longitude: number | null;
          lead_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          qr_card_id: string;
          scanned_by_ip?: string | null;
          user_agent?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          lead_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          qr_card_id?: string;
          scanned_by_ip?: string | null;
          user_agent?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          lead_id?: string | null;
          created_at?: string;
        };
      };
    };

    Views: {
      [_ in never]: never;
    };

    Functions: {
      get_user_role: {
        Args: Record<string, never>;
        Returns: string;
      };
    };

    Enums: {
      user_role: UserRole;
      lead_source: LeadSource;
      activity_event_type: ActivityEventType;
      appointment_status: AppointmentStatus;
      appointment_source: AppointmentSource;
      calendar_provider: CalendarProvider;
      quote_status: QuoteStatus;
      contract_status: ContractStatus;
      territory_status: TerritoryStatus;
      field_session_status: FieldSessionStatus;
      check_in_type: CheckInType;
      commission_type: CommissionType;
      commission_entry_status: CommissionEntryStatus;
      challenge_type: ChallengeType;
      challenge_status: ChallengeStatus;
      battle_type: BattleType;
      battle_status: BattleStatus;
      feed_post_type: FeedPostType;
      feed_visibility: FeedVisibility;
      conversation_type: ConversationType;
      message_type: MessageType;
      period_type: PeriodType;
      job_status: JobStatus;
      invoice_status: InvoiceStatus;
      payroll_preview_status: PayrollPreviewStatus;
    };

    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

// ---------------------------------------------------------------------------
// Helper aliases — shorthand access to Row / Insert / Update types
// ---------------------------------------------------------------------------

type Tables = Database["public"]["Tables"];

/** Extract the Row type for any table. */
export type Row<T extends keyof Tables> = Tables[T]["Row"];

/** Extract the Insert type for any table. */
export type InsertRow<T extends keyof Tables> = Tables[T]["Insert"];

/** Extract the Update type for any table. */
export type UpdateRow<T extends keyof Tables> = Tables[T]["Update"];
