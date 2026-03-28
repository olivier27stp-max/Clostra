/**
 * FieldPulse — Sample Seed Data
 *
 * Run with: npx tsx supabase/seed/index.ts
 *
 * This seeds a realistic demo dataset for development:
 * - 1 Owner, 1 Admin, 2 Team Leaders, 8 Sales Reps
 * - 2 Teams with territories
 * - 50+ leads across pipeline stages
 * - Activity events, field sessions, commissions
 * - Sample challenges, badges, feed posts
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function uuid() {
  return crypto.randomUUID();
}

const now = new Date();
const today = now.toISOString().split('T')[0];

// ---------------------------------------------------------------------------
// Profiles (must be created via Supabase Auth first in real usage)
// For seeding, we insert directly into profiles assuming auth.users exist
// ---------------------------------------------------------------------------

const PROFILES = [
  { id: uuid(), email: 'owner@fieldpulse.dev', first_name: 'Marc', last_name: 'Dupont', role: 'owner', locale: 'fr' },
  { id: uuid(), email: 'admin@fieldpulse.dev', first_name: 'Sophie', last_name: 'Tremblay', role: 'admin', locale: 'fr' },
  { id: uuid(), email: 'tl.east@fieldpulse.dev', first_name: 'Jean', last_name: 'Lavoie', role: 'team_leader', locale: 'fr' },
  { id: uuid(), email: 'tl.west@fieldpulse.dev', first_name: 'Sarah', last_name: 'Bouchard', role: 'team_leader', locale: 'en' },
  { id: uuid(), email: 'rep1@fieldpulse.dev', first_name: 'Alexandre', last_name: 'Gagnon', role: 'sales_rep', locale: 'fr' },
  { id: uuid(), email: 'rep2@fieldpulse.dev', first_name: 'Émilie', last_name: 'Roy', role: 'sales_rep', locale: 'fr' },
  { id: uuid(), email: 'rep3@fieldpulse.dev', first_name: 'Thomas', last_name: 'Côté', role: 'sales_rep', locale: 'fr' },
  { id: uuid(), email: 'rep4@fieldpulse.dev', first_name: 'Camille', last_name: 'Morin', role: 'sales_rep', locale: 'fr' },
  { id: uuid(), email: 'rep5@fieldpulse.dev', first_name: 'David', last_name: 'Martin', role: 'sales_rep', locale: 'en' },
  { id: uuid(), email: 'rep6@fieldpulse.dev', first_name: 'Jessica', last_name: 'Pelletier', role: 'sales_rep', locale: 'en' },
  { id: uuid(), email: 'rep7@fieldpulse.dev', first_name: 'Maxime', last_name: 'Bélanger', role: 'sales_rep', locale: 'fr' },
  { id: uuid(), email: 'rep8@fieldpulse.dev', first_name: 'Audrey', last_name: 'Leblanc', role: 'sales_rep', locale: 'fr' },
];

const [owner, admin, tlEast, tlWest, ...reps] = PROFILES;
const eastReps = reps.slice(0, 4);
const westReps = reps.slice(4, 8);

// ---------------------------------------------------------------------------
// Teams
// ---------------------------------------------------------------------------

const TEAM_EAST = { id: uuid(), name: 'Équipe Est', leader_id: tlEast.id, color: '#3b82f6' };
const TEAM_WEST = { id: uuid(), name: 'West Team', leader_id: tlWest.id, color: '#22c55e' };

// Assign team_id to profiles
eastReps.forEach(r => (r as any).team_id = TEAM_EAST.id);
westReps.forEach(r => (r as any).team_id = TEAM_WEST.id);
(tlEast as any).team_id = TEAM_EAST.id;
(tlWest as any).team_id = TEAM_WEST.id;

// ---------------------------------------------------------------------------
// Territories (Trois-Rivières area polygons)
// ---------------------------------------------------------------------------

const TERRITORIES = [
  {
    id: uuid(),
    name: 'Cap-de-la-Madeleine',
    color: '#3b82f6',
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [-72.53, 46.37], [-72.50, 46.37], [-72.50, 46.35], [-72.53, 46.35], [-72.53, 46.37],
      ]],
    },
    status: 'active',
    assigned_team_id: TEAM_EAST.id,
    capacity_target: 500,
  },
  {
    id: uuid(),
    name: 'Trois-Rivières Centre',
    color: '#22c55e',
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [-72.56, 46.35], [-72.53, 46.35], [-72.53, 46.33], [-72.56, 46.33], [-72.56, 46.35],
      ]],
    },
    status: 'active',
    assigned_team_id: TEAM_EAST.id,
    capacity_target: 400,
  },
  {
    id: uuid(),
    name: 'Sainte-Marthe-du-Cap',
    color: '#a855f7',
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [-72.56, 46.38], [-72.53, 46.38], [-72.53, 46.36], [-72.56, 46.36], [-72.56, 46.38],
      ]],
    },
    status: 'active',
    assigned_team_id: TEAM_WEST.id,
    capacity_target: 350,
  },
  {
    id: uuid(),
    name: 'Pointe-du-Lac',
    color: '#f59e0b',
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [-72.62, 46.32], [-72.58, 46.32], [-72.58, 46.30], [-72.62, 46.30], [-72.62, 46.32],
      ]],
    },
    status: 'active',
    assigned_team_id: TEAM_WEST.id,
    capacity_target: 300,
  },
];

// ---------------------------------------------------------------------------
// Households & Leads
// ---------------------------------------------------------------------------

const STREETS = [
  'Rue des Forges', 'Boul. des Récollets', 'Rue Laviolette', 'Rue Royale',
  'Boul. du Saint-Maurice', 'Rue Hart', 'Rue Champflour', 'Rue Sainte-Ursule',
  'Boul. Jean-XXIII', 'Rue Notre-Dame', 'Rue du Fleuve', 'Rue Bellefeuille',
  'Rue Bureau', 'Rue Hertel', 'Rue Saint-François-Xavier',
];

const FIRST_NAMES = ['Pierre', 'Marie', 'Luc', 'Isabelle', 'Michel', 'Nathalie', 'Denis', 'Julie', 'François', 'Caroline'];
const LAST_NAMES = ['Bergeron', 'Fortin', 'Thibault', 'Gauthier', 'Ouellet', 'Paradis', 'Cloutier', 'Caron', 'Simard', 'Dufour'];
const SOURCES: Array<'door_knock' | 'referral' | 'qr_scan' | 'inbound' | 'manual'> = ['door_knock', 'door_knock', 'door_knock', 'referral', 'qr_scan', 'inbound', 'manual'];

function generateHouseholdsAndLeads() {
  const households: any[] = [];
  const leads: any[] = [];

  // We need pipeline_stage IDs — these are seeded by the migration
  // For seed script, we'll use slug-based lookup after insert
  // For now, use placeholder stage slugs and resolve later

  const allReps = [...eastReps, ...westReps];

  for (let i = 0; i < 60; i++) {
    const hId = uuid();
    const lat = 46.30 + Math.random() * 0.08;
    const lng = -72.62 + Math.random() * 0.12;

    households.push({
      id: hId,
      address_line1: `${randomBetween(100, 9999)} ${randomFrom(STREETS)}`,
      city: 'Trois-Rivières',
      state: 'QC',
      postal_code: `G${randomBetween(8, 9)}A ${randomBetween(1, 9)}B${randomBetween(1, 9)}`,
      country: 'CA',
      latitude: lat,
      longitude: lng,
    });

    const rep = randomFrom(allReps);
    const territory = randomFrom(TERRITORIES);

    leads.push({
      id: uuid(),
      first_name: randomFrom(FIRST_NAMES),
      last_name: randomFrom(LAST_NAMES),
      phone: `819-${randomBetween(100, 999)}-${randomBetween(1000, 9999)}`,
      email: `lead${i}@example.com`,
      preferred_language: Math.random() > 0.2 ? 'fr' : 'en',
      source: randomFrom(SOURCES),
      household_id: hId,
      assigned_rep_id: rep.id,
      territory_id: territory.id,
      // stage_id will be set after fetching stage IDs
      _stage_index: i,
      latitude: lat,
      longitude: lng,
      revenue: null as number | null,
      close_date: null as string | null,
      lost_reason: null as string | null,
      tags: [],
    });
  }

  return { households, leads };
}

// ---------------------------------------------------------------------------
// Commission Rules
// ---------------------------------------------------------------------------

const COMMISSION_RULES = [
  {
    id: uuid(),
    name: 'Standard Commission',
    type: 'flat',
    rate: 150,
    is_active: true,
    priority: 0,
    conditions: {},
  },
  {
    id: uuid(),
    name: 'Premium Deal Bonus',
    type: 'percentage',
    rate: 5,
    min_revenue: 5000,
    is_active: true,
    priority: 1,
    conditions: { min_revenue: 5000 },
  },
];

// ---------------------------------------------------------------------------
// Company Settings
// ---------------------------------------------------------------------------

const COMPANY_SETTINGS = {
  id: uuid(),
  name: 'FieldPulse Demo',
  default_locale: 'fr',
  timezone: 'America/Toronto',
};

// ---------------------------------------------------------------------------
// Main seed function
// ---------------------------------------------------------------------------

async function seed() {
  console.log('🌱 Seeding FieldPulse demo data...\n');

  // 1. Company settings
  console.log('  → Company settings');
  await supabase.from('company_settings').upsert(COMPANY_SETTINGS);

  // 2. Teams (before profiles that reference team_id)
  console.log('  → Teams');
  await supabase.from('teams').upsert([TEAM_EAST, TEAM_WEST]);

  // 3. Profiles
  console.log('  → Profiles');
  const { error: profileError } = await supabase.from('profiles').upsert(
    PROFILES.map(p => ({
      ...p,
      is_active: true,
      team_id: (p as any).team_id || null,
    }))
  );
  if (profileError) console.error('    Profile error:', profileError.message);

  // 4. Territories
  console.log('  → Territories');
  await supabase.from('territories').upsert(TERRITORIES);

  // 5. Territory assignments
  console.log('  → Territory assignments');
  const assignments = [
    ...eastReps.map((r, i) => ({
      id: uuid(),
      territory_id: TERRITORIES[i % 2].id,
      profile_id: r.id,
      assigned_by: tlEast.id,
      is_primary: true,
      started_at: new Date().toISOString(),
    })),
    ...westReps.map((r, i) => ({
      id: uuid(),
      territory_id: TERRITORIES[2 + (i % 2)].id,
      profile_id: r.id,
      assigned_by: tlWest.id,
      is_primary: true,
      started_at: new Date().toISOString(),
    })),
  ];
  await supabase.from('territory_assignments').upsert(assignments);

  // 6. Fetch pipeline stages
  console.log('  → Fetching pipeline stages');
  const { data: stages } = await supabase
    .from('pipeline_stages')
    .select('id, slug, position')
    .order('position');

  if (!stages || stages.length === 0) {
    console.error('    No pipeline stages found! Run the migration first.');
    process.exit(1);
  }

  const stageMap = Object.fromEntries(stages.map(s => [s.slug, s.id]));
  const stageDistribution = [
    { slug: 'new_lead', weight: 20 },
    { slug: 'must_recall', weight: 15 },
    { slug: 'quote_sent', weight: 10 },
    { slug: 'closed_won', weight: 10 },
    { slug: 'closed_lost', weight: 5 },
  ];

  function pickStage(index: number): string {
    let cumulative = 0;
    const normalized = index % 60;
    for (const s of stageDistribution) {
      cumulative += s.weight;
      if (normalized < cumulative) return s.slug;
    }
    return 'new_lead';
  }

  // 7. Households & Leads
  console.log('  → Households & leads');
  const { households, leads } = generateHouseholdsAndLeads();

  await supabase.from('households').upsert(households);

  const preparedLeads = leads.map(l => {
    const stageSlug = pickStage(l._stage_index);
    const stageId = stageMap[stageSlug];
    const isWon = stageSlug === 'closed_won';
    const isLost = stageSlug === 'closed_lost';

    return {
      id: l.id,
      first_name: l.first_name,
      last_name: l.last_name,
      phone: l.phone,
      email: l.email,
      preferred_language: l.preferred_language,
      source: l.source,
      household_id: l.household_id,
      assigned_rep_id: l.assigned_rep_id,
      territory_id: l.territory_id,
      stage_id: stageId,
      latitude: l.latitude,
      longitude: l.longitude,
      revenue: isWon ? randomBetween(2000, 15000) : null,
      close_date: isWon || isLost ? today : null,
      lost_reason: isLost ? randomFrom(['Not interested', 'Too expensive', 'Already has provider', 'Bad timing']) : null,
      tags: [],
    };
  });

  await supabase.from('leads').upsert(preparedLeads);

  // 8. Activity events for leads
  console.log('  → Lead activity events');
  const events: any[] = [];
  for (const lead of preparedLeads) {
    events.push({
      id: uuid(),
      lead_id: lead.id,
      profile_id: lead.assigned_rep_id,
      event_type: 'door_knock',
      metadata: {},
      created_at: new Date(Date.now() - randomBetween(1, 7) * 86400000).toISOString(),
    });

    if (lead.stage_id !== stageMap.new_lead) {
      events.push({
        id: uuid(),
        lead_id: lead.id,
        profile_id: lead.assigned_rep_id,
        event_type: 'conversation',
        metadata: {},
        created_at: new Date(Date.now() - randomBetween(1, 5) * 86400000).toISOString(),
      });
    }

    if (lead.stage_id === stageMap.quote_sent || lead.stage_id === stageMap.closed_won) {
      events.push({
        id: uuid(),
        lead_id: lead.id,
        profile_id: lead.assigned_rep_id,
        event_type: 'quote_sent',
        metadata: {},
        created_at: new Date(Date.now() - randomBetween(1, 3) * 86400000).toISOString(),
      });
    }

    if (lead.stage_id === stageMap.closed_won) {
      events.push({
        id: uuid(),
        lead_id: lead.id,
        profile_id: lead.assigned_rep_id,
        event_type: 'status_change',
        metadata: { revenue: lead.revenue },
        new_stage_id: stageMap.closed_won,
        created_at: new Date(Date.now() - randomBetween(0, 2) * 86400000).toISOString(),
      });
    }
  }
  await supabase.from('lead_activity_events').upsert(events);

  // 9. Commission rules
  console.log('  → Commission rules');
  await supabase.from('commission_rules').upsert(COMMISSION_RULES);

  // 10. Commission entries for won deals
  console.log('  → Commission entries');
  const wonLeads = preparedLeads.filter(l => l.stage_id === stageMap.closed_won);
  const commEntries = wonLeads.map(l => ({
    id: uuid(),
    profile_id: l.assigned_rep_id,
    lead_id: l.id,
    rule_id: COMMISSION_RULES[0].id,
    amount: COMMISSION_RULES[0].rate,
    status: 'pending',
    deal_revenue: l.revenue,
    calculated_at: new Date().toISOString(),
  }));
  if (commEntries.length > 0) {
    await supabase.from('commission_entries').upsert(commEntries);
  }

  // 11. Rep stat snapshots (last 7 days)
  console.log('  → Rep stat snapshots');
  const snapshots: any[] = [];
  const allReps = [...eastReps, ...westReps];
  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    const date = new Date(Date.now() - dayOffset * 86400000).toISOString().split('T')[0];
    for (const rep of allReps) {
      snapshots.push({
        id: uuid(),
        profile_id: rep.id,
        date,
        period_type: 'daily',
        doors_knocked: randomBetween(15, 50),
        conversations: randomBetween(8, 25),
        demos_set: randomBetween(2, 8),
        demos_held: randomBetween(1, 6),
        quotes_sent: randomBetween(1, 5),
        closes: randomBetween(0, 3),
        revenue: randomBetween(0, 3) * randomBetween(2000, 8000),
        follow_ups_completed: randomBetween(3, 12),
      });
    }
  }
  await supabase.from('rep_stat_snapshots').upsert(snapshots);

  // 12. Feed posts
  console.log('  → Feed posts');
  const feedPosts = [
    { id: uuid(), profile_id: eastReps[0].id, type: 'win', content: 'Just closed a $8,500 deal! 🔥', metadata: { revenue: 8500 }, visibility: 'company' },
    { id: uuid(), profile_id: eastReps[1].id, type: 'badge', content: 'Earned the "First Close" badge!', metadata: { badge: 'first_close' }, visibility: 'company' },
    { id: uuid(), profile_id: westReps[0].id, type: 'milestone', content: '10 closes this month — new personal record!', metadata: { closes: 10 }, visibility: 'company' },
    { id: uuid(), profile_id: westReps[2].id, type: 'win', content: 'Biggest deal of the week — $12,000! Let\'s go!', metadata: { revenue: 12000 }, visibility: 'company' },
    { id: uuid(), profile_id: eastReps[2].id, type: 'manual', content: 'Great energy on the East team today. Keep it up!', metadata: {}, visibility: 'team' },
  ];
  await supabase.from('feed_posts').upsert(feedPosts);

  // 13. Challenges
  console.log('  → Challenges');
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  const challenges = [
    {
      id: uuid(),
      name_en: 'Weekly Close King',
      name_fr: 'Roi de la semaine',
      description_en: 'Most closes this week wins!',
      description_fr: 'Le plus de fermetures cette semaine gagne!',
      type: 'weekly',
      metric_slug: 'closes',
      start_date: weekStart.toISOString().split('T')[0],
      end_date: weekEnd.toISOString().split('T')[0],
      status: 'active',
      created_by: owner.id,
    },
    {
      id: uuid(),
      name_en: 'Daily Door Blitz',
      name_fr: 'Blitz du jour',
      description_en: 'Knock the most doors today!',
      description_fr: 'Cogne le plus de portes aujourd\'hui!',
      type: 'daily',
      metric_slug: 'doors_knocked',
      start_date: today,
      end_date: today,
      status: 'active',
      created_by: tlEast.id,
    },
  ];
  await supabase.from('challenges').upsert(challenges);

  // Challenge participants
  const participants = allReps.flatMap(rep =>
    challenges.map(ch => ({
      id: uuid(),
      challenge_id: ch.id,
      profile_id: rep.id,
      current_value: randomBetween(0, 15),
      joined_at: new Date().toISOString(),
    }))
  );
  await supabase.from('challenge_participants').upsert(participants);

  // 14. QR Cards for reps
  console.log('  → QR cards');
  const qrCards = allReps.map(rep => ({
    id: uuid(),
    profile_id: rep.id,
    slug: `${rep.first_name.toLowerCase()}-${rep.last_name.toLowerCase()}`,
    headline: rep.locale === 'fr' ? 'Votre conseiller résidentiel' : 'Your residential advisor',
    bio: rep.locale === 'fr'
      ? `${rep.first_name} est spécialiste en solutions résidentielles.`
      : `${rep.first_name} specializes in residential solutions.`,
    phone: `819-${randomBetween(100, 999)}-${randomBetween(1000, 9999)}`,
    email: rep.email,
    company_name: 'FieldPulse Demo',
    theme: { primaryColor: '#6366f1', style: 'modern' },
    is_active: true,
  }));
  await supabase.from('qr_cards').upsert(qrCards);

  console.log('\n✅ Seed complete!');
  console.log(`   ${PROFILES.length} profiles`);
  console.log(`   2 teams`);
  console.log(`   ${TERRITORIES.length} territories`);
  console.log(`   ${preparedLeads.length} leads`);
  console.log(`   ${events.length} activity events`);
  console.log(`   ${commEntries.length} commission entries`);
  console.log(`   ${snapshots.length} stat snapshots`);
  console.log(`   ${feedPosts.length} feed posts`);
  console.log(`   ${challenges.length} challenges`);
  console.log(`   ${qrCards.length} QR cards`);
}

seed().catch(console.error);
