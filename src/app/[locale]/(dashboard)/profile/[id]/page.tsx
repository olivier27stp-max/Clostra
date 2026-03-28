'use client';

import { use, useState } from 'react';
import { Avatar } from '@/components/ui/avatar';
import { cn } from '@/lib/utils/cn';
import { Link } from '@/i18n/navigation';
import {
  MessageSquare,
  Phone,
  Mail,
  Settings,
  MapPin,
  Briefcase,
  Hash,
  Calendar,
  TrendingUp,
  ChevronRight,
  ArrowLeft,
  Users,
  Target,
  DollarSign,
  BarChart3,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const ALL_PROFILES: Record<string, {
  id: string; name: string; role: string; tagline: string;
  avatar_url: string | null; banner_url: string | null;
  phone: string; email: string; location: string; department: string;
  employee_id: string; hire_date: string; team: string;
  stats: { revenue: number; closes: number; deals: number; conversion: number; doors: number };
  quarterSales: { label: string; value: number; percent: number }[];
}> = {
  'sarah-chen': {
    id: 'sarah-chen', name: 'Sarah Chen', role: 'Senior Sales Rep',
    tagline: 'Top performer. Always closing.',
    avatar_url: null, banner_url: null,
    phone: '819-555-0201', email: 'sarah@clostra.com',
    location: 'Trois-Rivières, QC', department: 'Sales', employee_id: 'CLO-0038',
    hire_date: 'Jan 2026', team: 'Équipe Est',
    stats: { revenue: 274200, closes: 62, deals: 54, conversion: 22.1, doors: 1580 },
    quarterSales: [
      { label: 'Q1 2026', value: 82400, percent: 92 },
      { label: 'Q4 2025', value: 68200, percent: 76 },
      { label: 'Q3 2025', value: 61800, percent: 69 },
      { label: 'Q2 2025', value: 42000, percent: 47 },
    ],
  },
  'marcus-davis': {
    id: 'marcus-davis', name: 'Marcus Davis', role: 'Sales Rep',
    tagline: 'Grind never stops.',
    avatar_url: null, banner_url: null,
    phone: '819-555-0202', email: 'marcus@clostra.com',
    location: 'Trois-Rivières, QC', department: 'Sales', employee_id: 'CLO-0041',
    hire_date: 'Fév 2026', team: 'Équipe Ouest',
    stats: { revenue: 218400, closes: 51, deals: 44, conversion: 19.5, doors: 1420 },
    quarterSales: [
      { label: 'Q1 2026', value: 68200, percent: 76 },
      { label: 'Q4 2025', value: 54200, percent: 60 },
      { label: 'Q3 2025', value: 48800, percent: 54 },
    ],
  },
  'emily-rodriguez': {
    id: 'emily-rodriguez', name: 'Emily Rodriguez', role: 'Sales Rep',
    tagline: 'Rising star of the team.',
    avatar_url: null, banner_url: null,
    phone: '819-555-0203', email: 'emily@clostra.com',
    location: 'Trois-Rivières, QC', department: 'Sales', employee_id: 'CLO-0045',
    hire_date: 'Mars 2026', team: 'Équipe Est',
    stats: { revenue: 156800, closes: 38, deals: 31, conversion: 16.8, doors: 1050 },
    quarterSales: [
      { label: 'Q1 2026', value: 52400, percent: 58 },
      { label: 'Q4 2025', value: 44200, percent: 49 },
    ],
  },
  'alex-martin': {
    id: 'alex-martin', name: 'Alex Martin', role: 'Sales Rep',
    tagline: 'Closing deals, building relationships.',
    avatar_url: null, banner_url: null,
    phone: '819-555-0204', email: 'alex@clostra.com',
    location: 'Trois-Rivières, QC', department: 'Sales', employee_id: 'CLO-0042',
    hire_date: 'Fév 2026', team: 'Équipe Ouest',
    stats: { revenue: 198400, closes: 47, deals: 38, conversion: 18.2, doors: 1284 },
    quarterSales: [
      { label: 'Q1 2026', value: 62400, percent: 78 },
      { label: 'Q4 2025', value: 54200, percent: 68 },
      { label: 'Q3 2025', value: 48800, percent: 61 },
      { label: 'Q2 2025', value: 33000, percent: 41 },
    ],
  },
};

function get(id: string) {
  return ALL_PROFILES[id] || ALL_PROFILES['alex-martin'];
}

function fmtCurrency(n: number) {
  if (n >= 1000) return `$${(n / 1000).toFixed(n >= 100000 ? 0 : 1)}k`;
  return `$${n}`;
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ProfileByIdPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const p = get(id);

  return (
    <div className="-mx-6 -my-5 min-h-[calc(100vh-3rem)]" style={{ background: '#0B0F14' }}>

      {/* ── Banner ── */}
      <div className="relative h-[200px] w-full overflow-hidden">
        {p.banner_url ? (
          <img src={p.banner_url} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full" style={{ background: 'linear-gradient(135deg, #4338CA 0%, #7C3AED 40%, #0D9488 100%)' }} />
        )}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #0B0F14 0%, #0B0F14aa 25%, transparent 60%)' }} />

        {/* Back */}
        <button
          onClick={() => window.history.back()}
          className="absolute top-5 left-6 z-10 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium text-white/80 transition-colors hover:text-white"
          style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(8px)' }}
        >
          <ArrowLeft size={14} />
          Back
        </button>
      </div>

      {/* ── Profile header ── */}
      <div className="relative mx-auto max-w-6xl px-8">
        {/* Avatar */}
        <div className="absolute -top-14">
          <div className="rounded-full p-[3px]" style={{ background: 'linear-gradient(135deg, #7C3AED, #0D9488)', boxShadow: '0 0 24px rgba(124,58,237,0.35)' }}>
            <div className="rounded-full" style={{ border: '4px solid #0B0F14' }}>
              <Avatar name={p.name} src={p.avatar_url} size="lg" className="!h-[110px] !w-[110px]" />
            </div>
          </div>
        </div>

        {/* Name row */}
        <div className="flex items-end justify-between pt-16 pb-6">
          <div className="pl-1">
            <h1 className="text-[28px] font-extrabold text-white tracking-tight">{p.name}</h1>
            <p className="mt-1 text-[14px] font-semibold text-[#A78BFA]">{p.role}</p>
            <p className="mt-1 text-[13px] text-[#6B7280] italic">"{p.tagline}"</p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Link
              href="/messages"
              className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-[13px] font-bold text-white transition-all duration-200 hover:brightness-110 hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: 'linear-gradient(135deg, #7C3AED, #6366F1)', boxShadow: '0 4px 16px rgba(124,58,237,0.3)' }}
            >
              <MessageSquare size={16} strokeWidth={2.5} />
              Message
            </Link>
            <ActionBtn icon={Phone} href={`tel:${p.phone}`} />
            <ActionBtn icon={Mail} href={`mailto:${p.email}`} />
            <ActionBtn icon={Settings} />
          </div>
        </div>
      </div>

      {/* ── Content grid ── */}
      <div className="mx-auto max-w-6xl px-8 pb-10">
        <div className="grid grid-cols-12 gap-5">

          {/* ============================================================= */}
          {/* LEFT COLUMN                                                    */}
          {/* ============================================================= */}
          <div className="col-span-4 space-y-5">

            {/* Info card */}
            <Card title="Details">
              <div className="space-y-4">
                <InfoRow icon={MapPin} label="Location" value={p.location} />
                <InfoRow icon={Briefcase} label="Department" value={p.department} />
                <InfoRow icon={Users} label="Team" value={p.team} />
                <InfoRow icon={Calendar} label="Hire Date" value={p.hire_date} />
                <InfoRow icon={Hash} label="Employee ID" value={p.employee_id} />
              </div>
            </Card>

          </div>

          {/* ============================================================= */}
          {/* RIGHT COLUMN                                                   */}
          {/* ============================================================= */}
          <div className="col-span-8 space-y-5">

            {/* KPI row */}
            <div className="grid grid-cols-5 gap-3">
              <KpiCard icon={DollarSign} label="Revenue" value={fmtCurrency(p.stats.revenue)} />
              <KpiCard icon={Target} label="Closes" value={String(p.stats.closes)} />
              <KpiCard icon={BarChart3} label="Deals" value={String(p.stats.deals)} />
              <KpiCard icon={TrendingUp} label="Conversion" value={`${p.stats.conversion}%`} />
              <KpiCard icon={MapPin} label="Doors" value={p.stats.doors.toLocaleString('en-US')} />
            </div>

            {/* Quarterly performance */}
            <Card title="Sales by Quarter">
              <div className="space-y-5">
                {p.quarterSales.map((q) => (
                  <div key={q.label}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[13px] font-semibold text-[#E6EDF3]">{q.label}</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-[14px] font-bold text-white">{fmtCurrency(q.value)}</span>
                        <span className="text-[11px] font-semibold text-[#484F58]">{q.percent}%</span>
                      </div>
                    </div>
                    <div className="h-3 w-full overflow-hidden rounded-full" style={{ background: 'rgba(255,255,255,0.04)' }}>
                      <div
                        className="h-full rounded-full transition-all duration-1000 ease-out"
                        style={{
                          width: `${q.percent}%`,
                          background: 'linear-gradient(90deg, #7C3AED 0%, #A78BFA 50%, #2DD4BF 100%)',
                          boxShadow: '0 0 12px rgba(124,58,237,0.3)',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Contact info */}
            <Card title="Contact">
              <div className="grid grid-cols-3 gap-4">
                <ContactItem label="Phone" value={p.phone} />
                <ContactItem label="Email" value={p.email} />
                <ContactItem label="Team" value={p.team} />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function ActionBtn({ icon: Icon, href }: { icon: React.ComponentType<{ size: number; className?: string }>; href?: string }) {
  const cls = "flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 hover:scale-110 active:scale-95";
  const style = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' };
  if (href) {
    return <a href={href} className={cls} style={style}><Icon size={18} className="text-[#8B949E]" /></a>;
  }
  return <button className={cls} style={style}><Icon size={18} className="text-[#8B949E]" /></button>;
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-5" style={{ background: '#111519', border: '1px solid rgba(255,255,255,0.06)' }}>
      <h3 className="mb-4 text-[13px] font-bold text-[#E6EDF3]">{title}</h3>
      {children}
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ComponentType<{ size: number; className?: string }>; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl" style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.12)' }}>
        <Icon size={16} className="text-[#A78BFA]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#484F58]">{label}</p>
        <p className="text-[13px] font-semibold text-[#E6EDF3] truncate">{value}</p>
      </div>
      <ChevronRight size={14} className="shrink-0 text-[#2D333B]" />
    </div>
  );
}

function KpiCard({ icon: Icon, label, value }: { icon: React.ComponentType<{ size: number; className?: string }>; label: string; value: string }) {
  return (
    <div className="rounded-2xl px-4 py-4" style={{ background: '#111519', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="flex h-8 w-8 items-center justify-center rounded-lg mb-3" style={{ background: 'rgba(124,58,237,0.08)' }}>
        <Icon size={16} className="text-[#A78BFA]" />
      </div>
      <p className="text-[22px] font-extrabold text-white tracking-tight">{value}</p>
      <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#484F58]">{label}</p>
    </div>
  );
}

function ContactItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl px-4 py-3" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
      <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#484F58]">{label}</p>
      <p className="mt-1 text-[13px] font-semibold text-[#E6EDF3] truncate">{value}</p>
    </div>
  );
}
