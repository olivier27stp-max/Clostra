# FieldPulse Product Plan

> Version 1.0 | Last updated: 2026-03-27
> Status: Production Blueprint

---

## Table of Contents

1. [Product Vision Summary](#1-product-vision-summary)
2. [V1 Scope vs Deferred Scope](#2-v1-scope-vs-deferred-scope)
3. [User Roles and Permissions Matrix](#3-user-roles-and-permissions-matrix)
4. [Core User Flows](#4-core-user-flows)
5. [Full Information Architecture](#5-full-information-architecture)
6. [Detailed Page-by-Page Functional Spec](#6-detailed-page-by-page-functional-spec)
7. [Database Schema Design](#7-database-schema-design)
8. [Key Backend Logic / Services](#8-key-backend-logic--services)
9. [Realtime + Offline Sync Architecture](#9-realtime--offline-sync-architecture)
10. [KPI and Leaderboard Calculation Model](#10-kpi-and-leaderboard-calculation-model)
11. [Gamification System Design](#11-gamification-system-design)
12. [Commission and Payroll Preview Logic](#12-commission-and-payroll-preview-logic)
13. [Calendar Integration Architecture](#13-calendar-integration-architecture)
14. [Communication and QR Card System](#14-communication-and-qr-card-system)
15. [Design System / UI Guidelines](#15-design-system--ui-guidelines)
16. [Suggested Next.js App Router Folder Structure](#16-suggested-nextjs-app-router-folder-structure)
17. [Suggested Supabase Schema / SQL Outline](#17-suggested-supabase-schema--sql-outline)
18. [Component Breakdown](#18-component-breakdown)
19. [Edge Cases and Failure Handling](#19-edge-cases-and-failure-handling)
20. [Phased Build Plan](#20-phased-build-plan)

---

## 1. Product Vision Summary

**FieldPulse** is the best rep management and leaderboard-centric door-to-door (D2D) field sales web application. It is purpose-built for a single company operating a field sales force, designed to be the central nervous system for every rep, team leader, and manager in the organization.

### Core Positioning

- **Leaderboard-first**: Performance visibility is not an afterthought -- it is the heartbeat of the product. Closes are bold. Revenue is secondary. Every rep knows where they stand at all times.
- **Field-friendly, desktop-first**: The primary interface is a web desktop application optimized for managers and team leaders. The same interface is responsive and field-usable on mobile browsers with offline capabilities for reps in the field.
- **Single-tenant**: One company, one deployment. No multi-tenant complexity in V1. The entire data model assumes a single organization.
- **Bilingual FR/EN**: Full internationalization from day one using next-intl with `[locale]` routing. All UI strings, notifications, and exports support French and English.

### Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14+ (App Router) |
| Database / Auth / Realtime | Supabase (PostgreSQL, Auth, Realtime, Storage) |
| Styling | Tailwind CSS 4 |
| Component Library | shadcn/ui |
| State Management | Zustand (client), React Server Components (server) |
| Maps | Mapbox GL JS or Google Maps JS API |
| Offline | IndexedDB (via Dexie.js), Service Worker |
| i18n | next-intl |
| Deployment | Vercel |

### Design Philosophy

- Dark theme, premium SaaS aesthetic
- Data-dense but not cluttered
- Every pixel earns its place
- Gamification feels native, not gimmicky
- Offline is seamless, not an excuse for degraded UX

---

## 2. V1 Scope vs Deferred Scope

### V1 Core (MVP)

| Module | Key Features |
|---|---|
| **Dashboard** | Role-specific KPI cards, today's agenda, recent activity, quick actions |
| **Map** | Interactive pins (lead status color-coded), polygon territory drawing, territory assignment to reps/teams, GPS tracking during field sessions, check-in/check-out at doors, heatmap foundation (density overlay based on knock data) |
| **Leads CRM** | Full CRUD, table/board/map views, lead timeline, bulk actions, import/export, household grouping, custom fields |
| **Pipeline** | Configurable stages: New Lead, Must Recall, Quote Sent, Closed Lost, Closed Won. Drag-drop board. Stage transition rules. Automation triggers on move. |
| **Calendar** | Day/week/month views. Google Calendar sync (OAuth2). Outlook sync (OAuth2). Calendly webhook ingestion. Appointment creation from leads. Conflict detection. |
| **Leaderboard** | Closes displayed **bold** as primary metric. Revenue as secondary. Detailed rep KPI drill-down. Daily/weekly/monthly/all-time timeframes. Team and individual views. |
| **Gamification** | Badges (milestone-based, streak-based, custom). Achievements (profile-visible unlocks). Daily/weekly challenges (configurable by admin). Rep battles (1v1 KPI duels). Team competitions. Social feed with auto-celebrations. |
| **Teams** | Team CRUD, member assignment, team leader designation, team territory view, team performance aggregates |
| **Commissions** | Per-sale commission rules (flat + percentage). Commission ledger per rep. Payroll preview by date range. Pending/approved states. Recalculation on status change with audit trail. |
| **Communication** | Internal chat (direct messages, team channels). SMS architecture (send/receive via Twilio, logged on lead timeline). Email logging (BCC capture or API). Digital business card with QR code, shareable link, booking CTA, scan tracking. |
| **Quotes / Contracts / E-signature / PDF** | Quote builder linked to leads. Contract templates. E-signature capture (canvas-based). PDF generation and storage. Attachment management. |
| **Reports** | Rep performance as flagship report (closes, revenue, conversion, activity volume). Trend charts. Exportable. Filterable by date, rep, team, territory. |
| **Offline-first Field Experience** | IndexedDB local cache for leads, map data, pipeline. Mutation queue for offline actions. Sync status indicator. Service worker for asset caching. |
| **Settings** | Company profile, pipeline stage config, commission rules, badge/challenge management, calendar connections, localization, business card editor, role management |
| **RBAC** | Four roles: Owner, Admin, Team Leader, Sales Rep. Row-level security via Supabase RLS policies. |

### V1.5 Deferred

| Feature | Rationale for Deferral |
|---|---|
| Route breadcrumbs (GPS path recording) | Requires significant mobile optimization and battery management |
| Advanced heatmap ML (predictive hot zones) | Needs historical data accumulation before ML is meaningful |
| XP economy (points for all actions) | Adds complexity to gamification; badges/challenges sufficient for V1 |
| Rewards marketplace (redeem XP for prizes) | Requires inventory/fulfillment logic |
| Full payroll processing | Regulatory complexity; preview is sufficient for V1 |
| Advanced automation rules (if/then workflows) | Pipeline automation triggers cover 80% of needs |
| Custom report builder (drag-drop) | Predefined reports cover core needs |
| Bulk SMS/email campaigns | Requires deliverability infrastructure and compliance work |
| Advanced analytics dashboards (cohort, funnel) | Standard reports sufficient for launch |

### Future Roadmap

| Feature | Timeline Estimate |
|---|---|
| AI lead scoring (propensity model) | V2 |
| Predictive territory optimization | V2 |
| Native mobile app (React Native or Capacitor) | V2 |
| Multi-tenant architecture | V3 |
| White-label / reseller program | V3 |
| Recruiting module (applicant tracking for reps) | V2.5 |
| Advanced workflow automation (Zapier-like) | V2.5 |

---

## 3. User Roles and Permissions Matrix

### Role Definitions

| Role | Description |
|---|---|
| **Owner** | Company owner. Full unrestricted access. Can transfer ownership. Single user per deployment. |
| **Admin** | Operations manager. Near-full access. Cannot transfer ownership or delete the company. |
| **Team Leader** | Field manager. Manages assigned reps and territories. Views team performance. Limited settings access. |
| **Sales Rep** | Field representative. Access to own data, field operations, personal stats. Most restricted role. |

### Permissions Matrix

| Permission | Owner | Admin | Team Leader | Sales Rep |
|---|---|---|---|---|
| **Dashboard** | | | | |
| View company-wide dashboard | Yes | Yes | No | No |
| View team dashboard | Yes | Yes | Yes (own team) | No |
| View personal dashboard | Yes | Yes | Yes | Yes |
| **Map** | | | | |
| View all territories | Yes | Yes | Yes (assigned) | Yes (assigned) |
| Create/edit territories (polygons) | Yes | Yes | No | No |
| Assign territories to reps/teams | Yes | Yes | Yes (own team) | No |
| View all rep GPS positions | Yes | Yes | Yes (own team) | No |
| Start field session / GPS tracking | No | No | Yes | Yes |
| Check-in/check-out at doors | No | No | Yes | Yes |
| View heatmap (all) | Yes | Yes | No | No |
| View heatmap (team territory) | Yes | Yes | Yes | No |
| **Leads** | | | | |
| View all leads | Yes | Yes | No | No |
| View team leads | Yes | Yes | Yes | No |
| View own leads | Yes | Yes | Yes | Yes |
| Create leads | Yes | Yes | Yes | Yes |
| Edit any lead | Yes | Yes | Yes (team) | Own only |
| Delete leads | Yes | Yes | No | No |
| Reassign leads | Yes | Yes | Yes (within team) | No |
| Bulk actions (all) | Yes | Yes | No | No |
| Bulk actions (team) | Yes | Yes | Yes | No |
| Import/export leads | Yes | Yes | No | No |
| **Pipeline** | | | | |
| View pipeline (all) | Yes | Yes | No | No |
| View pipeline (team) | Yes | Yes | Yes | No |
| View pipeline (own) | Yes | Yes | Yes | Yes |
| Move leads between stages | Yes | Yes | Yes (team) | Own only |
| Configure pipeline stages | Yes | Yes | No | No |
| **Calendar** | | | | |
| View all appointments | Yes | Yes | No | No |
| View team appointments | Yes | Yes | Yes | No |
| View own appointments | Yes | Yes | Yes | Yes |
| Create appointments | Yes | Yes | Yes | Yes |
| Edit/cancel any appointment | Yes | Yes | Yes (team) | Own only |
| Connect external calendar | Yes | Yes | Yes | Yes |
| **Leaderboard** | | | | |
| View full leaderboard | Yes | Yes | Yes | Yes |
| View KPI drill-down (any rep) | Yes | Yes | Yes (team) | Own only |
| Configure leaderboard metrics | Yes | Yes | No | No |
| **Gamification** | | | | |
| View badges/achievements (any) | Yes | Yes | Yes | Yes (public) |
| Create/edit badges | Yes | Yes | No | No |
| Create/edit challenges | Yes | Yes | No | No |
| Create battles | Yes | Yes | Yes | Yes (challenge only) |
| View/interact with feed | Yes | Yes | Yes | Yes |
| **Teams** | | | | |
| View all teams | Yes | Yes | No | No |
| Create/edit/delete teams | Yes | Yes | No | No |
| Assign team leaders | Yes | Yes | No | No |
| Add/remove team members | Yes | Yes | Yes (own team) | No |
| View team performance | Yes | Yes | Yes (own team) | No |
| **Commissions** | | | | |
| View all commissions | Yes | Yes | No | No |
| View team commissions | Yes | Yes | Yes | No |
| View own commissions | Yes | Yes | Yes | Yes |
| Configure commission rules | Yes | Yes | No | No |
| Approve commission entries | Yes | Yes | No | No |
| Generate payroll preview | Yes | Yes | No | No |
| **Communication** | | | | |
| Send direct messages | Yes | Yes | Yes | Yes |
| Create group conversations | Yes | Yes | Yes | No |
| Create team channels | Yes | Yes | No | No |
| View all conversations | Yes | No | No | No |
| Send SMS from platform | Yes | Yes | Yes | Yes |
| Manage QR card templates | Yes | Yes | No | No |
| View QR scan analytics | Yes | Yes | Yes (own) | Yes (own) |
| **Quotes / Contracts** | | | | |
| Create quotes | Yes | Yes | Yes | Yes |
| Edit any quote | Yes | Yes | Yes (team) | Own only |
| Create contract templates | Yes | Yes | No | No |
| Send for signature | Yes | Yes | Yes | Yes |
| View all contracts | Yes | Yes | No | No |
| **Reports** | | | | |
| View all reports | Yes | Yes | No | No |
| View team reports | Yes | Yes | Yes | No |
| View own performance report | Yes | Yes | Yes | Yes |
| Export reports | Yes | Yes | Yes (team) | No |
| **Settings** | | | | |
| Company settings | Yes | Yes | No | No |
| Pipeline configuration | Yes | Yes | No | No |
| Commission rules | Yes | Yes | No | No |
| Badge/challenge management | Yes | Yes | No | No |
| Role management | Yes | Yes | No | No |
| Calendar connections (global) | Yes | Yes | No | No |
| Business card template | Yes | Yes | No | No |
| Localization settings | Yes | Yes | No | No |
| Personal profile | Yes | Yes | Yes | Yes |
| Transfer ownership | Yes | No | No | No |
| Delete company | Yes | No | No | No |
| Invite users | Yes | Yes | No | No |
| Deactivate users | Yes | Yes | No | No |

---

## 4. Core User Flows

### Flow 1: Rep Morning Field Session Start

```
1. Rep opens FieldPulse on mobile browser
2. Dashboard shows: today's appointments, yesterday's stats, current challenge progress
3. Rep taps "Start Field Session" (prominent CTA)
4. Browser requests GPS permission (if not granted)
5. Field session begins:
   - GPS tracking starts (pings every 30s)
   - Status indicator turns green ("In Field")
   - Map view opens centered on assigned territory
6. Rep sees their territory polygon highlighted
7. Pins show existing leads color-coded by status
8. Rep walks to first door
```

### Flow 2: Lead Capture from Map

```
1. Rep is in active field session viewing the map
2. Rep taps/clicks on a location (or taps "+" to add pin)
3. Quick-add lead form slides up:
   - Address (auto-filled from GPS or map tap)
   - Name (optional at door)
   - Disposition (Not Home, Not Interested, Callback, Interested, Demo Set)
4. Rep fills minimal info and saves
5. Lead pin appears on map with status color
6. Activity event logged: "door_knocked"
7. If "Interested" or "Demo Set":
   - Lead enters pipeline as "New Lead"
   - Rep can immediately book appointment from lead card
8. If "Not Home":
   - Pin shows as grey, flagged for revisit
9. Offline: form saves to IndexedDB, syncs when connection returns
```

### Flow 3: Lead Progression Through Pipeline

```
1. Lead starts in "New Lead" stage (created from door knock or manual entry)
2. Rep calls lead back -> moves to "Must Recall" if no answer, or progresses
3. Rep books demo -> appointment created, linked to lead
4. Demo completed -> rep creates quote
5. Quote sent -> lead auto-moves to "Quote Sent" stage
6. Customer accepts -> rep moves to "Closed Won"
   - Commission entry auto-generated
   - Badge check triggered
   - Challenge progress updated
   - Leaderboard recalculated
   - Feed auto-celebration posted
7. OR customer declines -> rep moves to "Closed Lost"
   - Lost reason captured
   - Commission entry voided if any existed
```

### Flow 4: Appointment Booking from Lead

```
1. Rep views lead detail page
2. Taps "Book Appointment"
3. Calendar widget shows:
   - Rep's availability (from synced calendar)
   - Existing appointments for the day
   - Conflict warnings
4. Rep selects date/time, adds notes
5. Appointment created and linked to lead
6. If Google/Outlook connected:
   - Event pushed to external calendar
7. If Calendly connected:
   - Calendly link available to share with customer
8. Lead timeline shows "Appointment booked" event
9. Activity event logged: "demo_set"
```

### Flow 5: Leaderboard Check and Drill-Down

```
1. Rep navigates to Leaderboard page
2. Default view: Weekly ranking, sorted by Closes (bold numbers)
3. Rep sees their position with rank indicator (up/down arrow from yesterday)
4. Rep taps on another rep's name (or their own)
5. Drill-down panel opens showing:
   - Doors knocked this period
   - Conversations
   - Demos set / held
   - Quotes sent
   - Closes
   - Revenue
   - Conversion rate (doors -> closes)
   - Average ticket size
   - Follow-ups completed
6. Comparison mode: rep can select another rep to see side-by-side stats
7. Timeframe toggle: Day / Week / Month / All-time
```

### Flow 6: Challenge Participation

```
1. Admin creates a daily challenge: "First to 20 doors knocked today wins"
2. All eligible reps see challenge notification on dashboard
3. Challenge card shows: goal, current progress, time remaining, participants
4. As reps knock doors, progress updates in near-realtime
5. Feed shows live updates: "Alex just hit 15 doors!"
6. First rep to hit 20 triggers:
   - Challenge completion notification
   - Badge award (if applicable)
   - Feed celebration post
   - Challenge card shows winner
```

### Flow 7: Commission Review

```
1. Rep navigates to Commissions page
2. Sees commission ledger: list of all commission entries
3. Each entry shows: lead name, deal value, commission amount, status (pending/approved), date
4. Summary cards: Total earned (period), Pending approval, Approved, Paid
5. Rep can filter by date range
6. "Payroll Preview" section shows projected payout for current pay period
7. Admin view: bulk approve commissions, generate payroll report
```

### Flow 8: Manager Territory Assignment

```
1. Owner/Admin opens Map page
2. Switches to "Territory Management" mode
3. Draws polygon on map using drawing tools
4. Names the territory (e.g., "Sector Nord-Est")
5. Opens territory assignment panel
6. Selects team or individual rep to assign
7. Territory appears color-coded by assignee
8. Saves assignment
9. Assigned reps see their territory highlighted when they open the map
10. Territory boundaries enforce which leads belong to which rep/team
```

### Flow 9: Team Leader Monitoring Reps

```
1. Team leader opens Dashboard
2. Sees team-specific view:
   - Active field sessions (reps currently in field with live GPS dots)
   - Today's team stats (doors, demos, closes)
   - Team ranking on leaderboard
3. Opens Map to see real-time rep positions within team territory
4. Clicks on a rep's GPS dot -> sees their current session stats
5. Opens Teams page -> sees detailed breakdown per rep
6. Can reassign a lead from one rep to another within the team
7. Can send direct message to any team member
```

---

## 5. Full Information Architecture

### Primary Navigation (Sidebar)

```
Dashboard          /[locale]/dashboard
Map                /[locale]/map
Leads              /[locale]/leads
Pipeline           /[locale]/pipeline
Calendar           /[locale]/calendar
Leaderboard        /[locale]/leaderboard
Teams              /[locale]/teams
Feed               /[locale]/feed
Commissions        /[locale]/commissions
Messages           /[locale]/messages
Reports            /[locale]/reports
Settings           /[locale]/settings
```

### Sub-Pages

```
Dashboard
  (no sub-pages; role-based content switching)

Map
  (no sub-pages; modes: Browse, Territory Mgmt, Field Session)

Leads
  /leads                    Table view (default)
  /leads?view=board         Board view
  /leads?view=map           Map view
  /leads/[id]               Lead detail page
  /leads/import             Import wizard
  /leads/export             Export wizard

Pipeline
  /pipeline                 Kanban board (default)
  /pipeline?view=list       List view

Calendar
  /calendar                 Month view (default)
  /calendar?view=week       Week view
  /calendar?view=day        Day view

Leaderboard
  /leaderboard              Rankings (default)
  /leaderboard/[repId]      Rep drill-down

Teams
  /teams                    Team list
  /teams/[id]               Team detail (members, performance, territory)

Feed
  /feed                     Social feed (default)

Commissions
  /commissions              Commission ledger
  /commissions/payroll      Payroll preview

Messages
  /messages                 Conversation list + active chat

Reports
  /reports                  Report selector
  /reports/rep-performance  Flagship rep performance report
  /reports/team-performance Team performance report
  /reports/pipeline         Pipeline analysis report
  /reports/activity         Activity volume report

Settings
  /settings/general         Company profile, branding
  /settings/pipeline        Pipeline stage configuration
  /settings/commissions     Commission rule configuration
  /settings/calendar        Calendar connection management
  /settings/badges          Badge management
  /settings/challenges      Challenge management
  /settings/roles           Role and permission management
  /settings/business-card   Digital business card template
  /settings/localization    Language and locale settings

Profile
  /profile                  Personal profile, avatar, connected calendars
```

---

## 6. Detailed Page-by-Page Functional Spec

### 6.1 Dashboard

**Purpose**: At-a-glance performance and agenda for the current user.

**Role-Specific Views**:

| Element | Owner/Admin | Team Leader | Sales Rep |
|---|---|---|---|
| KPI Cards | Company totals (closes, revenue, demos, doors) | Team totals | Personal totals |
| Period Selector | Day/Week/Month/Quarter | Day/Week/Month | Day/Week/Month |
| Active Sessions | All reps in field | Team reps in field | Own session status |
| Today's Agenda | N/A | Team appointments | Personal appointments |
| Recent Activity | Company-wide | Team activity | Personal activity |
| Quick Actions | Create lead, Assign territory, Create challenge | Create lead, Message team | Start session, Create lead, Check leaderboard |
| Leaderboard Preview | Top 5 company | Top 5 team | Personal rank + neighbors |
| Challenge Preview | Active challenges | Active challenges | Active challenges with progress |

**Functional Details**:
- KPI stat cards follow consistent pattern: metric name, current value, trend arrow, comparison to previous period
- "Start Field Session" is a persistent CTA for reps/team leaders when not in an active session
- Activity feed shows last 10 items with "View all" link to Feed page
- Dashboard data refreshes via Supabase Realtime subscriptions for live counters

### 6.2 Map

**Purpose**: Geographical visualization of leads, territories, and field activity.

**Modes**:

1. **Browse Mode** (default)
   - Pins: Every lead shown as a colored pin (color = pipeline stage)
   - Pin clustering at zoom levels > city scale
   - Click pin -> lead preview popover (name, status, last activity, quick actions)
   - Filter bar: by status, assignee, date range, territory
   - Search: address search with geocoding

2. **Territory Management Mode** (Owner/Admin only)
   - Drawing tools: polygon draw, edit vertices, delete
   - Territory list panel (right sidebar)
   - Assignment: drag rep/team onto territory or use dropdown
   - Color-coding: each territory tinted by assigned team color
   - Overlap detection with warning

3. **Field Session Mode** (Rep/Team Leader)
   - Centered on rep's current GPS position
   - Assigned territory polygon highlighted
   - "Add Pin" floating action button for quick lead capture
   - Check-in/check-out: tap existing pin -> "Check In" button -> logs visit
   - Session stats overlay: doors knocked, time elapsed, distance covered

4. **Heatmap Overlay** (toggle)
   - Density overlay based on door knock volume
   - Color gradient: cold (few knocks) to hot (many knocks)
   - Filterable by date range
   - Foundation only in V1 -- no ML predictions

**Offline Behavior**:
- Map tiles cached via service worker for assigned territory
- Pins loaded from IndexedDB
- New pins created offline, queued for sync
- GPS continues logging to local storage

### 6.3 Leads

**Purpose**: Central CRM for all lead/prospect data.

**Views**:

1. **Table View** (default)
   - Columns: Name, Address, Phone, Email, Status, Assigned Rep, Last Activity, Created Date, Deal Value
   - Sortable, filterable, searchable
   - Bulk selection with bulk actions (reassign, change status, delete, export)
   - Pagination or infinite scroll (configurable)
   - Column visibility toggle

2. **Board View**
   - Cards grouped by pipeline stage
   - Drag-drop between stages
   - Card shows: name, address, deal value, days in stage, assigned rep avatar
   - Same as Pipeline page but accessible from Leads module

3. **Map View**
   - Embedded map with lead pins
   - Filter/search synchronized with map

**Lead Detail Page** (`/leads/[id]`):

- Header: Name, address, status badge, assigned rep, deal value
- Quick actions: Call, Email, SMS, Book Appointment, Create Quote, Move Stage
- Tabs:
  - **Timeline**: Chronological activity log (calls, visits, emails, stage changes, notes, quotes sent, appointments)
  - **Details**: All lead fields (editable inline)
  - **Appointments**: Linked appointments
  - **Quotes/Contracts**: Linked documents
  - **Attachments**: Files, photos (e.g., site photos taken during visit)
  - **Notes**: Free-form notes
- Household grouping: if address matches another lead, show "Household" link
- Activity event creation: manual log entry (call, note, follow-up)

**Bulk Actions**:
- Select multiple leads via checkboxes
- Available actions: Reassign, Change Status, Add Tag, Delete, Export CSV
- Confirmation modal for destructive actions

**Import/Export**:
- CSV import with column mapping wizard
- CSV/Excel export with current filters applied

### 6.4 Pipeline

**Purpose**: Visual deal progression management.

**Default View**: Kanban board

**Stages** (configurable in Settings):

| Stage | Default Color | Description |
|---|---|---|
| New Lead | Blue (#3B82F6) | Just captured, not yet contacted |
| Must Recall | Amber (#F59E0B) | Attempted contact, needs follow-up |
| Quote Sent | Purple (#8B5CF6) | Proposal/quote delivered to prospect |
| Closed Won | Green (#10B981) | Deal closed successfully |
| Closed Lost | Red (#EF4444) | Deal lost |

**Functional Details**:
- Drag-drop cards between stages
- Stage transition triggers:
  - Moving to "Closed Won" -> creates commission entry, fires badge check, updates leaderboard
  - Moving to "Closed Lost" -> prompts for lost reason, voids pending commission
  - Moving to "Quote Sent" -> logs event, starts aging timer
- Stage count and total deal value shown in column header
- Filter bar: by rep, team, date range, deal value range
- Cards show: lead name, deal value, days in stage, rep avatar, next action date
- Click card -> opens lead detail in drawer (no full page navigation)
- Stage configuration (Settings):
  - Add/remove/reorder stages
  - Set stage color
  - Set automation rules per stage (e.g., auto-assign follow-up task)
  - Mark stages as "won" or "lost" type

### 6.5 Calendar

**Purpose**: Appointment scheduling and external calendar synchronization.

**Views**:
- **Month View**: Traditional calendar grid with appointment dots
- **Week View**: Time-slot grid (7am-9pm default), appointments as blocks
- **Day View**: Detailed hourly timeline

**Functional Details**:
- Click time slot -> create appointment form
- Appointment fields: Title, Lead (linked), Date/Time, Duration, Location, Notes, Type (Demo, Follow-up, Consultation, Other)
- Appointment colors by type
- External calendar events shown as greyed-out "busy" blocks
- Conflict detection: warning when booking over an existing appointment
- Drag-resize to change appointment time/duration
- Appointment click -> detail popover with quick actions (edit, cancel, mark complete, open lead)
- "Mark as Completed" logs `demo_held` event on the linked lead

**Sync Details**:
- Google Calendar: OAuth2 connection, bi-directional sync
- Outlook Calendar: OAuth2 connection, bi-directional sync
- Calendly: Webhook ingestion (one-way: Calendly -> FieldPulse)
- Sync status indicator per connection
- Token refresh handled automatically with error notification on failure

### 6.6 Leaderboard

**Purpose**: Transparent, motivating performance rankings.

**Primary Metric**: **Closes** (displayed in bold, large font)
**Secondary Metric**: Revenue (displayed smaller, below closes)

**Layout**:
- Podium section: Top 3 reps with avatars, names, close counts (styled prominently)
- Ranking table below: Position, Rep Name/Avatar, Closes, Revenue, Trend Arrow
- Trend arrows: green up / red down / grey neutral compared to previous period

**Timeframe Toggle**: Day | Week | Month | All-Time

**Scope Toggle**: Individual | Team

**Drill-Down** (click rep name or navigate to `/leaderboard/[repId]`):
- Full KPI breakdown:

| Metric | Type | Description |
|---|---|---|
| Doors Knocked | Event count | Total check-ins/door knock events |
| Conversations | Event count | Doors where meaningful conversation occurred |
| Demos Set | Event count | Appointments created |
| Demos Held | Event count | Appointments marked completed |
| Quotes Sent | Event count | Quotes created and sent |
| Closes | Event count | Leads moved to Closed Won |
| Revenue | Sum | Total deal value of Closed Won leads |
| Conversion Rate | Computed | Closes / Doors Knocked |
| Average Ticket | Computed | Revenue / Closes |
| Follow-ups Completed | Event count | Follow-up activities logged |

- Sparkline charts for each metric (7-day or 30-day trend)
- Comparison selector: pick another rep for side-by-side view

**Team Leaderboard**:
- Teams ranked by aggregate closes
- Click team -> expands to show member breakdown

### 6.7 Gamification

**Purpose**: Drive engagement, motivation, and friendly competition.

**Sub-Systems**:

#### Badges
- Awarded automatically when conditions are met
- Displayed on rep profile and in feed
- Categories:
  - **Milestone**: First Close, 5 Closes, 10 Closes, 25 Closes, 50 Closes, 100 Closes
  - **Performance**: Top Closer (Week), Quote Machine (10 quotes in a week), Follow-up Finisher (complete all follow-ups), Conversation King/Queen (most conversations in a day)
  - **Streak**: 3-Day Streak, 7-Day Streak, 30-Day Streak (consecutive days with at least 1 close)
  - **Custom**: Admin can create custom badges with name, icon, description, and trigger condition

#### Achievements
- Larger milestones that unlock permanently
- Visible on profile page as a trophy case
- Examples: "Century Club" (100 closes), "Revenue King" ($100K total revenue), "Iron Rep" (30-day activity streak)

#### Challenges
- Time-bound competitions created by Admin/Owner
- Types: Daily, Weekly, Custom duration
- Configuration: metric, target, start/end time, eligible participants
- Progress tracking in real-time
- Winner announcement in feed

#### Battles
- 1v1 or Team vs Team
- Any rep can challenge another rep (with acceptance)
- Admin can create mandatory team battles
- Based on any KPI metric over a defined period
- Live progress bar showing both sides
- Winner gets badge or feed recognition

#### Feed Integration
- All gamification events post to the social feed automatically
- Badge earned, challenge won, battle completed, achievement unlocked

### 6.8 Teams

**Purpose**: Organizational structure and team performance management.

**Team List Page**:
- Card grid: each team shows name, leader, member count, territory, key stats
- Create team button (Owner/Admin only)

**Team Detail Page** (`/teams/[id]`):
- Header: team name, leader avatar/name, member count
- Tabs:
  - **Members**: List with avatar, name, role, status (active/inactive, in field/office)
  - **Performance**: Team aggregate KPIs, member ranking within team
  - **Territory**: Map view of assigned territory with pins
  - **Activity**: Team activity feed
- Actions: Add/remove members, change leader, edit territory assignment

### 6.9 Commissions

**Purpose**: Financial tracking and payroll preparation.

**Commission Ledger**:
- Table: Date, Lead Name, Deal Value, Commission Type, Rate, Amount, Status (Pending/Approved/Paid), Rep
- Filterable by: rep, team, date range, status
- Summary cards: Total Earned, Pending, Approved, Paid (current period)

**Commission Rules** (configured in Settings):
- Rule fields: Name, Type (flat per sale / percentage of deal), Rate/Amount, Conditions (minimum deal value, specific stage, product type)
- Multiple rules can apply to a single sale (stacking)
- Rules versioned: changes don't retroactively affect existing entries

**Payroll Preview**:
- Select date range and rep (or all reps)
- Generates summary: Rep Name, Total Closes, Total Revenue, Commission Earned, Adjustments, Net Payout
- Export to CSV/PDF
- "Approve All" bulk action for pending entries

### 6.10 Communication

**Purpose**: Internal team communication and external prospect engagement.

#### Internal Chat (`/messages`)
- Conversation types: Direct (1:1), Group, Team Channel
- Message features: text, emoji, file attachments
- Read receipts (checkmarks)
- Unread count badge on sidebar navigation
- Real-time via Supabase Realtime

#### SMS Architecture
- Send SMS to leads directly from lead detail page
- SMS logged on lead timeline
- Twilio integration for send/receive
- Incoming SMS routed to assigned rep's conversation
- SMS templates for common messages

#### Email Logging
- BCC address for forwarding emails into lead timeline
- Or: direct email send from platform (via SendGrid/Postmark)
- Emails appear in lead timeline

#### Digital Business Card / QR Code
- Each rep gets a personalized digital card
- Card contains: name, photo, title, company, phone, email, booking link
- QR code generated for the card URL
- Shareable link (e.g., `fieldpulse.app/card/[rep-slug]`)
- Card page includes "Book a Meeting" CTA (links to Calendly or internal calendar)
- Tracking: opens, link clicks, QR scans
- Scan creates a lead automatically (with UTM source tracking)

### 6.11 Quotes / Contracts / E-Signature / PDF

**Purpose**: Deal documentation and closing workflow.

**Quotes**:
- Create from lead detail page
- Line items: description, quantity, unit price, total
- Subtotal, tax, discount, grand total
- Quote status: Draft, Sent, Accepted, Declined, Expired
- Send via email or generate shareable link
- Quote acceptance triggers pipeline progression

**Contracts**:
- Template system: Admin creates contract templates with merge fields
- Merge fields: customer name, address, deal value, date, rep name, etc.
- Generate contract from quote or lead
- Contract status: Draft, Sent, Signed, Void

**E-Signature**:
- Canvas-based signature capture
- Signature stored as image in Supabase Storage
- Timestamp and IP logged for audit
- Multiple signers supported (customer + rep)

**PDF Generation**:
- Quotes and signed contracts exportable as PDF
- Company branding on PDF (logo, colors, address)
- Stored in Supabase Storage, linked to lead

**Attachments**:
- File upload on leads, quotes, contracts
- Image preview for photos (site photos, ID documents)
- Storage via Supabase Storage with signed URLs

### 6.12 Reports

**Purpose**: Performance analysis and business intelligence.

**Flagship Report: Rep Performance**
- Filters: Date range, Rep(s), Team(s), Territory
- Metrics table: all 10 KPI metrics per rep
- Bar charts: closes by rep, revenue by rep
- Line charts: daily/weekly trend for selected metric
- Conversion funnel: Doors -> Conversations -> Demos -> Quotes -> Closes
- Comparison mode: overlay two time periods

**Additional Reports**:
- **Team Performance**: Same metrics aggregated by team
- **Pipeline Analysis**: Stage distribution, average time in stage, stage-to-stage conversion rates
- **Activity Volume**: Doors knocked by day/hour, peak activity times, geographic distribution

**Export**: CSV and PDF for all reports

### 6.13 Offline Experience

**Purpose**: Uninterrupted field operations regardless of connectivity.

**Cached Data** (IndexedDB via Dexie.js):
- Assigned territory leads (full records)
- Map tiles for assigned territory (service worker)
- Pipeline stages configuration
- Rep's appointments for the day
- Active challenge data

**Offline Capabilities**:
- Create new leads
- Update lead status/details
- Log door knocks and check-ins
- Record GPS points
- Create appointments
- Add notes to leads

**Sync Mechanism**:
- Mutation queue: all offline writes stored as ordered operations
- On reconnection: mutations replayed in order against server
- Conflict resolution: last-write-wins with server timestamp for most fields
- Manual merge prompt for critical conflicts (e.g., two reps edited same lead)
- Sync status UI: green (synced), yellow (pending), red (conflict)

### 6.14 Settings

**Purpose**: Platform configuration and administration.

**Sub-Pages**:

| Page | Content |
|---|---|
| General | Company name, logo, address, timezone, default language |
| Pipeline | Stage CRUD, ordering, colors, automation rules |
| Commissions | Commission rule CRUD, default rates |
| Calendar | Connected calendar accounts, sync settings |
| Badges | Badge CRUD, trigger conditions, icons |
| Challenges | Challenge CRUD, templates, scheduling |
| Roles | Role definitions, permission overrides (future) |
| Business Card | Template editor, default fields, QR settings |
| Localization | Default language (FR/EN), date format, currency format |

### 6.15 RBAC Implementation

**Technical Approach**:
- Supabase Auth for authentication (email/password, magic link)
- `profiles` table with `role` column (enum: owner, admin, team_leader, sales_rep)
- Supabase Row-Level Security (RLS) policies on every table
- RLS policy patterns:
  - Owner/Admin: `auth.uid() IN (SELECT id FROM profiles WHERE role IN ('owner', 'admin'))`
  - Team Leader: above OR `lead.assigned_team_id IN (SELECT team_id FROM team_members WHERE profile_id = auth.uid() AND role = 'team_leader')`
  - Sales Rep: above OR `lead.assigned_rep_id = auth.uid()`
- Client-side role check for UI element visibility (redundant with RLS but better UX)
- Middleware-level role check for route protection

---

## 7. Database Schema Design

### Data Strategy

FieldPulse uses three data strategies depending on the use case:

| Strategy | Use Case | Example |
|---|---|---|
| **Event-sourced** | Activity tracking, KPI source of truth | `lead_activity_events` -- every door knock, call, stage change is an immutable event |
| **Materialized snapshots** | Leaderboard, performance queries | `rep_stat_snapshots` -- daily cron aggregates events into per-rep-per-day rows |
| **Computed on demand** | Conversion rates, averages | Calculated at query time from materialized data |

### Table Definitions

#### `profiles`
| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | References Supabase auth.users |
| email | text | Unique |
| full_name | text | |
| avatar_url | text | Supabase Storage URL |
| phone | text | |
| role | enum | owner, admin, team_leader, sales_rep |
| status | enum | active, inactive, invited |
| language | text | 'fr' or 'en' |
| created_at | timestamptz | |
| updated_at | timestamptz | |

**Indexes**: `role`, `status`, `email` (unique)

#### `teams`
| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| name | text | |
| leader_id | uuid (FK -> profiles) | |
| color | text | Hex color for map/UI |
| created_at | timestamptz | |
| updated_at | timestamptz | |

#### `team_members`
| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| team_id | uuid (FK -> teams) | |
| profile_id | uuid (FK -> profiles) | |
| joined_at | timestamptz | |

**Indexes**: `(team_id, profile_id)` unique composite

#### `territories`
| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| name | text | |
| polygon | geometry (Polygon) | PostGIS geometry |
| color | text | Hex, defaults to team color |
| metadata | jsonb | Flexible extra data |
| created_at | timestamptz | |
| updated_at | timestamptz | |

**Indexes**: `polygon` (GiST spatial index)

#### `territory_assignments`
| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| territory_id | uuid (FK -> territories) | |
| assignee_type | enum | 'team' or 'profile' |
| assignee_id | uuid | FK to teams or profiles |
| assigned_by | uuid (FK -> profiles) | |
| assigned_at | timestamptz | |

**Indexes**: `territory_id`, `(assignee_type, assignee_id)`

#### `leads`
| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| first_name | text | |
| last_name | text | |
| email | text | |
| phone | text | |
| address_line1 | text | |
| address_line2 | text | |
| city | text | |
| state_province | text | |
| postal_code | text | |
| country | text | Default 'CA' |
| lat | double precision | Geocoded |
| lng | double precision | Geocoded |
| status | text (FK -> lead_statuses) | Current pipeline stage slug |
| source | text | door_knock, referral, qr_scan, import, manual |
| assigned_rep_id | uuid (FK -> profiles) | |
| assigned_team_id | uuid (FK -> teams) | |
| household_id | uuid (FK -> households) | Nullable |
| deal_value | numeric(12,2) | |
| lost_reason | text | Populated on Closed Lost |
| custom_fields | jsonb | Flexible custom data |
| notes | text | |
| created_at | timestamptz | |
| updated_at | timestamptz | |

**Indexes**: `status`, `assigned_rep_id`, `assigned_team_id`, `household_id`, `(lat, lng)`, `created_at`, `source`

#### `lead_statuses` (pipeline stages)
| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| slug | text | Unique, machine-friendly |
| label_en | text | |
| label_fr | text | |
| color | text | Hex |
| position | integer | Sort order |
| type | enum | open, won, lost |
| is_default | boolean | Stage for new leads |
| created_at | timestamptz | |

#### `lead_activity_events`
| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| lead_id | uuid (FK -> leads) | |
| actor_id | uuid (FK -> profiles) | Rep who performed the action |
| event_type | text | door_knocked, conversation, demo_set, demo_held, quote_sent, close, follow_up, stage_change, note_added, call_logged, email_logged, sms_sent, check_in, check_out |
| metadata | jsonb | Event-specific data (e.g., from_stage, to_stage for stage_change) |
| created_at | timestamptz | Immutable timestamp |

**Indexes**: `lead_id`, `actor_id`, `event_type`, `created_at`, `(actor_id, event_type, created_at)` for KPI queries

#### `households`
| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| address_hash | text | Normalized address hash for dedup |
| address_display | text | Human-readable address |
| created_at | timestamptz | |

**Indexes**: `address_hash` (unique)

#### `appointments`
| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| lead_id | uuid (FK -> leads) | |
| rep_id | uuid (FK -> profiles) | |
| title | text | |
| type | enum | demo, follow_up, consultation, other |
| start_time | timestamptz | |
| end_time | timestamptz | |
| location | text | |
| notes | text | |
| status | enum | scheduled, completed, cancelled, no_show |
| external_event_id | text | ID from Google/Outlook if synced |
| created_at | timestamptz | |
| updated_at | timestamptz | |

**Indexes**: `rep_id`, `lead_id`, `start_time`, `status`

#### `calendar_connections`
| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| profile_id | uuid (FK -> profiles) | |
| provider | enum | google, outlook, calendly |
| access_token | text | Encrypted |
| refresh_token | text | Encrypted |
| token_expires_at | timestamptz | |
| external_calendar_id | text | Selected calendar ID |
| sync_enabled | boolean | |
| last_synced_at | timestamptz | |
| webhook_channel_id | text | For push notifications |
| created_at | timestamptz | |
| updated_at | timestamptz | |

#### `external_calendar_events`
| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| calendar_connection_id | uuid (FK) | |
| external_id | text | Provider's event ID |
| title | text | |
| start_time | timestamptz | |
| end_time | timestamptz | |
| is_all_day | boolean | |
| status | text | confirmed, tentative, cancelled |
| synced_at | timestamptz | |

**Indexes**: `(calendar_connection_id, external_id)` unique

#### `quotes`
| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| lead_id | uuid (FK -> leads) | |
| created_by | uuid (FK -> profiles) | |
| quote_number | text | Auto-generated, sequential |
| status | enum | draft, sent, accepted, declined, expired |
| line_items | jsonb | Array of {description, qty, unit_price, total} |
| subtotal | numeric(12,2) | |
| tax_rate | numeric(5,4) | |
| tax_amount | numeric(12,2) | |
| discount | numeric(12,2) | |
| total | numeric(12,2) | |
| valid_until | date | |
| sent_at | timestamptz | |
| accepted_at | timestamptz | |
| notes | text | |
| created_at | timestamptz | |
| updated_at | timestamptz | |

#### `contracts`
| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| lead_id | uuid (FK -> leads) | |
| quote_id | uuid (FK -> quotes) | Nullable |
| created_by | uuid (FK -> profiles) | |
| template_id | text | Reference to template used |
| content | text | Rendered contract content (HTML/markdown) |
| status | enum | draft, sent, signed, void |
| signed_at | timestamptz | |
| pdf_url | text | Supabase Storage URL |
| created_at | timestamptz | |
| updated_at | timestamptz | |

#### `signatures`
| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| contract_id | uuid (FK -> contracts) | |
| signer_name | text | |
| signer_email | text | |
| signer_type | enum | customer, rep |
| signature_image_url | text | Supabase Storage |
| ip_address | inet | |
| signed_at | timestamptz | |

#### `attachments`
| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| entity_type | text | lead, quote, contract |
| entity_id | uuid | Polymorphic FK |
| file_name | text | |
| file_url | text | Supabase Storage URL |
| file_type | text | MIME type |
| file_size | integer | Bytes |
| uploaded_by | uuid (FK -> profiles) | |
| created_at | timestamptz | |

**Indexes**: `(entity_type, entity_id)`

#### `customers`
| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| lead_id | uuid (FK -> leads) | Created when lead becomes Closed Won |
| first_name | text | |
| last_name | text | |
| email | text | |
| phone | text | |
| address | text | |
| created_at | timestamptz | |

#### `jobs`
| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| customer_id | uuid (FK -> customers) | |
| lead_id | uuid (FK -> leads) | |
| title | text | |
| description | text | |
| status | enum | pending, in_progress, completed, cancelled |
| scheduled_date | date | |
| completed_date | date | |
| created_at | timestamptz | |

#### `invoices`
| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| job_id | uuid (FK -> jobs) | |
| customer_id | uuid (FK -> customers) | |
| invoice_number | text | |
| amount | numeric(12,2) | |
| status | enum | draft, sent, paid, overdue, void |
| due_date | date | |
| paid_at | timestamptz | |
| created_at | timestamptz | |

#### `leaderboard_metric_definitions`
| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| slug | text | Unique (doors_knocked, closes, revenue, etc.) |
| label_en | text | |
| label_fr | text | |
| event_type | text | Nullable -- which event_type to count |
| aggregation | enum | count, sum, computed |
| source_field | text | For sum: which field (e.g., deal_value) |
| formula | text | For computed: e.g., "closes / doors_knocked" |
| display_order | integer | |
| is_primary | boolean | True for closes |
| is_bold | boolean | Display formatting hint |

#### `rep_stat_snapshots`
| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| profile_id | uuid (FK -> profiles) | |
| snapshot_date | date | |
| doors_knocked | integer | |
| conversations | integer | |
| demos_set | integer | |
| demos_held | integer | |
| quotes_sent | integer | |
| closes | integer | |
| revenue | numeric(12,2) | |
| follow_ups_completed | integer | |
| created_at | timestamptz | |

**Indexes**: `(profile_id, snapshot_date)` unique, `snapshot_date`

#### `challenges`
| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| title | text | |
| description | text | |
| type | enum | daily, weekly, custom |
| metric_slug | text | FK -> leaderboard_metric_definitions.slug |
| target_value | integer | Goal to reach |
| start_at | timestamptz | |
| end_at | timestamptz | |
| status | enum | upcoming, active, completed |
| created_by | uuid (FK -> profiles) | |
| winner_id | uuid (FK -> profiles) | Nullable, set on completion |
| created_at | timestamptz | |

#### `challenge_participants`
| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| challenge_id | uuid (FK -> challenges) | |
| profile_id | uuid (FK -> profiles) | |
| current_value | integer | Live progress |
| completed_at | timestamptz | Nullable |
| joined_at | timestamptz | |

**Indexes**: `(challenge_id, profile_id)` unique

#### `battles`
| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| type | enum | rep_vs_rep, team_vs_team |
| metric_slug | text | |
| challenger_type | enum | profile, team |
| challenger_id | uuid | |
| opponent_type | enum | profile, team |
| opponent_id | uuid | |
| challenger_score | integer | |
| opponent_score | integer | |
| start_at | timestamptz | |
| end_at | timestamptz | |
| status | enum | pending, accepted, active, completed, declined |
| winner_id | uuid | Nullable |
| created_at | timestamptz | |

#### `badges`
| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| slug | text | Unique |
| name_en | text | |
| name_fr | text | |
| description_en | text | |
| description_fr | text | |
| icon | text | Icon identifier or emoji |
| category | enum | milestone, performance, streak, custom |
| trigger_type | text | event_count, streak, manual |
| trigger_config | jsonb | {event_type, threshold, period, etc.} |
| created_at | timestamptz | |

#### `achievements`
| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| slug | text | Unique |
| name_en | text | |
| name_fr | text | |
| description_en | text | |
| description_fr | text | |
| icon | text | |
| trigger_config | jsonb | Condition definition |
| created_at | timestamptz | |

#### `rep_badges`
| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| profile_id | uuid (FK -> profiles) | |
| badge_id | uuid (FK -> badges) | |
| earned_at | timestamptz | |

**Indexes**: `(profile_id, badge_id)` unique

#### `rep_achievements`
| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| profile_id | uuid (FK -> profiles) | |
| achievement_id | uuid (FK -> achievements) | |
| unlocked_at | timestamptz | |

#### `feed_posts`
| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| author_id | uuid (FK -> profiles) | Nullable for system posts |
| type | enum | auto_celebration, badge_earned, challenge_won, battle_result, manual |
| content | text | |
| metadata | jsonb | {badge_id, challenge_id, lead_id, etc.} |
| created_at | timestamptz | |

**Indexes**: `created_at DESC`, `author_id`

#### `feed_comments`
| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| post_id | uuid (FK -> feed_posts) | |
| author_id | uuid (FK -> profiles) | |
| content | text | |
| created_at | timestamptz | |

#### `feed_reactions`
| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| post_id | uuid (FK -> feed_posts) | |
| profile_id | uuid (FK -> profiles) | |
| reaction_type | text | fire, thumbsup, clap, heart, etc. |
| created_at | timestamptz | |

**Indexes**: `(post_id, profile_id, reaction_type)` unique

#### `field_sessions`
| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| profile_id | uuid (FK -> profiles) | |
| territory_id | uuid (FK -> territories) | Nullable |
| started_at | timestamptz | |
| ended_at | timestamptz | Nullable (null = active) |
| doors_knocked | integer | Running count |
| distance_meters | integer | Computed from GPS points |
| status | enum | active, completed, abandoned |

**Indexes**: `profile_id`, `(profile_id, status)` for active session lookup

#### `gps_points`
| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| field_session_id | uuid (FK -> field_sessions) | |
| lat | double precision | |
| lng | double precision | |
| accuracy | double precision | Meters |
| recorded_at | timestamptz | |

**Indexes**: `field_session_id`, `recorded_at`
**Partitioning consideration**: Partition by month if volume warrants it.

#### `check_in_records`
| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| field_session_id | uuid (FK -> field_sessions) | |
| lead_id | uuid (FK -> leads) | |
| profile_id | uuid (FK -> profiles) | |
| type | enum | check_in, check_out |
| lat | double precision | |
| lng | double precision | |
| recorded_at | timestamptz | |

#### `commission_rules`
| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| name | text | |
| type | enum | flat, percentage |
| rate | numeric(12,4) | Dollar amount or percentage (0.10 = 10%) |
| conditions | jsonb | {min_deal_value, product_type, stage, etc.} |
| priority | integer | For rule ordering |
| is_active | boolean | |
| effective_from | date | |
| effective_until | date | Nullable |
| created_at | timestamptz | |
| updated_at | timestamptz | |

#### `commission_entries`
| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| profile_id | uuid (FK -> profiles) | |
| lead_id | uuid (FK -> leads) | |
| commission_rule_id | uuid (FK -> commission_rules) | |
| deal_value | numeric(12,2) | Snapshot at time of calculation |
| commission_amount | numeric(12,2) | |
| status | enum | pending, approved, paid, voided |
| voided_reason | text | |
| approved_by | uuid (FK -> profiles) | |
| approved_at | timestamptz | |
| created_at | timestamptz | |
| updated_at | timestamptz | |

**Indexes**: `profile_id`, `lead_id`, `status`, `created_at`

#### `payroll_previews`
| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| generated_by | uuid (FK -> profiles) | |
| period_start | date | |
| period_end | date | |
| data | jsonb | Full breakdown per rep |
| total_amount | numeric(12,2) | |
| created_at | timestamptz | |

#### `conversations`
| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| type | enum | direct, group, team |
| name | text | Nullable (for group/team) |
| team_id | uuid (FK -> teams) | Nullable (for team channels) |
| created_at | timestamptz | |
| updated_at | timestamptz | |

#### `conversation_participants`
| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| conversation_id | uuid (FK -> conversations) | |
| profile_id | uuid (FK -> profiles) | |
| last_read_at | timestamptz | For unread calculation |
| joined_at | timestamptz | |

#### `messages`
| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| conversation_id | uuid (FK -> conversations) | |
| sender_id | uuid (FK -> profiles) | |
| content | text | |
| attachment_url | text | Nullable |
| created_at | timestamptz | |

**Indexes**: `(conversation_id, created_at)` for chronological fetch

#### `qr_cards`
| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| profile_id | uuid (FK -> profiles) | |
| slug | text | Unique, URL-friendly |
| title | text | |
| company_name | text | |
| phone | text | |
| email | text | |
| booking_url | text | Calendly or internal link |
| photo_url | text | |
| is_active | boolean | |
| created_at | timestamptz | |
| updated_at | timestamptz | |

**Indexes**: `slug` (unique), `profile_id`

#### `qr_scans`
| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| qr_card_id | uuid (FK -> qr_cards) | |
| ip_address | inet | |
| user_agent | text | |
| referrer | text | |
| action | enum | page_view, booking_click, phone_click, email_click |
| lead_id | uuid (FK -> leads) | Nullable, if lead was created |
| scanned_at | timestamptz | |

#### `pipeline_stages`
Alias for `lead_statuses`. Same table, kept for semantic clarity in the codebase. The `lead_statuses` table is the single source of truth.

#### `company_settings`
| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | Single row |
| company_name | text | |
| logo_url | text | |
| address | text | |
| timezone | text | e.g., 'America/Montreal' |
| default_language | text | 'fr' or 'en' |
| currency | text | 'CAD' or 'USD' |
| date_format | text | 'DD/MM/YYYY' or 'MM/DD/YYYY' |
| tax_rate | numeric(5,4) | Default tax rate |
| field_session_ping_interval | integer | Seconds between GPS pings |
| heatmap_enabled | boolean | |
| settings_json | jsonb | Catch-all for additional settings |
| created_at | timestamptz | |
| updated_at | timestamptz | |

---

## 8. Key Backend Logic / Services

### 8.1 Lead Lifecycle Service

**Responsibilities**:
- Lead creation (validate, geocode address, assign to territory, set default status)
- Status transitions (validate allowed transitions, fire side effects)
- Side effects on stage change:
  - Log `stage_change` event in `lead_activity_events`
  - If entering "won" stage: trigger commission calculation, badge check, leaderboard update
  - If entering "lost" stage: void pending commissions, prompt for reason
  - Update materialized stats if real-time mode

**Deduplication**:
- On create: check for existing lead at same address (household match)
- If match found: prompt to merge or create as new household member

### 8.2 Pipeline Transition Engine

**Rules**:
- Any stage -> any stage is allowed by default (no hard-coded restrictions)
- Admin can configure disallowed transitions (e.g., cannot go from Closed Won back to New Lead)
- Each transition logs an event
- Automation triggers fire asynchronously:
  - Stage entry: run configured actions (e.g., send email, create task)
  - Stage exit: run configured actions

### 8.3 Commission Calculation Engine

**Trigger**: Lead moves to a "won" type stage

**Process**:
1. Fetch all active commission rules, ordered by priority
2. For each applicable rule:
   - Evaluate conditions (min deal value, product type, etc.)
   - Calculate amount (flat or percentage of deal value)
   - Create `commission_entry` with status "pending"
3. If lead moves out of "won" stage:
   - Void all pending commission entries for that lead
   - Log voided reason: "Status reverted from Closed Won"
   - Create audit trail entry

**Guard against manipulation**:
- Commission entries reference `deal_value` at time of calculation (snapshot)
- Changing deal value after close does not retroactively change commission
- Only Owner/Admin can approve commission entries
- Approved entries cannot be voided without Owner action

### 8.4 Leaderboard Aggregation Service

**Real-time path** (for current day):
- Query `lead_activity_events` filtered by date and event type
- Aggregate per rep
- Cache result in memory (or Supabase edge function cache) for 30s

**Historical path** (for week/month/all-time):
- Query `rep_stat_snapshots` and sum over date range
- Join with today's real-time data for the current incomplete day

**Cron job** (daily at midnight):
- Aggregate all events for the previous day per rep
- Insert row into `rep_stat_snapshots`
- No double-counting: each event has a unique ID and immutable timestamp

### 8.5 Challenge Evaluation Service

**Active challenge monitoring**:
- On each relevant activity event, check active challenges
- Update `challenge_participants.current_value`
- If `current_value >= target_value`:
  - Set `completed_at`
  - If first to complete, set challenge `winner_id`
  - Post feed celebration
  - Award associated badge (if any)

**Challenge lifecycle**:
- Upcoming -> Active (on start_at)
- Active -> Completed (on end_at or when winner determined)
- Cron checks for expired challenges every minute

### 8.6 Calendar Sync Service

**Google Calendar**:
1. OAuth2 authorization flow -> store tokens
2. Register webhook (push notifications) for calendar changes
3. On webhook: fetch changed events, upsert into `external_calendar_events`
4. On FieldPulse appointment CRUD: push to Google Calendar

**Outlook Calendar**:
1. OAuth2 via Microsoft Graph API
2. Register subscription for event changes
3. Same sync pattern as Google

**Calendly**:
1. Webhook registration via Calendly API
2. On webhook (invitee.created, invitee.canceled):
   - Create/update appointment in FieldPulse
   - Link to lead if email/phone match found
3. One-way sync only (Calendly -> FieldPulse)

**Token refresh**:
- Before any API call, check `token_expires_at`
- If expired, use refresh token to get new access token
- If refresh fails, mark connection as "needs_reauth" and notify user

### 8.7 Offline Conflict Resolution Service

**Strategy**: Last-Write-Wins (LWW) with server timestamp

**Process**:
1. Client comes online, sends mutation queue
2. For each mutation:
   - Compare client mutation timestamp with server record `updated_at`
   - If server record is newer: conflict detected
   - For non-critical fields (notes, custom_fields): server wins, client mutation discarded
   - For critical fields (status, deal_value, assigned_rep): flag for manual merge
3. Manual merge UI shows both versions, user picks or merges
4. Sync status updates: pending -> synced (or conflict)

### 8.8 Field Session Management

**Start session**:
1. Check for existing active session (prevent double-start)
2. Create `field_session` row with `status = 'active'`
3. Start GPS tracking (client-side interval)
4. Client sends GPS points every 30 seconds

**During session**:
- GPS points bulk-inserted (batched every 5 points or 2.5 minutes)
- Check-in/out events logged with GPS coordinates
- Door knock count incremented on lead creation or check-in

**End session**:
1. Set `ended_at` and `status = 'completed'`
2. Calculate total distance from GPS points
3. Final GPS point batch uploaded
4. Session summary displayed

### 8.9 QR Card Tracking

**On scan**:
1. Visitor hits `/card/[slug]` endpoint
2. Log `page_view` event in `qr_scans`
3. Track subsequent clicks (booking, phone, email) via client-side events
4. If visitor fills booking form: create lead with `source = 'qr_scan'` and link to `qr_scans` entry

---

## 9. Realtime + Offline Sync Architecture

### Supabase Realtime Subscriptions

| Channel | Payload | Subscribers |
|---|---|---|
| `gps_updates:{team_id}` | Rep position (lat, lng, rep_id) | Team leaders, Admins viewing map |
| `feed_posts` | New feed post | All users on Feed page |
| `leaderboard:{timeframe}` | Updated rankings | Users on Leaderboard page |
| `messages:{conversation_id}` | New message | Conversation participants |
| `challenge_progress:{challenge_id}` | Participant progress update | Challenge participants |
| `lead_updates:{lead_id}` | Lead field changes | Users viewing that lead |
| `session_status:{team_id}` | Session start/end events | Team leaders on Dashboard |

### Implementation Pattern

```
Client subscribes to Supabase Realtime channel
  -> Postgres triggers on INSERT/UPDATE
  -> Supabase broadcasts change to subscribed clients
  -> Client Zustand store updates
  -> React components re-render
```

### Offline Architecture

#### Storage Layer (IndexedDB via Dexie.js)

```
Databases:
  fieldpulse_cache
    Tables:
      leads          // Mirror of server leads (assigned territory)
      appointments   // Today + upcoming
      pipeline_stages // Config
      gps_queue      // Unsent GPS points
      mutation_queue // Pending write operations
      map_tiles      // Cached map tile blobs (optional)
      challenges     // Active challenges
      session_data   // Current field session state
```

#### Mutation Queue

Each offline write creates a queue entry:

```json
{
  "id": "uuid",
  "entity_type": "lead",
  "operation": "create|update|delete",
  "entity_id": "uuid",
  "payload": { ... },
  "created_at": "2026-03-27T10:00:00Z",
  "status": "pending|syncing|synced|conflict",
  "retry_count": 0
}
```

#### Sync Flow

```
1. Connection restored (navigator.onLine or successful fetch)
2. Service worker triggers sync event
3. Mutation queue processed in FIFO order
4. For each mutation:
   a. Send to Supabase
   b. If success: mark as "synced", update local cache with server response
   c. If 409 conflict: mark as "conflict", queue for manual resolution
   d. If network error: increment retry_count, retry with exponential backoff
5. After queue empty: pull latest data for assigned territory
6. Update sync status indicator
```

#### Service Worker Strategy

- **App shell**: Cache-first for all static assets (JS, CSS, images)
- **API calls**: Network-first with fallback to IndexedDB cache
- **Map tiles**: Cache-first with background revalidation for assigned territory tiles
- **GPS logging**: Background sync API for queued GPS points

#### Sync Status UI

| Icon | State | Description |
|---|---|---|
| Green circle | Synced | All data up to date |
| Yellow circle (pulsing) | Syncing | Mutations being processed |
| Orange circle | Pending | Offline mutations queued |
| Red circle | Conflict | Manual resolution needed (click to resolve) |

---

## 10. KPI and Leaderboard Calculation Model

### Metric Definitions

| Metric | Slug | Source | Type | Aggregation |
|---|---|---|---|---|
| Doors Knocked | `doors_knocked` | `lead_activity_events` where `event_type = 'door_knocked'` | Event | COUNT |
| Conversations | `conversations` | `lead_activity_events` where `event_type = 'conversation'` | Event | COUNT |
| Demos Set | `demos_set` | `lead_activity_events` where `event_type = 'demo_set'` | Event | COUNT |
| Demos Held | `demos_held` | `lead_activity_events` where `event_type = 'demo_held'` | Event | COUNT |
| Quotes Sent | `quotes_sent` | `lead_activity_events` where `event_type = 'quote_sent'` | Event | COUNT |
| Closes | `closes` | `lead_activity_events` where `event_type = 'close'` | Event | COUNT |
| Revenue | `revenue` | `lead_activity_events` where `event_type = 'close'`, `metadata->>'deal_value'` | Event | SUM |
| Conversion Rate | `conversion_rate` | `closes / doors_knocked` | Computed | DIVISION |
| Average Ticket | `average_ticket` | `revenue / closes` | Computed | DIVISION |
| Follow-ups Completed | `follow_ups_completed` | `lead_activity_events` where `event_type = 'follow_up'` | Event | COUNT |

### Event Sourcing Model

All KPI data flows from `lead_activity_events`. This table is append-only (immutable). Events are never updated or deleted.

**Event creation triggers**:
| Action | Event Type | Metadata |
|---|---|---|
| Rep knocks a door / creates lead from map | `door_knocked` | `{lead_id, lat, lng}` |
| Rep logs a conversation | `conversation` | `{lead_id, notes}` |
| Appointment created | `demo_set` | `{lead_id, appointment_id}` |
| Appointment marked completed | `demo_held` | `{lead_id, appointment_id}` |
| Quote sent | `quote_sent` | `{lead_id, quote_id, amount}` |
| Lead moved to Closed Won | `close` | `{lead_id, deal_value}` |
| Follow-up completed | `follow_up` | `{lead_id, type}` |
| Stage changed | `stage_change` | `{lead_id, from_stage, to_stage}` |

### Materialization Strategy

**Daily cron job** (runs at 00:05 local time):

```sql
INSERT INTO rep_stat_snapshots (profile_id, snapshot_date, doors_knocked, conversations,
  demos_set, demos_held, quotes_sent, closes, revenue, follow_ups_completed)
SELECT
  actor_id,
  (CURRENT_DATE - INTERVAL '1 day')::date,
  COUNT(*) FILTER (WHERE event_type = 'door_knocked'),
  COUNT(*) FILTER (WHERE event_type = 'conversation'),
  COUNT(*) FILTER (WHERE event_type = 'demo_set'),
  COUNT(*) FILTER (WHERE event_type = 'demo_held'),
  COUNT(*) FILTER (WHERE event_type = 'quote_sent'),
  COUNT(*) FILTER (WHERE event_type = 'close'),
  COALESCE(SUM((metadata->>'deal_value')::numeric) FILTER (WHERE event_type = 'close'), 0),
  COUNT(*) FILTER (WHERE event_type = 'follow_up')
FROM lead_activity_events
WHERE created_at >= (CURRENT_DATE - INTERVAL '1 day')
  AND created_at < CURRENT_DATE
GROUP BY actor_id;
```

### No Double-Counting Rules

1. Each event has a unique `id` -- deduplication guaranteed at insertion
2. The `close` event is only created when a lead transitions to a "won" stage
3. If a lead is moved back from "won" and then re-closed:
   - A new `close` event IS created (this is a real second close attempt)
   - But the `stage_change` metadata tracks `from_stage` so the reversal is auditable
   - Commission logic handles this separately (void + re-create)
4. Computed metrics (conversion_rate, average_ticket) are always derived at query time, never stored

### Query Patterns

**Today's leaderboard** (real-time):
```sql
SELECT actor_id, COUNT(*) as closes
FROM lead_activity_events
WHERE event_type = 'close'
  AND created_at >= CURRENT_DATE
GROUP BY actor_id
ORDER BY closes DESC;
```

**Weekly leaderboard** (hybrid: snapshots + today):
```sql
WITH historical AS (
  SELECT profile_id, SUM(closes) as closes, SUM(revenue) as revenue
  FROM rep_stat_snapshots
  WHERE snapshot_date >= date_trunc('week', CURRENT_DATE)
    AND snapshot_date < CURRENT_DATE
  GROUP BY profile_id
),
today AS (
  SELECT actor_id as profile_id,
    COUNT(*) FILTER (WHERE event_type = 'close') as closes,
    COALESCE(SUM((metadata->>'deal_value')::numeric) FILTER (WHERE event_type = 'close'), 0) as revenue
  FROM lead_activity_events
  WHERE created_at >= CURRENT_DATE
  GROUP BY actor_id
)
SELECT
  COALESCE(h.profile_id, t.profile_id) as profile_id,
  COALESCE(h.closes, 0) + COALESCE(t.closes, 0) as closes,
  COALESCE(h.revenue, 0) + COALESCE(t.revenue, 0) as revenue
FROM historical h
FULL OUTER JOIN today t ON h.profile_id = t.profile_id
ORDER BY closes DESC;
```

---

## 11. Gamification System Design

### 11.1 Badges

**Badge Framework**:

Each badge has a `trigger_config` JSON that defines when it is automatically awarded:

```json
{
  "type": "event_count",
  "event_type": "close",
  "threshold": 10,
  "period": null
}
```

```json
{
  "type": "event_count",
  "event_type": "close",
  "threshold": 1,
  "period": "week",
  "rank": 1
}
```

```json
{
  "type": "streak",
  "event_type": "close",
  "min_per_day": 1,
  "streak_days": 7
}
```

**Default Badge Catalog**:

| Badge | Category | Trigger |
|---|---|---|
| First Blood | Milestone | 1 close (all-time) |
| High Five | Milestone | 5 closes (all-time) |
| Double Digits | Milestone | 10 closes (all-time) |
| Quarter Century | Milestone | 25 closes (all-time) |
| Half Century | Milestone | 50 closes (all-time) |
| Century Club | Milestone | 100 closes (all-time) |
| Top Closer | Performance | #1 closes in a week |
| Quote Machine | Performance | 10 quotes sent in a week |
| Follow-up Finisher | Performance | Complete all scheduled follow-ups in a day |
| Conversation King/Queen | Performance | Most conversations in a day (min 20) |
| Door Warrior | Performance | 50+ doors knocked in a single day |
| Hot Streak (3) | Streak | Close at least 1 deal for 3 consecutive days |
| On Fire (7) | Streak | Close at least 1 deal for 7 consecutive days |
| Unstoppable (30) | Streak | Close at least 1 deal for 30 consecutive days |

**Badge evaluation flow**:
1. Activity event created
2. Async function checks all badge `trigger_configs` against rep's data
3. If condition met and badge not already earned:
   - Insert into `rep_badges`
   - Create feed post (type: `badge_earned`)
   - Send push notification (if enabled)

### 11.2 Achievements

Achievements are higher-tier unlocks, separate from badges. They represent career milestones.

| Achievement | Trigger |
|---|---|
| Revenue King | $100,000 total revenue |
| Iron Rep | 30 consecutive days with field sessions |
| Closer Elite | 50 closes in a single month |
| Territory Master | Close at least 1 deal in every assigned territory |
| Perfect Week | Close every day Mon-Fri in a week |

Achievements display in a "Trophy Case" section on the profile page.

### 11.3 Challenges

**Configuration** (by Admin/Owner):

| Field | Description |
|---|---|
| Title | Challenge name |
| Description | What to do |
| Metric | Which KPI (slug) |
| Target | Value to reach |
| Type | Daily / Weekly / Custom |
| Start/End | Time boundaries |
| Eligible | All reps, specific team, specific reps |

**Challenge lifecycle**:
```
Created (upcoming) -> Active (start_at reached) -> Completed (winner or end_at)
```

**Real-time progress**:
- Each relevant event updates `challenge_participants.current_value` via trigger or application logic
- Supabase Realtime broadcasts progress updates
- Challenge card UI shows live progress bars

### 11.4 Battles

**Types**:
- **Rep vs Rep**: One rep challenges another. Must be accepted.
- **Team vs Team**: Admin creates. Both teams auto-enrolled.

**Flow**:
1. Challenger picks: opponent, metric, duration
2. Opponent receives notification and accepts/declines
3. Battle goes active
4. Both sides' events are counted toward the battle metric
5. At `end_at`: winner determined by higher score
6. Feed post announces result
7. Winner receives battle badge (if configured)

### 11.5 Social Feed

**Post Types**:

| Type | Trigger | Content Template |
|---|---|---|
| `auto_celebration` | Rep closes a deal | "{rep_name} just closed a deal! {deal_value}" |
| `badge_earned` | Badge awarded | "{rep_name} earned the {badge_name} badge!" |
| `challenge_won` | Challenge completed | "{rep_name} won the {challenge_title} challenge!" |
| `battle_result` | Battle ended | "{winner} defeated {loser} in {metric}! ({score} vs {score})" |
| `milestone` | Achievement unlocked | "{rep_name} unlocked {achievement_name}!" |
| `manual` | User posts | Free-form text |

**Interactions**:
- Reactions: fire, thumbsup, clap, heart (one per type per user per post)
- Comments: threaded comments on any post
- Real-time updates via Supabase Realtime

**Feed algorithm**: Reverse chronological (no ML ranking in V1).

---

## 12. Commission and Payroll Preview Logic

### Commission Rules Engine

**Rule schema**:
```json
{
  "name": "Standard Commission",
  "type": "percentage",
  "rate": 0.10,
  "conditions": {
    "min_deal_value": 500,
    "stages": ["closed_won"],
    "product_types": null
  },
  "priority": 1,
  "is_active": true,
  "effective_from": "2026-01-01",
  "effective_until": null
}
```

**Rule types**:
| Type | Description | Example |
|---|---|---|
| `flat` | Fixed dollar amount per close | $50 per close |
| `percentage` | Percentage of deal value | 10% of deal value |

**Rule stacking**: Multiple rules can apply. Priority determines evaluation order. All matching rules generate separate commission entries.

### Commission Entry Lifecycle

```
Lead moves to Closed Won
  -> Commission Calculation Engine runs
  -> For each matching rule: create commission_entry (status: pending)
  -> Entry appears in rep's commission ledger

Admin reviews and approves
  -> Status: pending -> approved
  -> approved_by and approved_at set

Payroll processed externally
  -> Admin marks as paid
  -> Status: approved -> paid

If lead status reverts from Closed Won:
  -> All pending entries for that lead: status -> voided
  -> voided_reason: "Lead status changed from Closed Won to {new_status}"
  -> Already approved entries: require Owner to void manually (safeguard)
```

### Payroll Preview Generation

**Input**: Date range, optional rep filter

**Output**:
```json
{
  "period": { "start": "2026-03-01", "end": "2026-03-15" },
  "reps": [
    {
      "profile_id": "uuid",
      "name": "Alex Tremblay",
      "total_closes": 8,
      "total_revenue": 12500.00,
      "commission_entries": [
        { "lead": "...", "amount": 125.00, "status": "approved" }
      ],
      "total_commission": 1250.00,
      "pending_count": 2,
      "approved_count": 6
    }
  ],
  "grand_total": 5400.00
}
```

### Manipulation Guards

1. **Deal value snapshot**: Commission calculated on deal value at time of close, not current value
2. **Audit trail**: Every status change on commission entries is logged with actor and timestamp
3. **Approval required**: Pending entries do not count as "earned" until approved
4. **Void protection**: Approved entries require Owner-level action to void
5. **Rule versioning**: Rule changes have `effective_from` dates; existing entries are not retroactively recalculated
6. **Recalculation safeguard**: If a close event is somehow duplicated, the system checks for existing commission entries for that lead before creating new ones

---

## 13. Calendar Integration Architecture

### OAuth2 Flows

#### Google Calendar

```
1. User clicks "Connect Google Calendar" in Settings
2. Redirect to Google OAuth2 consent screen
   - Scopes: calendar.readonly, calendar.events
3. Google redirects back to /api/auth/callback/google
4. Exchange auth code for access_token + refresh_token
5. Store tokens in calendar_connections (encrypted at rest)
6. Fetch list of calendars -> user selects which to sync
7. Register push notification channel (webhook) for selected calendar
8. Initial sync: fetch all events for next 30 days
9. Ongoing: webhook notifications trigger incremental sync
```

#### Outlook Calendar

```
1. User clicks "Connect Outlook Calendar"
2. Redirect to Microsoft OAuth2 (Azure AD)
   - Scopes: Calendars.ReadWrite
3. Microsoft redirects to /api/auth/callback/outlook
4. Exchange code for tokens via MSAL
5. Store in calendar_connections
6. Create subscription via Microsoft Graph API
7. Webhook endpoint: /api/webhooks/calendar/outlook
8. Same sync pattern as Google
```

#### Calendly

```
1. User enters Calendly API key or connects via OAuth
2. FieldPulse registers webhook for invitee events
3. Webhook endpoint: /api/webhooks/calendar/calendly
4. On invitee.created:
   - Create appointment in FieldPulse
   - Match invitee email/phone to existing lead
   - If match: link appointment to lead, log demo_set event
   - If no match: create new lead from invitee data
5. On invitee.canceled:
   - Update appointment status to cancelled
```

### Token Refresh Handling

```
Before any calendar API call:
  1. Check calendar_connections.token_expires_at
  2. If expired (or within 5-minute buffer):
     a. Use refresh_token to request new access_token
     b. Update calendar_connections with new tokens
     c. If refresh fails (revoked/expired):
        - Set sync_enabled = false
        - Notify user: "Calendar connection needs reauthorization"
        - Show warning banner on Calendar page
  3. Proceed with API call using valid token
```

### Bi-Directional Sync

**FieldPulse -> External**:
- On appointment create/update/delete in FieldPulse:
  - Push event to connected external calendar
  - Store returned external event ID in `appointments.external_event_id`

**External -> FieldPulse**:
- On webhook notification:
  - Fetch changed events from provider
  - Upsert into `external_calendar_events`
  - If event matches a FieldPulse appointment (by external_event_id): update local appointment
  - External-only events shown as "busy" blocks (not full appointments)

### Conflict Detection

When creating an appointment:
1. Check FieldPulse appointments for time overlap
2. Check `external_calendar_events` for time overlap
3. If conflict found: show warning with conflicting event details
4. Allow override (user can book anyway)

---

## 14. Communication and QR Card System

### 14.1 Internal Chat

#### Conversation Model

| Type | Description | Creation |
|---|---|---|
| `direct` | 1:1 between two users | Auto-created on first message |
| `group` | Named group of users | Created by Team Leader+ |
| `team` | Team-wide channel | Auto-created with team, or by Admin |

#### Message Features

- Text messages with basic formatting (bold, italic, links)
- Emoji reactions
- File attachments (images, documents via Supabase Storage)
- Read receipts: `conversation_participants.last_read_at` compared to latest message timestamp
- Unread count: badge on sidebar "Messages" nav item

#### Real-Time Delivery

```
Sender posts message
  -> INSERT into messages table
  -> Supabase Realtime broadcasts to channel `messages:{conversation_id}`
  -> All participants' clients receive and render message
  -> Recipient's unread count updates
```

#### Typing Indicators

- Supabase Realtime presence channel per conversation
- Client broadcasts typing state on keypress (debounced)
- Clears after 3 seconds of inactivity

### 14.2 SMS Architecture

**Provider**: Twilio (or compatible API)

**Outbound**:
1. Rep opens lead detail, clicks "Send SMS"
2. Composes message (or selects template)
3. API call to Twilio to send SMS
4. Log `sms_sent` event on lead timeline
5. Store message in conversation (lead's SMS conversation)

**Inbound**:
1. Twilio webhook hits `/api/webhooks/sms`
2. Match sender phone number to lead
3. Route to assigned rep's SMS conversation
4. Log on lead timeline
5. Notify rep via Realtime

### 14.3 Email Logging

**Option A: BCC capture**
- Each company gets a unique inbound email address (e.g., `log-{hash}@fieldpulse.app`)
- Reps BCC this address on emails to leads
- Inbound email webhook parses sender/recipient, matches to lead, logs on timeline

**Option B: Direct send**
- Send email from platform via SendGrid/Postmark
- Email automatically logged on lead timeline
- Template support for common emails

### 14.4 Digital Business Card / QR System

#### Card Creation

1. Rep navigates to Profile or Admin creates from Settings > Business Card
2. Card fields: Name, Title, Company, Phone, Email, Photo, Booking URL
3. Auto-generated slug: `fieldpulse.app/card/alex-tremblay`
4. QR code generated (client-side or server-side, encoding the card URL)
5. QR code downloadable as PNG for printing

#### Card Page (Public)

- Responsive landing page (mobile-optimized)
- Rep photo, name, title, company
- Click-to-call phone button
- Click-to-email button
- "Book a Meeting" CTA button (links to Calendly or internal booking)
- Company branding (logo, colors)

#### Tracking

| Event | Tracked Data |
|---|---|
| Page View | Timestamp, IP, user agent, referrer |
| Phone Click | Timestamp |
| Email Click | Timestamp |
| Booking Click | Timestamp |
| QR Scan (physical) | Same as page view, but referrer indicates QR source |

#### Lead Creation from Scan

- If the visitor clicks "Book a Meeting" and fills a form:
  - New lead created with `source = 'qr_scan'`
  - Lead assigned to the card's rep
  - `qr_scans` entry linked to the new lead

---

## 15. Design System / UI Guidelines

### Theme

**Dark theme** as the primary and default theme. Premium SaaS aesthetic inspired by Linear, Vercel, and Raycast.

### Color Palette

#### Base Colors
| Token | Value | Usage |
|---|---|---|
| `--background` | `#0A0A0B` | Page background |
| `--surface` | `#111113` | Card/panel background |
| `--surface-elevated` | `#1A1A1D` | Modals, dropdowns, popovers |
| `--border` | `#27272A` | Default borders |
| `--border-subtle` | `#1E1E21` | Subtle dividers |
| `--text-primary` | `#FAFAFA` | Primary text |
| `--text-secondary` | `#A1A1AA` | Secondary/muted text |
| `--text-tertiary` | `#71717A` | Placeholder, disabled |

#### Status Colors (Pipeline Stages)
| Status | Color | Hex | Usage |
|---|---|---|---|
| New Lead | Blue | `#3B82F6` | Pins, badges, stage column |
| Must Recall | Amber | `#F59E0B` | Pins, badges, stage column |
| Quote Sent | Purple | `#8B5CF6` | Pins, badges, stage column |
| Closed Won | Green | `#10B981` | Pins, badges, stage column, celebration |
| Closed Lost | Red | `#EF4444` | Pins, badges, stage column |

#### Accent Colors
| Token | Value | Usage |
|---|---|---|
| `--accent-primary` | `#3B82F6` | Primary buttons, links, focus rings |
| `--accent-success` | `#10B981` | Success states, positive trends |
| `--accent-warning` | `#F59E0B` | Warnings, attention needed |
| `--accent-danger` | `#EF4444` | Destructive actions, errors |

### Typography Hierarchy

| Level | Size | Weight | Font |
|---|---|---|---|
| H1 (Page title) | 28px / 1.75rem | 700 (Bold) | Inter |
| H2 (Section title) | 22px / 1.375rem | 600 (Semibold) | Inter |
| H3 (Card title) | 18px / 1.125rem | 600 (Semibold) | Inter |
| H4 (Subsection) | 16px / 1rem | 600 (Semibold) | Inter |
| Body | 14px / 0.875rem | 400 (Regular) | Inter |
| Body Small | 13px / 0.8125rem | 400 (Regular) | Inter |
| Caption | 12px / 0.75rem | 500 (Medium) | Inter |
| Stat Value (Large) | 36px / 2.25rem | 700 (Bold) | Inter |
| Stat Value (Medium) | 24px / 1.5rem | 700 (Bold) | Inter |
| Monospace | 13px / 0.8125rem | 400 | JetBrains Mono |

### Component Patterns

#### Stat Card
```
+-----------------------------------+
|  Closes Today          ↑ 12%     |
|  ████████████████████████████████ |
|  24                               |
|  vs 18 yesterday                  |
+-----------------------------------+
```
- Top: label + trend indicator
- Center: large bold value
- Bottom: comparison text (muted)
- Optional: sparkline mini-chart

#### Filter Bar
- Horizontal bar above data tables/boards
- Pill-style filters: Date Range, Status, Rep, Team, Territory
- "Clear all" action
- Sticky on scroll

#### Drawer Pattern
- Right-side slide-in panel (480px width)
- Used for: lead detail quick view, appointment edit, message compose
- Backdrop overlay with click-to-close
- Header with title and close button

#### Modal Pattern
- Centered overlay
- Used for: confirmations, settings forms, creation wizards
- Max width 560px for forms, 800px for complex content
- Focus trap for accessibility

#### Table Pattern
- Alternating row backgrounds (subtle)
- Sticky header
- Sortable columns (click header)
- Row hover highlight
- Checkbox column for bulk select
- Action column (right) with dropdown menu

### shadcn/ui Customization

- Override shadcn/ui default theme variables to match dark palette
- Custom variants for:
  - `Button`: `default`, `destructive`, `outline`, `ghost`, `link`, `success`
  - `Badge`: color variants matching pipeline stages
  - `Card`: `default` (surface), `elevated` (surface-elevated)
- Custom component: `StatCard` (not in shadcn, built from primitives)

### Responsive Breakpoints

| Breakpoint | Width | Layout |
|---|---|---|
| `sm` | 640px | Mobile field view |
| `md` | 768px | Tablet |
| `lg` | 1024px | Desktop (sidebar collapses to icons) |
| `xl` | 1280px | Desktop (full sidebar) |
| `2xl` | 1536px | Large desktop (max content width) |

**Mobile-first adaptations**:
- Sidebar becomes bottom navigation on mobile
- Tables become card lists on mobile
- Map takes full viewport on mobile during field session
- Pipeline board scrolls horizontally on mobile

---

## 16. Suggested Next.js App Router Folder Structure

Based on the folder structure already created in this project:

```
src/
├── app/
│   ├── [locale]/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── forgot-password/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── map/
│   │   │   │   └── page.tsx
│   │   │   ├── leads/
│   │   │   │   ├── [id]/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── pipeline/
│   │   │   │   └── page.tsx
│   │   │   ├── calendar/
│   │   │   │   └── page.tsx
│   │   │   ├── leaderboard/
│   │   │   │   └── page.tsx
│   │   │   ├── teams/
│   │   │   │   ├── [id]/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── feed/
│   │   │   │   └── page.tsx
│   │   │   ├── commissions/
│   │   │   │   └── page.tsx
│   │   │   ├── messages/
│   │   │   │   └── page.tsx
│   │   │   ├── reports/
│   │   │   │   └── page.tsx
│   │   │   ├── profile/
│   │   │   │   └── page.tsx
│   │   │   ├── settings/
│   │   │   │   ├── general/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── pipeline/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── commissions/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── calendar/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── badges/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── challenges/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── roles/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── business-card/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── localization/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── api/
│       ├── auth/
│       │   └── callback/
│       │       └── route.ts
│       ├── webhooks/
│       │   └── calendar/
│       │       └── route.ts
│       └── cron/
│           └── route.ts
├── components/
│   ├── ui/                    # shadcn/ui primitives
│   ├── shared/                # Shared components (StatCard, FilterBar, etc.)
│   ├── layout/                # AppSidebar, TopBar, MobileNav
│   ├── dashboard/             # DashboardKPICards, ActivityFeed, AgendaWidget
│   ├── map/                   # MapView, TerritoryDrawer, PinPopover, HeatmapToggle
│   ├── leads/                 # LeadTable, LeadCard, LeadForm, LeadTimeline
│   ├── pipeline/              # PipelineBoard, StageColumn, PipelineCard
│   ├── calendar/              # CalendarView, AppointmentForm, SyncStatus
│   ├── leaderboard/           # RankingTable, PodiumDisplay, KPIDrillDown
│   ├── gamification/          # BadgeGrid, ChallengeCard, BattleCard
│   ├── teams/                 # TeamCard, MemberList, TeamPerformance
│   ├── feed/                  # FeedPost, FeedComposer, ReactionBar
│   ├── commissions/           # CommissionTable, PayrollPreview, RuleEditor
│   ├── messages/              # ConversationList, ChatWindow, MessageBubble
│   └── reports/               # ReportChart, MetricTable, FunnelChart
├── lib/
│   ├── supabase/              # Supabase client (browser + server)
│   ├── constants/             # App constants, enums
│   ├── utils/                 # Utility functions
│   └── stores/                # Zustand stores
├── types/                     # TypeScript type definitions
└── messages/                  # i18n message files (en.json, fr.json)
```

---

## 17. Suggested Supabase Schema / SQL Outline

The full migration SQL should be placed at:

```
supabase/migrations/001_initial_schema.sql
```

**Migration file should include**:

1. **Extensions**:
   - `uuid-ossp` for UUID generation
   - `postgis` for spatial queries (territories, GPS)

2. **Enum types**:
   - `user_role` (owner, admin, team_leader, sales_rep)
   - `user_status` (active, inactive, invited)
   - `lead_stage_type` (open, won, lost)
   - `appointment_type` (demo, follow_up, consultation, other)
   - `appointment_status` (scheduled, completed, cancelled, no_show)
   - `commission_type` (flat, percentage)
   - `commission_status` (pending, approved, paid, voided)
   - `conversation_type` (direct, group, team)
   - `session_status` (active, completed, abandoned)
   - `battle_type` (rep_vs_rep, team_vs_team)
   - `battle_status` (pending, accepted, active, completed, declined)
   - `badge_category` (milestone, performance, streak, custom)
   - `calendar_provider` (google, outlook, calendly)
   - `quote_status` (draft, sent, accepted, declined, expired)
   - `contract_status` (draft, sent, signed, void)
   - `challenge_type` (daily, weekly, custom)
   - `challenge_status` (upcoming, active, completed)
   - `assignee_type` (team, profile)

3. **All tables** as defined in Section 7

4. **Row-Level Security (RLS) policies** for every table:
   - Enable RLS on all tables
   - Owner/Admin: full read/write
   - Team Leader: read/write on team-scoped data
   - Sales Rep: read/write on own data only
   - Public tables (qr_cards for card pages): read for anon role

5. **Indexes** as noted in Section 7

6. **Triggers**:
   - `updated_at` auto-update trigger on all tables with `updated_at` column
   - Event logging trigger on lead status change

7. **Functions**:
   - `calculate_commission(lead_id uuid)` -- calculate and create commission entries
   - `aggregate_daily_stats()` -- materialization cron function
   - `check_badges(profile_id uuid)` -- evaluate badge triggers for a rep

8. **Seed data**:
   - Default pipeline stages (New Lead, Must Recall, Quote Sent, Closed Won, Closed Lost)
   - Default badge catalog
   - Default leaderboard metric definitions
   - Company settings row

---

## 18. Component Breakdown

### Shared Components

| Component | Description |
|---|---|
| `StatCard` | Reusable KPI display card with value, label, trend, comparison |
| `FilterBar` | Horizontal filter strip with date range, status, rep, team pills |
| `DataTable` | Generic sortable, filterable, paginated table with bulk select |
| `EmptyState` | Illustration + message + CTA for empty data states |
| `LoadingSkeleton` | Shimmer loading placeholders matching component shapes |
| `ConfirmDialog` | Confirmation modal for destructive actions |
| `SyncStatusIndicator` | Green/yellow/orange/red dot showing offline sync state |
| `UserAvatar` | Avatar component with fallback initials and online indicator |
| `RoleBadge` | Colored badge showing user role |
| `StatusBadge` | Pipeline stage badge with correct color |
| `TimeAgo` | Relative time display (e.g., "3 min ago") |
| `SearchInput` | Debounced search input with clear button |

### Layout Components

| Component | Description |
|---|---|
| `AppSidebar` | Main navigation sidebar with icon + label items, collapsible |
| `TopBar` | Header bar with breadcrumbs, search, notifications, user menu |
| `MobileBottomNav` | Bottom tab navigation for mobile viewports |
| `PageHeader` | Page title + description + action buttons pattern |
| `DrawerPanel` | Right-slide drawer for detail views |

### Dashboard Components

| Component | Description |
|---|---|
| `DashboardKPIGrid` | Grid of StatCards for role-appropriate KPIs |
| `TodayAgenda` | List of today's appointments with lead links |
| `RecentActivityFeed` | Last 10 activity events with icons and timestamps |
| `QuickActions` | Button group for common actions (start session, add lead, etc.) |
| `LeaderboardPreview` | Compact top-5 ranking widget |
| `ActiveSessionsWidget` | Shows reps currently in field with duration |
| `ChallengePreview` | Active challenge progress cards |

### Map Components

| Component | Description |
|---|---|
| `MapView` | Main map wrapper (Mapbox/Google Maps) with controls |
| `LeadPin` | Custom map marker with status color and hover popover |
| `PinCluster` | Clustered pin display at low zoom levels |
| `TerritoryPolygon` | Rendered territory boundary with fill color |
| `TerritoryDrawingTools` | Polygon draw/edit toolbar |
| `TerritoryAssignmentPanel` | Side panel for assigning reps/teams to territories |
| `HeatmapLayer` | Density overlay toggle and rendering |
| `FieldSessionOverlay` | Session stats bar (doors, time, distance) during active session |
| `QuickLeadForm` | Minimal lead capture form for map pin creation |
| `GPSTracker` | Background GPS tracking service component |

### Lead Components

| Component | Description |
|---|---|
| `LeadTable` | Full-featured data table for leads |
| `LeadBoardView` | Card-based board grouped by status |
| `LeadMapView` | Embedded map view filtered to current lead set |
| `LeadCard` | Compact lead card for board/list views |
| `LeadDetailHeader` | Lead name, status, assignment, deal value |
| `LeadTimeline` | Chronological activity log with event icons |
| `LeadForm` | Create/edit form with all lead fields |
| `LeadBulkActionBar` | Contextual action bar when leads are selected |
| `HouseholdBanner` | Banner showing other leads at the same address |
| `LeadImportWizard` | CSV upload, column mapping, preview, import |

### Pipeline Components

| Component | Description |
|---|---|
| `PipelineBoard` | Kanban board with drag-drop between columns |
| `StageColumn` | Single pipeline stage column with count and value header |
| `PipelineCard` | Draggable lead card within pipeline |
| `StageConfigEditor` | Settings form for adding/editing pipeline stages |
| `LostReasonModal` | Modal prompt when moving to Closed Lost |

### Calendar Components

| Component | Description |
|---|---|
| `CalendarMonthView` | Monthly grid with appointment indicators |
| `CalendarWeekView` | Weekly time-slot grid with appointment blocks |
| `CalendarDayView` | Single day hourly timeline |
| `AppointmentBlock` | Rendered appointment on calendar (color by type) |
| `AppointmentForm` | Create/edit appointment form with lead linking |
| `ExternalEventBlock` | Greyed-out block for synced external events |
| `CalendarSyncManager` | Connection status and re-auth UI for integrations |
| `ConflictWarning` | Alert when appointment overlaps existing event |

### Leaderboard Components

| Component | Description |
|---|---|
| `PodiumDisplay` | Top-3 reps with avatars and scores, styled prominently |
| `RankingTable` | Full ranking list with position, name, closes (bold), revenue |
| `TrendArrow` | Green up / red down / grey neutral indicator |
| `TimeframeToggle` | Day / Week / Month / All-Time selector |
| `ScopeToggle` | Individual / Team toggle |
| `KPIDrillDown` | Full metric breakdown panel for a single rep |
| `ComparisonView` | Side-by-side KPI comparison of two reps |
| `SparklineChart` | Mini trend chart (7-day or 30-day) |

### Gamification Components

| Component | Description |
|---|---|
| `BadgeGrid` | Grid display of all badges (earned = full color, unearned = greyed) |
| `BadgeCard` | Single badge with icon, name, description, earned date |
| `AchievementTrophyCase` | Profile section showing unlocked achievements |
| `ChallengeCard` | Active challenge with progress bar, participants, countdown |
| `ChallengeForm` | Admin form for creating/editing challenges |
| `BattleCard` | Battle progress display with both sides' scores |
| `BattleCreateForm` | Form for challenging another rep or creating team battle |

### Feed Components

| Component | Description |
|---|---|
| `FeedList` | Scrollable list of feed posts (infinite scroll) |
| `FeedPost` | Single post with author, content, timestamp, reactions, comments |
| `FeedComposer` | Text input for manual posts |
| `ReactionBar` | Row of reaction emoji buttons with counts |
| `CommentThread` | Expandable comment list under a post |
| `CelebrationBanner` | Animated banner for auto-celebrations (confetti optional) |

### Commission Components

| Component | Description |
|---|---|
| `CommissionLedger` | Data table of commission entries |
| `CommissionSummaryCards` | Total earned, pending, approved, paid stat cards |
| `PayrollPreviewTable` | Per-rep payout summary for a date range |
| `CommissionRuleEditor` | CRUD form for commission rules |
| `ApprovalBulkAction` | Bulk approve/reject UI for pending entries |

### Message Components

| Component | Description |
|---|---|
| `ConversationList` | Sidebar list of conversations with unread indicators |
| `ChatWindow` | Main chat area with messages and input |
| `MessageBubble` | Single message with sender, content, timestamp |
| `TypingIndicator` | "User is typing..." animation |
| `MessageInput` | Text input with attachment button and send |
| `ReadReceipt` | Checkmark indicators for message read status |

### Report Components

| Component | Description |
|---|---|
| `ReportSelector` | Card grid for choosing which report to view |
| `MetricTable` | Tabular metric display with sorting |
| `BarChart` | Bar chart component (via Recharts or similar) |
| `LineChart` | Line/trend chart component |
| `FunnelChart` | Conversion funnel visualization |
| `ReportFilterBar` | Date range, rep, team filters specific to reports |
| `ExportButton` | CSV/PDF export trigger |

---

## 19. Edge Cases and Failure Handling

### 19.1 Offline Conflicts

| Scenario | Resolution |
|---|---|
| Two reps edit the same lead offline | Last-write-wins for non-critical fields. Manual merge prompt for `status`, `deal_value`, `assigned_rep_id` showing both versions. |
| Rep creates lead at an address that was already claimed by another rep online | On sync: detect duplicate via address hash. Present merge UI: keep both, merge into one, or discard. |
| Rep moves lead to Closed Won offline, but another rep already closed it online | On sync: conflict detected on status field. Show conflict resolution UI. Commission is only created for the first successful close. |
| Long offline period (hours) with many mutations | Queue processes in order. If server state has diverged significantly, fall back to full re-sync for affected entities. |

### 19.2 Calendar Sync Failures

| Scenario | Handling |
|---|---|
| OAuth token expired and refresh fails | Mark connection as `needs_reauth`. Show warning banner on Calendar page and Settings. Do not delete events -- just pause sync. |
| Webhook delivery failure (Google/Outlook) | Implement periodic polling fallback (every 15 minutes) when webhook has not delivered for > 30 minutes. |
| Calendly webhook payload malformed | Log error, skip event, alert admin. Retry on next webhook. |
| Duplicate events from calendar provider | Deduplicate via `external_id` unique constraint. Upsert pattern prevents duplicates. |
| Rate limiting from calendar API | Exponential backoff with max 5 retries. Queue subsequent sync operations. |

### 19.3 Commission Recalculation

| Scenario | Handling |
|---|---|
| Lead deal value changed after commission calculated | Commission amount is snapshotted. No automatic recalculation. Admin can manually void and re-trigger. |
| Lead moved back from Closed Won to Must Recall | All `pending` commission entries for that lead are auto-voided. `approved` entries require Owner action. |
| Commission rule changed mid-period | Rule has `effective_from` date. Existing entries calculated under old rule are not affected. New closes use new rule. |
| Same lead closed twice (status oscillation) | Second close generates new commission entries. System does check for existing non-voided entries but allows new ones if previous were voided. Audit trail makes this visible. |

### 19.4 Duplicate Lead Prevention

| Scenario | Handling |
|---|---|
| Same address entered twice | Address normalization + hash. On match, prompt: "A lead already exists at this address. View existing lead or create new?" |
| Same phone/email across leads | Soft duplicate warning (non-blocking). Badge shown on leads with matching phone/email. Merge tool available. |
| CSV import with duplicates | Pre-import dedup check. Show duplicate count and list. Allow skip/merge/create for each. |

### 19.5 GPS Permission Denied

| Scenario | Handling |
|---|---|
| Browser blocks GPS on session start | Show instructional modal explaining how to enable location access. Cannot start field session without GPS. |
| GPS permission revoked mid-session | Detect via error callback. Show persistent warning. Continue session but mark GPS points as "no_location". Session stats show "GPS unavailable" warning. |
| GPS accuracy is very poor (>100m) | Accept points but flag as low-accuracy. Map shows larger uncertainty radius around pin. |

### 19.6 Session Timeout and Management

| Scenario | Handling |
|---|---|
| Rep forgets to end field session | Auto-end session after 2 hours of no GPS movement (configurable). Mark as "abandoned". |
| Browser crashes during session | On next app load, detect active session via IndexedDB. Prompt: "You have an active session. Resume or end?" |
| Multiple tabs with same session | Detect via BroadcastChannel API. Only one tab tracks GPS. Others show "Session active in another tab." |

### 19.7 Concurrent Pipeline Moves

| Scenario | Handling |
|---|---|
| Two users drag same lead to different stages simultaneously | Optimistic UI update on both clients. Server processes first write. Second write gets a conflict response. Losing client reverts their optimistic update and shows the actual state. |
| Drag-drop while offline | Queued mutation. On sync, if lead state has changed, show conflict resolution. |

### 19.8 Quota and Performance Limits

| Scenario | Handling |
|---|---|
| GPS points table grows very large | Partition by month. Archive points older than 90 days to cold storage. Keep daily summaries. |
| Feed grows to thousands of posts | Paginate with cursor-based pagination. Archive posts older than 6 months. |
| Realtime subscriptions overwhelm client | Debounce Realtime updates. Batch leaderboard updates (max 1 per 5 seconds). |
| Large CSV import (10K+ leads) | Process in background job with progress indicator. Chunked inserts (100 at a time). |
| Map with thousands of pins | Cluster pins at low zoom. Only load pins for visible viewport (spatial query). Progressive loading on pan/zoom. |

---

## 20. Phased Build Plan

### Phase 1: Foundation (Weeks 1-3)

**Goal**: Core platform with auth, navigation, leads, and pipeline.

| Task | Priority | Estimate |
|---|---|---|
| Supabase project setup + initial migration | P0 | 1 day |
| Auth (login, logout, forgot password, session management) | P0 | 2 days |
| RBAC (role column, RLS policies for all tables, middleware guard) | P0 | 2 days |
| App layout (sidebar, top bar, mobile nav, dark theme) | P0 | 2 days |
| i18n setup (next-intl, EN + FR message files, locale routing) | P0 | 1 day |
| Dashboard skeleton (role-specific KPI cards, quick actions) | P1 | 2 days |
| Leads CRUD (table view, create/edit form, detail page with timeline) | P0 | 4 days |
| Pipeline board (Kanban, drag-drop, stage transitions, config page) | P0 | 3 days |
| Settings pages (general, pipeline config) | P1 | 1 day |
| Design system foundations (StatCard, FilterBar, DataTable, StatusBadge) | P0 | 2 days |

**Deliverable**: Users can log in, see a dashboard, create/manage leads, and drag them through a pipeline.

### Phase 2: Map and Field Operations (Weeks 4-6)

**Goal**: Interactive map with territories, GPS tracking, and calendar.

| Task | Priority | Estimate |
|---|---|---|
| Map integration (Mapbox/Google Maps, base layer, controls) | P0 | 2 days |
| Lead pins on map (status colors, click popover, clustering) | P0 | 2 days |
| Territory drawing (polygon tools, CRUD, PostGIS setup) | P0 | 3 days |
| Territory assignment (assign to rep/team, color-coding) | P0 | 1 day |
| Field sessions (start/end, GPS tracking, check-in/out) | P0 | 3 days |
| Heatmap foundation (density overlay from door knock data) | P1 | 1 day |
| Quick lead capture from map | P0 | 1 day |
| Calendar views (month, week, day) | P0 | 3 days |
| Appointment CRUD (link to leads, types, status) | P0 | 2 days |
| Google Calendar OAuth2 sync | P1 | 2 days |
| Outlook Calendar OAuth2 sync | P1 | 2 days |
| Calendly webhook ingestion | P2 | 1 day |
| Settings: calendar connections | P1 | 1 day |

**Deliverable**: Reps can start field sessions, see territories, knock doors via map, and manage appointments with external calendar sync.

### Phase 3: Leaderboard and Gamification (Weeks 7-8)

**Goal**: Performance visibility, badges, challenges, and social feed.

| Task | Priority | Estimate |
|---|---|---|
| Leaderboard page (podium, ranking table, timeframe/scope toggles) | P0 | 2 days |
| KPI drill-down panel | P0 | 1 day |
| Rep stat snapshots (daily cron, materialization query) | P0 | 1 day |
| Badge system (schema, default catalog, evaluation engine) | P0 | 2 days |
| Achievement system | P1 | 1 day |
| Challenges (CRUD, progress tracking, winner determination) | P0 | 2 days |
| Battles (1v1, team vs team, accept/decline, scoring) | P1 | 2 days |
| Social feed (posts, reactions, comments, auto-celebrations) | P0 | 2 days |
| Realtime subscriptions (leaderboard, feed, challenge progress) | P0 | 1 day |
| Settings: badges, challenges | P1 | 1 day |

**Deliverable**: Full gamification loop -- reps earn badges, compete in challenges, see rankings, and celebrate wins in the feed.

### Phase 4: Financials and Documents (Weeks 9-10)

**Goal**: Commissions, quotes, contracts, and reports.

| Task | Priority | Estimate |
|---|---|---|
| Commission rules engine (rule CRUD, calculation on close) | P0 | 2 days |
| Commission ledger (table, summary cards, filtering) | P0 | 1 day |
| Payroll preview (date range, per-rep summary, export) | P0 | 1 day |
| Commission recalculation on status change + audit trail | P0 | 1 day |
| Quote builder (line items, totals, send, PDF) | P0 | 2 days |
| Contract templates + generation | P1 | 1 day |
| E-signature capture (canvas, storage, audit) | P1 | 1 day |
| PDF generation (quotes + contracts) | P1 | 1 day |
| Reports: rep performance (metrics, charts, funnel, export) | P0 | 2 days |
| Reports: team performance, pipeline analysis | P1 | 1 day |
| Settings: commissions | P1 | 0.5 day |

**Deliverable**: Full financial tracking, document generation, and performance reporting.

### Phase 5: Polish and Communication (Weeks 11-12)

**Goal**: Offline mode, chat, QR cards, and production readiness.

| Task | Priority | Estimate |
|---|---|---|
| Offline: IndexedDB cache layer (Dexie.js setup, lead/appointment caching) | P0 | 2 days |
| Offline: mutation queue and sync engine | P0 | 2 days |
| Offline: conflict resolution UI | P0 | 1 day |
| Service worker (asset caching, background sync) | P0 | 1 day |
| Sync status indicator | P0 | 0.5 day |
| Internal chat (conversations, messages, realtime) | P1 | 2 days |
| QR digital business card (card page, QR generation, tracking) | P1 | 1 day |
| SMS architecture (Twilio integration, send/receive, logging) | P2 | 1 day |
| Teams management (CRUD, member assignment, performance view) | P0 | 1 day |
| Profile page (personal info, avatar, badge/achievement display) | P1 | 0.5 day |
| End-to-end testing (critical flows) | P0 | 2 days |
| Performance optimization (lazy loading, code splitting, query optimization) | P0 | 1 day |
| Accessibility pass (keyboard nav, screen reader, contrast) | P1 | 1 day |
| Final i18n pass (all strings translated FR/EN) | P0 | 1 day |

**Deliverable**: Production-ready application with offline capabilities, internal communication, and QR card system.

---

## Appendix: Key Technical Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Single-tenant | Yes | Simplifies RLS, eliminates tenant isolation complexity, faster to ship |
| Event-sourced KPIs | `lead_activity_events` as immutable log | Audit trail, no double-counting, flexible aggregation |
| Materialized snapshots | Daily cron | Fast leaderboard queries without scanning millions of events |
| Offline-first | IndexedDB + mutation queue | D2D reps work in areas with poor connectivity |
| Dark theme default | Yes | Premium SaaS aesthetic, reduces eye strain for heavy users |
| PostGIS for territories | Spatial queries | Efficient polygon containment checks, heatmap generation |
| Supabase Realtime | WebSocket subscriptions | Live GPS, feed, leaderboard, chat without polling |
| next-intl for i18n | Server component support | Works with App Router, type-safe messages |
| Zustand for client state | Lightweight, no boilerplate | Sufficient for offline queue, UI state, session management |
| shadcn/ui | Copy-paste components | Full control over styling, dark theme customization, no vendor lock |

---

*This document serves as the complete technical and product specification for FieldPulse V1. All implementation should reference this plan as the source of truth.*
