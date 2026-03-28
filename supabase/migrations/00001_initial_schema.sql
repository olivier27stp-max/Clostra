-- ============================================================================
-- FieldPulse D2D Field Sales Platform — Initial Schema Migration
-- Supabase / PostgreSQL
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- ENUM TYPES
-- ============================================================================

CREATE TYPE user_role AS ENUM ('owner', 'admin', 'team_leader', 'sales_rep');
CREATE TYPE locale AS ENUM ('fr', 'en');
CREATE TYPE territory_status AS ENUM ('active', 'inactive', 'archived');
CREATE TYPE lead_source AS ENUM ('door_knock', 'referral', 'qr_scan', 'inbound', 'manual', 'calendly');
CREATE TYPE activity_event_type AS ENUM (
  'door_knock', 'conversation', 'demo_set', 'demo_held', 'quote_sent',
  'follow_up', 'status_change', 'note_added', 'appointment_created',
  'appointment_completed', 'call', 'sms', 'email', 'check_in', 'qr_scan'
);
CREATE TYPE appointment_status AS ENUM ('scheduled', 'completed', 'cancelled', 'no_show', 'rescheduled');
CREATE TYPE appointment_source AS ENUM ('manual', 'google', 'outlook', 'calendly');
CREATE TYPE calendar_provider AS ENUM ('google', 'outlook', 'calendly');
CREATE TYPE quote_status AS ENUM ('draft', 'sent', 'accepted', 'rejected', 'expired');
CREATE TYPE contract_status AS ENUM ('draft', 'sent', 'signed', 'cancelled');
CREATE TYPE job_status AS ENUM ('pending', 'in_progress', 'completed', 'cancelled');
CREATE TYPE invoice_status AS ENUM ('draft', 'sent', 'paid', 'overdue', 'cancelled');
CREATE TYPE leaderboard_calc_type AS ENUM ('count', 'sum', 'average', 'rate');
CREATE TYPE stat_period_type AS ENUM ('daily', 'weekly', 'monthly');
CREATE TYPE challenge_type AS ENUM ('daily', 'weekly');
CREATE TYPE challenge_status AS ENUM ('active', 'completed', 'cancelled');
CREATE TYPE battle_type AS ENUM ('rep_vs_rep', 'team_vs_team');
CREATE TYPE battle_status AS ENUM ('pending', 'active', 'completed', 'cancelled');
CREATE TYPE feed_post_type AS ENUM ('win', 'milestone', 'badge', 'challenge', 'battle', 'manual');
CREATE TYPE feed_visibility AS ENUM ('company', 'team');
CREATE TYPE field_session_status AS ENUM ('active', 'paused', 'completed');
CREATE TYPE check_in_type AS ENUM ('check_in', 'check_out');
CREATE TYPE commission_rule_type AS ENUM ('flat', 'percentage', 'tiered');
CREATE TYPE commission_entry_status AS ENUM ('pending', 'approved', 'paid', 'reversed');
CREATE TYPE payroll_preview_status AS ENUM ('draft', 'reviewed', 'finalized');
CREATE TYPE conversation_type AS ENUM ('direct', 'group', 'team');
CREATE TYPE message_type AS ENUM ('text', 'image', 'file', 'system');

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function: get the role of the current authenticated user
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- Trigger function: auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ============================================================================
-- TABLE 1: company_settings
-- ============================================================================

CREATE TABLE public.company_settings (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        text NOT NULL,
  logo_url    text,
  default_locale locale NOT NULL DEFAULT 'fr',
  timezone    text NOT NULL DEFAULT 'America/Toronto',
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER set_company_settings_updated_at
  BEFORE UPDATE ON public.company_settings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.company_settings ENABLE ROW LEVEL SECURITY;

-- Policies: all authenticated can read, only owner/admin can update
CREATE POLICY "company_settings_select" ON public.company_settings
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "company_settings_insert" ON public.company_settings
  FOR INSERT TO authenticated WITH CHECK (
    public.get_user_role() IN ('owner', 'admin')
  );

CREATE POLICY "company_settings_update" ON public.company_settings
  FOR UPDATE TO authenticated USING (
    public.get_user_role() IN ('owner', 'admin')
  );

-- ============================================================================
-- TABLE 2: pipeline_stages
-- ============================================================================

CREATE TABLE public.pipeline_stages (
  id                  uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name                text NOT NULL,
  slug                text NOT NULL UNIQUE,
  color               text NOT NULL DEFAULT '#6B7280',
  position            int NOT NULL DEFAULT 0,
  is_system           bool NOT NULL DEFAULT false,
  is_closed           bool NOT NULL DEFAULT false,
  requires_revenue    bool NOT NULL DEFAULT false,
  requires_lost_reason bool NOT NULL DEFAULT false,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER set_pipeline_stages_updated_at
  BEFORE UPDATE ON public.pipeline_stages
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.pipeline_stages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "pipeline_stages_select" ON public.pipeline_stages
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "pipeline_stages_modify" ON public.pipeline_stages
  FOR ALL TO authenticated USING (
    public.get_user_role() IN ('owner', 'admin')
  ) WITH CHECK (
    public.get_user_role() IN ('owner', 'admin')
  );

-- ============================================================================
-- TABLE 3: profiles
-- ============================================================================

CREATE TABLE public.profiles (
  id          uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       text NOT NULL,
  first_name  text,
  last_name   text,
  phone       text,
  avatar_url  text,
  role        user_role NOT NULL DEFAULT 'sales_rep',
  locale      locale NOT NULL DEFAULT 'fr',
  is_active   bool NOT NULL DEFAULT true,
  team_id     uuid,  -- FK added after teams table creation
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies: read all active, update own
CREATE POLICY "profiles_select_active" ON public.profiles
  FOR SELECT TO authenticated USING (is_active = true);

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE TO authenticated USING (id = auth.uid());

CREATE POLICY "profiles_admin_update" ON public.profiles
  FOR UPDATE TO authenticated USING (
    public.get_user_role() IN ('owner', 'admin')
  );

CREATE POLICY "profiles_insert" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (id = auth.uid());

-- ============================================================================
-- TABLE 4: teams
-- ============================================================================

CREATE TABLE public.teams (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        text NOT NULL,
  leader_id   uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  color       text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER set_teams_updated_at
  BEFORE UPDATE ON public.teams
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Now add the FK from profiles.team_id -> teams.id
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_team_id_fkey
  FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE SET NULL;

ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "teams_select" ON public.teams
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "teams_modify" ON public.teams
  FOR ALL TO authenticated USING (
    public.get_user_role() IN ('owner', 'admin')
  ) WITH CHECK (
    public.get_user_role() IN ('owner', 'admin')
  );

-- ============================================================================
-- TABLE 5: territories
-- ============================================================================

CREATE TABLE public.territories (
  id               uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name             text NOT NULL,
  color            text,
  geometry         jsonb,  -- polygon coordinates
  status           territory_status NOT NULL DEFAULT 'active',
  assigned_team_id uuid REFERENCES public.teams(id) ON DELETE SET NULL,
  capacity_target  int,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER set_territories_updated_at
  BEFORE UPDATE ON public.territories
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.territories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "territories_select" ON public.territories
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "territories_modify" ON public.territories
  FOR ALL TO authenticated USING (
    public.get_user_role() IN ('owner', 'admin', 'team_leader')
  ) WITH CHECK (
    public.get_user_role() IN ('owner', 'admin', 'team_leader')
  );

-- ============================================================================
-- TABLE 6: territory_assignments
-- ============================================================================

CREATE TABLE public.territory_assignments (
  id            uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  territory_id  uuid NOT NULL REFERENCES public.territories(id) ON DELETE CASCADE,
  profile_id    uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  assigned_by   uuid NOT NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
  is_primary    bool NOT NULL DEFAULT false,
  started_at    timestamptz NOT NULL DEFAULT now(),
  ended_at      timestamptz,
  created_at    timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.territory_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "territory_assignments_select" ON public.territory_assignments
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "territory_assignments_modify" ON public.territory_assignments
  FOR ALL TO authenticated USING (
    public.get_user_role() IN ('owner', 'admin', 'team_leader')
  ) WITH CHECK (
    public.get_user_role() IN ('owner', 'admin', 'team_leader')
  );

-- ============================================================================
-- TABLE 7: households
-- ============================================================================

CREATE TABLE public.households (
  id            uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  address_line1 text NOT NULL,
  address_line2 text,
  city          text NOT NULL,
  state         text,
  postal_code   text NOT NULL,
  country       text NOT NULL DEFAULT 'CA',
  latitude      double precision,
  longitude     double precision,
  geohash       text,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER set_households_updated_at
  BEFORE UPDATE ON public.households
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.households ENABLE ROW LEVEL SECURITY;

CREATE POLICY "households_select" ON public.households
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "households_insert" ON public.households
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "households_update" ON public.households
  FOR UPDATE TO authenticated USING (true);

-- ============================================================================
-- TABLE 8: leads
-- ============================================================================

CREATE TABLE public.leads (
  id                      uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name              text,
  last_name               text,
  phone                   text,
  email                   text,
  preferred_language      locale NOT NULL DEFAULT 'fr',
  source                  lead_source NOT NULL DEFAULT 'door_knock',
  household_id            uuid REFERENCES public.households(id) ON DELETE SET NULL,
  assigned_rep_id         uuid NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  assigned_team_leader_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  territory_id            uuid REFERENCES public.territories(id) ON DELETE SET NULL,
  stage_id                uuid NOT NULL REFERENCES public.pipeline_stages(id) ON DELETE RESTRICT,
  sub_status              text,
  last_interaction_at     timestamptz,
  next_follow_up_at       timestamptz,
  revenue                 numeric,
  close_date              date,
  lost_reason             text,
  tags                    text[] DEFAULT '{}',
  latitude                double precision,
  longitude               double precision,
  geohash                 text,
  created_at              timestamptz NOT NULL DEFAULT now(),
  updated_at              timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER set_leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Indexes for leads
CREATE INDEX idx_leads_assigned_rep_id ON public.leads(assigned_rep_id);
CREATE INDEX idx_leads_stage_id ON public.leads(stage_id);
CREATE INDEX idx_leads_territory_id ON public.leads(territory_id);
CREATE INDEX idx_leads_geohash ON public.leads(geohash);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- RLS: reps see assigned, team leaders see team, admin/owner see all
CREATE POLICY "leads_select" ON public.leads
  FOR SELECT TO authenticated USING (
    CASE
      WHEN public.get_user_role() IN ('owner', 'admin') THEN true
      WHEN public.get_user_role() = 'team_leader' THEN (
        assigned_rep_id IN (
          SELECT p.id FROM public.profiles p WHERE p.team_id IN (
            SELECT t.id FROM public.teams t WHERE t.leader_id = auth.uid()
          )
        )
        OR assigned_rep_id = auth.uid()
      )
      ELSE assigned_rep_id = auth.uid()
    END
  );

CREATE POLICY "leads_insert" ON public.leads
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "leads_update" ON public.leads
  FOR UPDATE TO authenticated USING (
    CASE
      WHEN public.get_user_role() IN ('owner', 'admin') THEN true
      WHEN public.get_user_role() = 'team_leader' THEN (
        assigned_rep_id IN (
          SELECT p.id FROM public.profiles p WHERE p.team_id IN (
            SELECT t.id FROM public.teams t WHERE t.leader_id = auth.uid()
          )
        )
        OR assigned_rep_id = auth.uid()
      )
      ELSE assigned_rep_id = auth.uid()
    END
  );

CREATE POLICY "leads_delete" ON public.leads
  FOR DELETE TO authenticated USING (
    public.get_user_role() IN ('owner', 'admin')
  );

-- ============================================================================
-- TABLE 9: lead_activity_events
-- ============================================================================

CREATE TABLE public.lead_activity_events (
  id                uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id           uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  profile_id        uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  event_type        activity_event_type NOT NULL,
  metadata          jsonb DEFAULT '{}',
  previous_stage_id uuid REFERENCES public.pipeline_stages(id) ON DELETE SET NULL,
  new_stage_id      uuid REFERENCES public.pipeline_stages(id) ON DELETE SET NULL,
  created_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_lead_activity_events_lead_created
  ON public.lead_activity_events(lead_id, created_at);
CREATE INDEX idx_lead_activity_events_profile_type_created
  ON public.lead_activity_events(profile_id, event_type, created_at);

ALTER TABLE public.lead_activity_events ENABLE ROW LEVEL SECURITY;

-- Same visibility as leads
CREATE POLICY "lead_activity_events_select" ON public.lead_activity_events
  FOR SELECT TO authenticated USING (
    CASE
      WHEN public.get_user_role() IN ('owner', 'admin') THEN true
      WHEN public.get_user_role() = 'team_leader' THEN (
        profile_id IN (
          SELECT p.id FROM public.profiles p WHERE p.team_id IN (
            SELECT t.id FROM public.teams t WHERE t.leader_id = auth.uid()
          )
        )
        OR profile_id = auth.uid()
      )
      ELSE profile_id = auth.uid()
    END
  );

CREATE POLICY "lead_activity_events_insert" ON public.lead_activity_events
  FOR INSERT TO authenticated WITH CHECK (profile_id = auth.uid());

-- ============================================================================
-- TABLE 10: appointments
-- ============================================================================

CREATE TABLE public.appointments (
  id                          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id                     uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  profile_id                  uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title                       text NOT NULL,
  description                 text,
  start_time                  timestamptz NOT NULL,
  end_time                    timestamptz NOT NULL,
  status                      appointment_status NOT NULL DEFAULT 'scheduled',
  location                    text,
  external_calendar_event_id  text,
  source                      appointment_source NOT NULL DEFAULT 'manual',
  created_at                  timestamptz NOT NULL DEFAULT now(),
  updated_at                  timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER set_appointments_updated_at
  BEFORE UPDATE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "appointments_select" ON public.appointments
  FOR SELECT TO authenticated USING (
    CASE
      WHEN public.get_user_role() IN ('owner', 'admin') THEN true
      ELSE profile_id = auth.uid()
    END
  );

CREATE POLICY "appointments_insert" ON public.appointments
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "appointments_update" ON public.appointments
  FOR UPDATE TO authenticated USING (
    profile_id = auth.uid() OR public.get_user_role() IN ('owner', 'admin')
  );

CREATE POLICY "appointments_delete" ON public.appointments
  FOR DELETE TO authenticated USING (
    profile_id = auth.uid() OR public.get_user_role() IN ('owner', 'admin')
  );

-- ============================================================================
-- TABLE 11: calendar_connections
-- ============================================================================

CREATE TABLE public.calendar_connections (
  id                      uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id              uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  provider                calendar_provider NOT NULL,
  access_token_encrypted  text,
  refresh_token_encrypted text,
  token_expires_at        timestamptz,
  external_calendar_id    text,
  is_active               bool NOT NULL DEFAULT true,
  last_synced_at          timestamptz,
  created_at              timestamptz NOT NULL DEFAULT now(),
  updated_at              timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER set_calendar_connections_updated_at
  BEFORE UPDATE ON public.calendar_connections
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.calendar_connections ENABLE ROW LEVEL SECURITY;

-- Users can only see and manage their own connections
CREATE POLICY "calendar_connections_own" ON public.calendar_connections
  FOR ALL TO authenticated
  USING (profile_id = auth.uid())
  WITH CHECK (profile_id = auth.uid());

-- ============================================================================
-- TABLE 12: external_calendar_events
-- ============================================================================

CREATE TABLE public.external_calendar_events (
  id                      uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  calendar_connection_id  uuid NOT NULL REFERENCES public.calendar_connections(id) ON DELETE CASCADE,
  external_id             text NOT NULL,
  title                   text,
  start_time              timestamptz NOT NULL,
  end_time                timestamptz NOT NULL,
  metadata                jsonb DEFAULT '{}',
  synced_at               timestamptz NOT NULL DEFAULT now(),
  created_at              timestamptz NOT NULL DEFAULT now(),
  updated_at              timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER set_external_calendar_events_updated_at
  BEFORE UPDATE ON public.external_calendar_events
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.external_calendar_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "external_calendar_events_own" ON public.external_calendar_events
  FOR ALL TO authenticated USING (
    calendar_connection_id IN (
      SELECT id FROM public.calendar_connections WHERE profile_id = auth.uid()
    )
  ) WITH CHECK (
    calendar_connection_id IN (
      SELECT id FROM public.calendar_connections WHERE profile_id = auth.uid()
    )
  );

-- ============================================================================
-- TABLE 13: quotes
-- ============================================================================

CREATE TABLE public.quotes (
  id            uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id       uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  created_by    uuid NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  version       int NOT NULL DEFAULT 1,
  status        quote_status NOT NULL DEFAULT 'draft',
  total_amount  numeric NOT NULL DEFAULT 0,
  line_items    jsonb NOT NULL DEFAULT '[]',
  valid_until   date,
  notes         text,
  pdf_url       text,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER set_quotes_updated_at
  BEFORE UPDATE ON public.quotes
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "quotes_select" ON public.quotes
  FOR SELECT TO authenticated USING (
    CASE
      WHEN public.get_user_role() IN ('owner', 'admin') THEN true
      ELSE created_by = auth.uid()
    END
  );

CREATE POLICY "quotes_insert" ON public.quotes
  FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());

CREATE POLICY "quotes_update" ON public.quotes
  FOR UPDATE TO authenticated USING (
    created_by = auth.uid() OR public.get_user_role() IN ('owner', 'admin')
  );

-- ============================================================================
-- TABLE 14: contracts
-- ============================================================================

CREATE TABLE public.contracts (
  id            uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id       uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  quote_id      uuid REFERENCES public.quotes(id) ON DELETE SET NULL,
  created_by    uuid NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  template_id   text,
  status        contract_status NOT NULL DEFAULT 'draft',
  content       jsonb DEFAULT '{}',
  pdf_url       text,
  signed_at     timestamptz,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER set_contracts_updated_at
  BEFORE UPDATE ON public.contracts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "contracts_select" ON public.contracts
  FOR SELECT TO authenticated USING (
    CASE
      WHEN public.get_user_role() IN ('owner', 'admin') THEN true
      ELSE created_by = auth.uid()
    END
  );

CREATE POLICY "contracts_insert" ON public.contracts
  FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());

CREATE POLICY "contracts_update" ON public.contracts
  FOR UPDATE TO authenticated USING (
    created_by = auth.uid() OR public.get_user_role() IN ('owner', 'admin')
  );

-- ============================================================================
-- TABLE 15: signatures
-- ============================================================================

CREATE TABLE public.signatures (
  id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  contract_id     uuid NOT NULL REFERENCES public.contracts(id) ON DELETE CASCADE,
  signer_name     text NOT NULL,
  signer_email    text NOT NULL,
  signature_data  text NOT NULL,  -- base64 encoded
  ip_address      text,
  signed_at       timestamptz NOT NULL DEFAULT now(),
  created_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.signatures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "signatures_select" ON public.signatures
  FOR SELECT TO authenticated USING (
    CASE
      WHEN public.get_user_role() IN ('owner', 'admin') THEN true
      ELSE contract_id IN (
        SELECT id FROM public.contracts WHERE created_by = auth.uid()
      )
    END
  );

CREATE POLICY "signatures_insert" ON public.signatures
  FOR INSERT TO authenticated WITH CHECK (true);

-- ============================================================================
-- TABLE 16: attachments
-- ============================================================================

CREATE TABLE public.attachments (
  id            uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_type   text NOT NULL CHECK (entity_type IN ('lead', 'quote', 'contract', 'message')),
  entity_id     uuid NOT NULL,
  file_name     text NOT NULL,
  file_url      text NOT NULL,
  file_size     int,
  mime_type     text,
  uploaded_by   uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_attachments_entity ON public.attachments(entity_type, entity_id);

ALTER TABLE public.attachments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "attachments_select" ON public.attachments
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "attachments_insert" ON public.attachments
  FOR INSERT TO authenticated WITH CHECK (uploaded_by = auth.uid());

CREATE POLICY "attachments_delete" ON public.attachments
  FOR DELETE TO authenticated USING (
    uploaded_by = auth.uid() OR public.get_user_role() IN ('owner', 'admin')
  );

-- ============================================================================
-- TABLE 17: customers
-- ============================================================================

CREATE TABLE public.customers (
  id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id         uuid UNIQUE REFERENCES public.leads(id) ON DELETE SET NULL,
  first_name      text,
  last_name       text,
  email           text,
  phone           text,
  household_id    uuid REFERENCES public.households(id) ON DELETE SET NULL,
  lifetime_value  numeric NOT NULL DEFAULT 0,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER set_customers_updated_at
  BEFORE UPDATE ON public.customers
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "customers_select" ON public.customers
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "customers_insert" ON public.customers
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "customers_update" ON public.customers
  FOR UPDATE TO authenticated USING (
    public.get_user_role() IN ('owner', 'admin', 'team_leader')
    OR auth.uid() IN (
      SELECT assigned_rep_id FROM public.leads WHERE id = customers.lead_id
    )
  );

-- ============================================================================
-- TABLE 18: jobs
-- ============================================================================

CREATE TABLE public.jobs (
  id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id     uuid NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  lead_id         uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  title           text NOT NULL,
  status          job_status NOT NULL DEFAULT 'pending',
  scheduled_date  date,
  completed_date  date,
  notes           text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER set_jobs_updated_at
  BEFORE UPDATE ON public.jobs
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "jobs_select" ON public.jobs
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "jobs_modify" ON public.jobs
  FOR ALL TO authenticated USING (
    public.get_user_role() IN ('owner', 'admin')
  ) WITH CHECK (
    public.get_user_role() IN ('owner', 'admin')
  );

CREATE POLICY "jobs_rep_insert" ON public.jobs
  FOR INSERT TO authenticated WITH CHECK (true);

-- ============================================================================
-- TABLE 19: invoices
-- ============================================================================

CREATE TABLE public.invoices (
  id            uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id        uuid REFERENCES public.jobs(id) ON DELETE SET NULL,
  customer_id   uuid NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  amount        numeric NOT NULL DEFAULT 0,
  status        invoice_status NOT NULL DEFAULT 'draft',
  due_date      date NOT NULL,
  paid_at       timestamptz,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER set_invoices_updated_at
  BEFORE UPDATE ON public.invoices
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "invoices_select" ON public.invoices
  FOR SELECT TO authenticated USING (
    public.get_user_role() IN ('owner', 'admin')
  );

CREATE POLICY "invoices_modify" ON public.invoices
  FOR ALL TO authenticated USING (
    public.get_user_role() IN ('owner', 'admin')
  ) WITH CHECK (
    public.get_user_role() IN ('owner', 'admin')
  );

-- ============================================================================
-- TABLE 20: badges
-- ============================================================================

CREATE TABLE public.badges (
  id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug            text NOT NULL UNIQUE,
  name_en         text NOT NULL,
  name_fr         text NOT NULL,
  description_en  text,
  description_fr  text,
  icon            text,
  color           text,
  category        text,
  threshold       jsonb DEFAULT '{}',
  created_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "badges_select" ON public.badges
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "badges_modify" ON public.badges
  FOR ALL TO authenticated USING (
    public.get_user_role() IN ('owner', 'admin')
  ) WITH CHECK (
    public.get_user_role() IN ('owner', 'admin')
  );

-- ============================================================================
-- TABLE 21: achievements
-- ============================================================================

CREATE TABLE public.achievements (
  id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug            text NOT NULL UNIQUE,
  name_en         text NOT NULL,
  name_fr         text NOT NULL,
  description_en  text,
  description_fr  text,
  icon            text,
  badge_id        uuid REFERENCES public.badges(id) ON DELETE SET NULL,
  milestone_type  text,
  milestone_value int,
  created_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "achievements_select" ON public.achievements
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "achievements_modify" ON public.achievements
  FOR ALL TO authenticated USING (
    public.get_user_role() IN ('owner', 'admin')
  ) WITH CHECK (
    public.get_user_role() IN ('owner', 'admin')
  );

-- ============================================================================
-- TABLE 22: rep_badges
-- ============================================================================

CREATE TABLE public.rep_badges (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id  uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  badge_id    uuid NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  earned_at   timestamptz NOT NULL DEFAULT now(),
  metadata    jsonb DEFAULT '{}'
);

ALTER TABLE public.rep_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "rep_badges_select" ON public.rep_badges
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "rep_badges_insert" ON public.rep_badges
  FOR INSERT TO authenticated WITH CHECK (
    public.get_user_role() IN ('owner', 'admin')
  );

-- ============================================================================
-- TABLE 23: leaderboard_metric_definitions
-- ============================================================================

CREATE TABLE public.leaderboard_metric_definitions (
  id                uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug              text NOT NULL UNIQUE,
  name_en           text NOT NULL,
  name_fr           text NOT NULL,
  calculation_type  leaderboard_calc_type NOT NULL,
  source_event_type text,
  source_field      text,
  description       text,
  created_at        timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.leaderboard_metric_definitions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "leaderboard_metric_definitions_select" ON public.leaderboard_metric_definitions
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "leaderboard_metric_definitions_modify" ON public.leaderboard_metric_definitions
  FOR ALL TO authenticated USING (
    public.get_user_role() IN ('owner', 'admin')
  ) WITH CHECK (
    public.get_user_role() IN ('owner', 'admin')
  );

-- ============================================================================
-- TABLE 24: rep_stat_snapshots
-- ============================================================================

CREATE TABLE public.rep_stat_snapshots (
  id                    uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id            uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  date                  date NOT NULL,
  period_type           stat_period_type NOT NULL,
  doors_knocked         int NOT NULL DEFAULT 0,
  conversations         int NOT NULL DEFAULT 0,
  demos_set             int NOT NULL DEFAULT 0,
  demos_held            int NOT NULL DEFAULT 0,
  quotes_sent           int NOT NULL DEFAULT 0,
  closes                int NOT NULL DEFAULT 0,
  revenue               numeric NOT NULL DEFAULT 0,
  follow_ups_completed  int NOT NULL DEFAULT 0,
  created_at            timestamptz NOT NULL DEFAULT now(),
  UNIQUE(profile_id, date, period_type)
);

CREATE INDEX idx_rep_stat_snapshots_profile_date
  ON public.rep_stat_snapshots(profile_id, date);

ALTER TABLE public.rep_stat_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "rep_stat_snapshots_select" ON public.rep_stat_snapshots
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "rep_stat_snapshots_modify" ON public.rep_stat_snapshots
  FOR ALL TO authenticated USING (
    public.get_user_role() IN ('owner', 'admin')
  ) WITH CHECK (
    public.get_user_role() IN ('owner', 'admin')
  );

-- ============================================================================
-- TABLE 25: challenges
-- ============================================================================

CREATE TABLE public.challenges (
  id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_en         text NOT NULL,
  name_fr         text NOT NULL,
  description_en  text,
  description_fr  text,
  type            challenge_type NOT NULL,
  metric_slug     text NOT NULL,
  target_value    numeric,
  start_date      date NOT NULL,
  end_date        date NOT NULL,
  status          challenge_status NOT NULL DEFAULT 'active',
  created_by      uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER set_challenges_updated_at
  BEFORE UPDATE ON public.challenges
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "challenges_select" ON public.challenges
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "challenges_modify" ON public.challenges
  FOR ALL TO authenticated USING (
    public.get_user_role() IN ('owner', 'admin', 'team_leader')
  ) WITH CHECK (
    public.get_user_role() IN ('owner', 'admin', 'team_leader')
  );

-- ============================================================================
-- TABLE 26: challenge_participants
-- ============================================================================

CREATE TABLE public.challenge_participants (
  id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  challenge_id    uuid NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  profile_id      uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  current_value   numeric NOT NULL DEFAULT 0,
  rank            int,
  is_winner       bool NOT NULL DEFAULT false,
  joined_at       timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER set_challenge_participants_updated_at
  BEFORE UPDATE ON public.challenge_participants
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.challenge_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "challenge_participants_select" ON public.challenge_participants
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "challenge_participants_insert" ON public.challenge_participants
  FOR INSERT TO authenticated WITH CHECK (profile_id = auth.uid());

CREATE POLICY "challenge_participants_update" ON public.challenge_participants
  FOR UPDATE TO authenticated USING (
    public.get_user_role() IN ('owner', 'admin', 'team_leader')
  );

-- ============================================================================
-- TABLE 27: battles
-- ============================================================================

CREATE TABLE public.battles (
  id                uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name              text NOT NULL,
  type              battle_type NOT NULL,
  metric_slug       text NOT NULL,
  challenger_id     uuid NOT NULL,
  opponent_id       uuid NOT NULL,
  challenger_score  numeric NOT NULL DEFAULT 0,
  opponent_score    numeric NOT NULL DEFAULT 0,
  start_date        date NOT NULL,
  end_date          date NOT NULL,
  status            battle_status NOT NULL DEFAULT 'pending',
  winner_id         uuid,
  created_by        uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER set_battles_updated_at
  BEFORE UPDATE ON public.battles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.battles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "battles_select" ON public.battles
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "battles_modify" ON public.battles
  FOR ALL TO authenticated USING (
    public.get_user_role() IN ('owner', 'admin', 'team_leader')
  ) WITH CHECK (
    public.get_user_role() IN ('owner', 'admin', 'team_leader')
  );

-- ============================================================================
-- TABLE 28: feed_posts
-- ============================================================================

CREATE TABLE public.feed_posts (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id  uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type        feed_post_type NOT NULL,
  content     text,
  metadata    jsonb DEFAULT '{}',
  visibility  feed_visibility NOT NULL DEFAULT 'company',
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER set_feed_posts_updated_at
  BEFORE UPDATE ON public.feed_posts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX idx_feed_posts_created_at ON public.feed_posts(created_at DESC);

ALTER TABLE public.feed_posts ENABLE ROW LEVEL SECURITY;

-- RLS: company visibility = all, team visibility = same team members
CREATE POLICY "feed_posts_select" ON public.feed_posts
  FOR SELECT TO authenticated USING (
    CASE
      WHEN visibility = 'company' THEN true
      WHEN visibility = 'team' THEN (
        profile_id IN (
          SELECT p.id FROM public.profiles p
          WHERE p.team_id = (SELECT team_id FROM public.profiles WHERE id = auth.uid())
        )
      )
      ELSE false
    END
  );

CREATE POLICY "feed_posts_insert" ON public.feed_posts
  FOR INSERT TO authenticated WITH CHECK (profile_id = auth.uid());

CREATE POLICY "feed_posts_update" ON public.feed_posts
  FOR UPDATE TO authenticated USING (profile_id = auth.uid());

CREATE POLICY "feed_posts_delete" ON public.feed_posts
  FOR DELETE TO authenticated USING (
    profile_id = auth.uid() OR public.get_user_role() IN ('owner', 'admin')
  );

-- ============================================================================
-- TABLE 29: feed_reactions
-- ============================================================================

CREATE TABLE public.feed_reactions (
  id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id         uuid NOT NULL REFERENCES public.feed_posts(id) ON DELETE CASCADE,
  profile_id      uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reaction_type   text NOT NULL CHECK (reaction_type IN ('fire', 'clap', 'trophy', 'heart')),
  created_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE(post_id, profile_id)
);

ALTER TABLE public.feed_reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "feed_reactions_select" ON public.feed_reactions
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "feed_reactions_insert" ON public.feed_reactions
  FOR INSERT TO authenticated WITH CHECK (profile_id = auth.uid());

CREATE POLICY "feed_reactions_delete" ON public.feed_reactions
  FOR DELETE TO authenticated USING (profile_id = auth.uid());

-- ============================================================================
-- TABLE 30: feed_comments
-- ============================================================================

CREATE TABLE public.feed_comments (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id     uuid NOT NULL REFERENCES public.feed_posts(id) ON DELETE CASCADE,
  profile_id  uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content     text NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER set_feed_comments_updated_at
  BEFORE UPDATE ON public.feed_comments
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.feed_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "feed_comments_select" ON public.feed_comments
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "feed_comments_insert" ON public.feed_comments
  FOR INSERT TO authenticated WITH CHECK (profile_id = auth.uid());

CREATE POLICY "feed_comments_update" ON public.feed_comments
  FOR UPDATE TO authenticated USING (profile_id = auth.uid());

CREATE POLICY "feed_comments_delete" ON public.feed_comments
  FOR DELETE TO authenticated USING (
    profile_id = auth.uid() OR public.get_user_role() IN ('owner', 'admin')
  );

-- ============================================================================
-- TABLE 31: field_sessions
-- ============================================================================

CREATE TABLE public.field_sessions (
  id                    uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id            uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  territory_id          uuid REFERENCES public.territories(id) ON DELETE SET NULL,
  started_at            timestamptz NOT NULL DEFAULT now(),
  ended_at              timestamptz,
  status                field_session_status NOT NULL DEFAULT 'active',
  check_in_latitude     double precision,
  check_in_longitude    double precision,
  check_out_latitude    double precision,
  check_out_longitude   double precision,
  total_doors           int NOT NULL DEFAULT 0,
  total_conversations   int NOT NULL DEFAULT 0,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER set_field_sessions_updated_at
  BEFORE UPDATE ON public.field_sessions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX idx_field_sessions_profile_status
  ON public.field_sessions(profile_id, status);

ALTER TABLE public.field_sessions ENABLE ROW LEVEL SECURITY;

-- RLS: reps see own, team leaders see team, admin/owner see all
CREATE POLICY "field_sessions_select" ON public.field_sessions
  FOR SELECT TO authenticated USING (
    CASE
      WHEN public.get_user_role() IN ('owner', 'admin') THEN true
      WHEN public.get_user_role() = 'team_leader' THEN (
        profile_id IN (
          SELECT p.id FROM public.profiles p WHERE p.team_id IN (
            SELECT t.id FROM public.teams t WHERE t.leader_id = auth.uid()
          )
        )
        OR profile_id = auth.uid()
      )
      ELSE profile_id = auth.uid()
    END
  );

CREATE POLICY "field_sessions_insert" ON public.field_sessions
  FOR INSERT TO authenticated WITH CHECK (profile_id = auth.uid());

CREATE POLICY "field_sessions_update" ON public.field_sessions
  FOR UPDATE TO authenticated USING (profile_id = auth.uid());

-- ============================================================================
-- TABLE 32: gps_points
-- ============================================================================

CREATE TABLE public.gps_points (
  id                uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  field_session_id  uuid NOT NULL REFERENCES public.field_sessions(id) ON DELETE CASCADE,
  profile_id        uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  latitude          double precision NOT NULL,
  longitude         double precision NOT NULL,
  accuracy          numeric,
  recorded_at       timestamptz NOT NULL,
  synced            bool NOT NULL DEFAULT false,
  created_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_gps_points_profile_recorded
  ON public.gps_points(profile_id, recorded_at);

ALTER TABLE public.gps_points ENABLE ROW LEVEL SECURITY;

CREATE POLICY "gps_points_select" ON public.gps_points
  FOR SELECT TO authenticated USING (
    CASE
      WHEN public.get_user_role() IN ('owner', 'admin') THEN true
      WHEN public.get_user_role() = 'team_leader' THEN (
        profile_id IN (
          SELECT p.id FROM public.profiles p WHERE p.team_id IN (
            SELECT t.id FROM public.teams t WHERE t.leader_id = auth.uid()
          )
        )
        OR profile_id = auth.uid()
      )
      ELSE profile_id = auth.uid()
    END
  );

CREATE POLICY "gps_points_insert" ON public.gps_points
  FOR INSERT TO authenticated WITH CHECK (profile_id = auth.uid());

-- ============================================================================
-- TABLE 33: check_in_records
-- ============================================================================

CREATE TABLE public.check_in_records (
  id                uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id        uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  field_session_id  uuid REFERENCES public.field_sessions(id) ON DELETE SET NULL,
  type              check_in_type NOT NULL,
  latitude          double precision NOT NULL,
  longitude         double precision NOT NULL,
  address           text,
  recorded_at       timestamptz NOT NULL DEFAULT now(),
  created_at        timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.check_in_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "check_in_records_select" ON public.check_in_records
  FOR SELECT TO authenticated USING (
    CASE
      WHEN public.get_user_role() IN ('owner', 'admin') THEN true
      WHEN public.get_user_role() = 'team_leader' THEN (
        profile_id IN (
          SELECT p.id FROM public.profiles p WHERE p.team_id IN (
            SELECT t.id FROM public.teams t WHERE t.leader_id = auth.uid()
          )
        )
        OR profile_id = auth.uid()
      )
      ELSE profile_id = auth.uid()
    END
  );

CREATE POLICY "check_in_records_insert" ON public.check_in_records
  FOR INSERT TO authenticated WITH CHECK (profile_id = auth.uid());

-- ============================================================================
-- TABLE 34: commission_rules
-- ============================================================================

CREATE TABLE public.commission_rules (
  id            uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          text NOT NULL,
  type          commission_rule_type NOT NULL,
  rate          numeric NOT NULL,
  min_revenue   numeric,
  max_revenue   numeric,
  conditions    jsonb DEFAULT '{}',
  is_active     bool NOT NULL DEFAULT true,
  priority      int NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER set_commission_rules_updated_at
  BEFORE UPDATE ON public.commission_rules
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.commission_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "commission_rules_select" ON public.commission_rules
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "commission_rules_modify" ON public.commission_rules
  FOR ALL TO authenticated USING (
    public.get_user_role() IN ('owner', 'admin')
  ) WITH CHECK (
    public.get_user_role() IN ('owner', 'admin')
  );

-- ============================================================================
-- TABLE 35: commission_entries
-- ============================================================================

CREATE TABLE public.commission_entries (
  id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id      uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  lead_id         uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  rule_id         uuid NOT NULL REFERENCES public.commission_rules(id) ON DELETE RESTRICT,
  amount          numeric NOT NULL,
  status          commission_entry_status NOT NULL DEFAULT 'pending',
  deal_revenue    numeric NOT NULL,
  calculated_at   timestamptz NOT NULL DEFAULT now(),
  approved_by     uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  approved_at     timestamptz,
  notes           text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER set_commission_entries_updated_at
  BEFORE UPDATE ON public.commission_entries
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX idx_commission_entries_profile_status
  ON public.commission_entries(profile_id, status);

ALTER TABLE public.commission_entries ENABLE ROW LEVEL SECURITY;

-- RLS: reps see own, admin/owner see all
CREATE POLICY "commission_entries_select" ON public.commission_entries
  FOR SELECT TO authenticated USING (
    CASE
      WHEN public.get_user_role() IN ('owner', 'admin') THEN true
      ELSE profile_id = auth.uid()
    END
  );

CREATE POLICY "commission_entries_modify" ON public.commission_entries
  FOR ALL TO authenticated USING (
    public.get_user_role() IN ('owner', 'admin')
  ) WITH CHECK (
    public.get_user_role() IN ('owner', 'admin')
  );

-- ============================================================================
-- TABLE 36: payroll_previews
-- ============================================================================

CREATE TABLE public.payroll_previews (
  id                uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id        uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  period_start      date NOT NULL,
  period_end        date NOT NULL,
  total_commission  numeric NOT NULL DEFAULT 0,
  total_entries     int NOT NULL DEFAULT 0,
  status            payroll_preview_status NOT NULL DEFAULT 'draft',
  generated_at      timestamptz NOT NULL DEFAULT now(),
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER set_payroll_previews_updated_at
  BEFORE UPDATE ON public.payroll_previews
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.payroll_previews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "payroll_previews_select" ON public.payroll_previews
  FOR SELECT TO authenticated USING (
    CASE
      WHEN public.get_user_role() IN ('owner', 'admin') THEN true
      ELSE profile_id = auth.uid()
    END
  );

CREATE POLICY "payroll_previews_modify" ON public.payroll_previews
  FOR ALL TO authenticated USING (
    public.get_user_role() IN ('owner', 'admin')
  ) WITH CHECK (
    public.get_user_role() IN ('owner', 'admin')
  );

-- ============================================================================
-- TABLE 37: conversations
-- ============================================================================

CREATE TABLE public.conversations (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  type        conversation_type NOT NULL DEFAULT 'direct',
  name        text,
  team_id     uuid REFERENCES public.teams(id) ON DELETE SET NULL,
  created_by  uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER set_conversations_updated_at
  BEFORE UPDATE ON public.conversations
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

-- Only participants can see conversations
CREATE POLICY "conversations_select" ON public.conversations
  FOR SELECT TO authenticated USING (
    id IN (
      SELECT conversation_id FROM public.conversation_participants
      WHERE profile_id = auth.uid()
    )
  );

CREATE POLICY "conversations_insert" ON public.conversations
  FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());

-- ============================================================================
-- TABLE 38: conversation_participants
-- ============================================================================

CREATE TABLE public.conversation_participants (
  id                uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id   uuid NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  profile_id        uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  last_read_at      timestamptz,
  joined_at         timestamptz NOT NULL DEFAULT now(),
  created_at        timestamptz NOT NULL DEFAULT now(),
  UNIQUE(conversation_id, profile_id)
);

ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "conversation_participants_select" ON public.conversation_participants
  FOR SELECT TO authenticated USING (
    conversation_id IN (
      SELECT conversation_id FROM public.conversation_participants
      WHERE profile_id = auth.uid()
    )
  );

CREATE POLICY "conversation_participants_insert" ON public.conversation_participants
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "conversation_participants_update" ON public.conversation_participants
  FOR UPDATE TO authenticated USING (profile_id = auth.uid());

-- ============================================================================
-- TABLE 39: messages
-- ============================================================================

CREATE TABLE public.messages (
  id                uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id   uuid NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id         uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content           text NOT NULL,
  type              message_type NOT NULL DEFAULT 'text',
  metadata          jsonb,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER set_messages_updated_at
  BEFORE UPDATE ON public.messages
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX idx_messages_conversation_created
  ON public.messages(conversation_id, created_at);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- RLS: only participants can see messages
CREATE POLICY "messages_select" ON public.messages
  FOR SELECT TO authenticated USING (
    conversation_id IN (
      SELECT conversation_id FROM public.conversation_participants
      WHERE profile_id = auth.uid()
    )
  );

CREATE POLICY "messages_insert" ON public.messages
  FOR INSERT TO authenticated WITH CHECK (
    sender_id = auth.uid()
    AND conversation_id IN (
      SELECT conversation_id FROM public.conversation_participants
      WHERE profile_id = auth.uid()
    )
  );

CREATE POLICY "messages_update" ON public.messages
  FOR UPDATE TO authenticated USING (sender_id = auth.uid());

-- ============================================================================
-- TABLE 40: qr_cards
-- ============================================================================

CREATE TABLE public.qr_cards (
  id                uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id        uuid NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  slug              text NOT NULL UNIQUE,
  headline          text,
  bio               text,
  phone             text,
  email             text,
  booking_url       text,
  company_name      text,
  company_logo_url  text,
  theme             jsonb DEFAULT '{}',
  is_active         bool NOT NULL DEFAULT true,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER set_qr_cards_updated_at
  BEFORE UPDATE ON public.qr_cards
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.qr_cards ENABLE ROW LEVEL SECURITY;

-- Public read for QR cards (they need to be accessible without auth)
CREATE POLICY "qr_cards_select" ON public.qr_cards
  FOR SELECT USING (is_active = true);

CREATE POLICY "qr_cards_own" ON public.qr_cards
  FOR ALL TO authenticated
  USING (profile_id = auth.uid())
  WITH CHECK (profile_id = auth.uid());

-- ============================================================================
-- TABLE 41: qr_scans
-- ============================================================================

CREATE TABLE public.qr_scans (
  id            uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  qr_card_id    uuid NOT NULL REFERENCES public.qr_cards(id) ON DELETE CASCADE,
  scanned_at    timestamptz NOT NULL DEFAULT now(),
  ip_address    text,
  user_agent    text,
  referrer      text,
  lead_id       uuid REFERENCES public.leads(id) ON DELETE SET NULL,
  created_at    timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.qr_scans ENABLE ROW LEVEL SECURITY;

-- Public insert (scans happen without auth)
CREATE POLICY "qr_scans_insert" ON public.qr_scans
  FOR INSERT WITH CHECK (true);

CREATE POLICY "qr_scans_select" ON public.qr_scans
  FOR SELECT TO authenticated USING (
    qr_card_id IN (
      SELECT id FROM public.qr_cards WHERE profile_id = auth.uid()
    )
    OR public.get_user_role() IN ('owner', 'admin')
  );

-- ============================================================================
-- SEED DATA: Default Pipeline Stages
-- ============================================================================

INSERT INTO public.pipeline_stages (name, slug, color, position, is_system, is_closed, requires_revenue, requires_lost_reason)
VALUES
  ('New Lead',    'new-lead',    '#3B82F6', 1, true, false, false, false),
  ('Must Recall', 'must-recall', '#F59E0B', 2, true, false, false, false),
  ('Quote Sent',  'quote-sent',  '#8B5CF6', 3, true, false, false, false),
  ('Closed Lost', 'closed-lost', '#EF4444', 4, true, true,  false, true),
  ('Closed Won',  'closed-won',  '#22C55E', 5, true, true,  true,  false);

-- ============================================================================
-- SEED DATA: Default Badges
-- ============================================================================

INSERT INTO public.badges (slug, name_en, name_fr, description_en, description_fr, icon, color, category, threshold)
VALUES
  ('first-knock', 'First Knock', 'Premier Coup', 'Knocked on your first door', 'Vous avez frappé à votre première porte', 'door', '#3B82F6', 'onboarding', '{"doors_knocked": 1}'),
  ('door-warrior', 'Door Warrior', 'Guerrier de Porte', 'Knocked on 100 doors', 'Vous avez frappé à 100 portes', 'shield', '#F59E0B', 'volume', '{"doors_knocked": 100}'),
  ('door-legend', 'Door Legend', 'Légende de Porte', 'Knocked on 500 doors', 'Vous avez frappé à 500 portes', 'crown', '#8B5CF6', 'volume', '{"doors_knocked": 500}'),
  ('first-close', 'First Close', 'Première Vente', 'Closed your first deal', 'Vous avez conclu votre première vente', 'star', '#22C55E', 'sales', '{"closes": 1}'),
  ('closer-10', 'Serial Closer', 'Vendeur en Série', 'Closed 10 deals', 'Vous avez conclu 10 ventes', 'fire', '#EF4444', 'sales', '{"closes": 10}'),
  ('revenue-1k', 'Revenue Rookie', 'Recrue du Revenu', 'Generated $1,000 in revenue', 'Généré 1 000$ de revenus', 'dollar', '#10B981', 'revenue', '{"revenue": 1000}'),
  ('revenue-10k', 'Revenue Pro', 'Pro du Revenu', 'Generated $10,000 in revenue', 'Généré 10 000$ de revenus', 'gem', '#6366F1', 'revenue', '{"revenue": 10000}'),
  ('revenue-50k', 'Revenue King', 'Roi du Revenu', 'Generated $50,000 in revenue', 'Généré 50 000$ de revenus', 'trophy', '#F97316', 'revenue', '{"revenue": 50000}'),
  ('streak-7', 'Week Warrior', 'Guerrier de la Semaine', '7-day activity streak', 'Série d''activités de 7 jours', 'flame', '#EC4899', 'consistency', '{"streak_days": 7}'),
  ('streak-30', 'Month Machine', 'Machine du Mois', '30-day activity streak', 'Série d''activités de 30 jours', 'rocket', '#14B8A6', 'consistency', '{"streak_days": 30}'),
  ('team-player', 'Team Player', 'Joueur d''Équipe', 'Helped a teammate close a deal', 'Aidé un coéquipier à conclure une vente', 'handshake', '#8B5CF6', 'teamwork', '{"team_assists": 1}'),
  ('battle-champ', 'Battle Champion', 'Champion de Bataille', 'Won your first battle', 'Remporté votre première bataille', 'sword', '#EF4444', 'competition', '{"battles_won": 1}');

-- ============================================================================
-- SEED DATA: Default Leaderboard Metric Definitions
-- ============================================================================

INSERT INTO public.leaderboard_metric_definitions (slug, name_en, name_fr, calculation_type, source_event_type, source_field, description)
VALUES
  ('doors-knocked',   'Doors Knocked',   'Portes Frappées',     'count', 'door_knock',   NULL,     'Total number of doors knocked'),
  ('conversations',   'Conversations',   'Conversations',       'count', 'conversation', NULL,     'Total conversations started'),
  ('demos-set',       'Demos Set',       'Démos Planifiées',    'count', 'demo_set',     NULL,     'Total demos scheduled'),
  ('demos-held',      'Demos Held',      'Démos Réalisées',     'count', 'demo_held',    NULL,     'Total demos completed'),
  ('quotes-sent',     'Quotes Sent',     'Soumissions Envoyées','count', 'quote_sent',   NULL,     'Total quotes sent to leads'),
  ('closes',          'Closes',          'Ventes Conclues',     'count', 'status_change', NULL,    'Total deals closed won'),
  ('revenue',         'Revenue',         'Revenus',             'sum',   'status_change', 'revenue','Total revenue generated'),
  ('close-rate',      'Close Rate',      'Taux de Conclusion',  'rate',  NULL,           NULL,     'Percentage of leads that convert to closed won'),
  ('avg-deal-size',   'Avg Deal Size',   'Taille Moy. Vente',  'average','status_change','revenue','Average revenue per closed deal'),
  ('follow-ups',      'Follow-Ups',      'Relances',            'count', 'follow_up',    NULL,     'Total follow-up interactions completed');

-- ============================================================================
-- DONE
-- ============================================================================
