'use client';

import { useState, useRef } from 'react';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { getRepAvatar } from '@/lib/constants/avatars';
import { cn } from '@/lib/utils/cn';
import {
  Camera,
  Save,
  MapPin,
  Briefcase,
  Users,
  Calendar,
  Hash,
  Phone,
  Mail,
  Target,
  DollarSign,
  BarChart3,
  TrendingUp,
  Pencil,
  Check,
  X,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Editable field component
// ---------------------------------------------------------------------------

function EditableField({
  value,
  onChange,
  icon: Icon,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  icon: React.ComponentType<{ size: number; className?: string }>;
  label: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  function save() {
    onChange(draft);
    setEditing(false);
  }

  function cancel() {
    setDraft(value);
    setEditing(false);
  }

  return (
    <div className="group flex items-center gap-3">
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
        style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.12)' }}
      >
        <Icon size={16} className="text-[#A78BFA]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#484F58]">{label}</p>
        {editing ? (
          <div className="flex items-center gap-1.5 mt-0.5">
            <input
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') save(); if (e.key === 'Escape') cancel(); }}
              className="flex-1 rounded-md bg-white/5 border border-white/10 px-2 py-1 text-[13px] font-semibold text-[#E6EDF3] outline-none focus:border-[#A78BFA] transition-colors"
            />
            <button onClick={save} className="rounded-md p-1 text-emerald-400 hover:bg-white/5">
              <Check size={14} />
            </button>
            <button onClick={cancel} className="rounded-md p-1 text-[#484F58] hover:bg-white/5">
              <X size={14} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            <p className="text-[13px] font-semibold text-[#E6EDF3] truncate">{value}</p>
            <button
              onClick={() => { setDraft(value); setEditing(true); }}
              className="opacity-0 group-hover:opacity-100 rounded-md p-0.5 text-[#484F58] hover:text-[#A78BFA] transition-all"
            >
              <Pencil size={11} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ProfileSettingsPage() {
  // Profile data
  const [name, setName] = useState('Alex Martin');
  const [role, setRole] = useState('Sales Rep');
  const [tagline, setTagline] = useState('Closing deals, building relationships.');
  const [phone, setPhone] = useState('819-555-0204');
  const [email, setEmail] = useState('alex@clostra.com');
  const [location, setLocation] = useState('Trois-Rivières, QC');
  const [department, setDepartment] = useState('Sales');
  const [team, setTeam] = useState('Équipe Ouest');
  const [hireDate, setHireDate] = useState('Fév 2026');
  const [employeeId, setEmployeeId] = useState('CLO-0042');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);

  // Inline editing for name/role/tagline
  const [editingName, setEditingName] = useState(false);
  const [editingRole, setEditingRole] = useState(false);
  const [editingTagline, setEditingTagline] = useState(false);
  const [draftName, setDraftName] = useState(name);
  const [draftRole, setDraftRole] = useState(role);
  const [draftTagline, setDraftTagline] = useState(tagline);

  // Stats (read-only display)
  const stats = { revenue: 198400, closes: 47, deals: 38, conversion: 18.2, doors: 1284 };
  const quarterSales = [
    { label: 'Q1 2026', value: 62400, percent: 78 },
    { label: 'Q4 2025', value: 54200, percent: 68 },
    { label: 'Q3 2025', value: 48800, percent: 61 },
    { label: 'Q2 2025', value: 33000, percent: 41 },
  ];

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => setAvatarUrl(reader.result as string);
    reader.readAsDataURL(file);
  }

  function handleBannerChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => setBannerUrl(reader.result as string);
    reader.readAsDataURL(file);
  }

  function fmtCurrency(n: number) {
    if (n >= 1000) return `$${(n / 1000).toFixed(n >= 100000 ? 0 : 1)}k`;
    return `$${n}`;
  }

  return (
    <div className="-mx-6 -my-6 min-h-[calc(100vh-3rem)]" style={{ background: '#0B0F14' }}>

      {/* ── Banner ── */}
      <div className="relative h-[200px] w-full overflow-hidden group/banner cursor-pointer" onClick={() => bannerInputRef.current?.click()}>
        {bannerUrl ? (
          <img src={bannerUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full" style={{ background: 'linear-gradient(135deg, #4338CA 0%, #7C3AED 40%, #0D9488 100%)' }} />
        )}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #0B0F14 0%, #0B0F14aa 25%, transparent 60%)' }} />
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover/banner:opacity-100 transition-opacity">
          <div className="flex items-center gap-2 rounded-lg bg-black/50 px-4 py-2 text-[13px] font-medium text-white">
            <Camera size={16} />
            Changer la bannière
          </div>
        </div>
        <input ref={bannerInputRef} type="file" accept="image/*" onChange={handleBannerChange} className="hidden" />
      </div>

      {/* ── Profile header ── */}
      <div className="relative mx-auto max-w-6xl px-8">
        {/* Avatar */}
        <div className="absolute -top-14">
          <div
            className="relative rounded-full p-[3px] group/avatar cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #0D9488)', boxShadow: '0 0 24px rgba(124,58,237,0.35)' }}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="rounded-full" style={{ border: '4px solid #0B0F14' }}>
              <Avatar name={name} src={avatarUrl || getRepAvatar(name)} size="lg" className="!h-[110px] !w-[110px]" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity">
              <Camera size={24} className="text-white" />
            </div>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
        </div>

        {/* Name row */}
        <div className="flex items-end justify-between pt-16 pb-6">
          <div className="pl-1 space-y-1">
            {/* Name */}
            {editingName ? (
              <div className="flex items-center gap-2">
                <input
                  autoFocus
                  value={draftName}
                  onChange={(e) => setDraftName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { setName(draftName); setEditingName(false); } if (e.key === 'Escape') setEditingName(false); }}
                  className="rounded-lg bg-white/5 border border-white/10 px-3 py-1.5 text-[28px] font-extrabold text-white tracking-tight outline-none focus:border-[#A78BFA]"
                />
                <button onClick={() => { setName(draftName); setEditingName(false); }} className="text-emerald-400 hover:bg-white/5 rounded-md p-1"><Check size={18} /></button>
                <button onClick={() => setEditingName(false)} className="text-[#484F58] hover:bg-white/5 rounded-md p-1"><X size={18} /></button>
              </div>
            ) : (
              <div className="group flex items-center gap-2">
                <h1 className="text-[28px] font-extrabold text-white tracking-tight">{name}</h1>
                <button onClick={() => { setDraftName(name); setEditingName(true); }} className="opacity-0 group-hover:opacity-100 text-[#484F58] hover:text-[#A78BFA] transition-all"><Pencil size={14} /></button>
              </div>
            )}

            {/* Role */}
            {editingRole ? (
              <div className="flex items-center gap-2">
                <input
                  autoFocus
                  value={draftRole}
                  onChange={(e) => setDraftRole(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { setRole(draftRole); setEditingRole(false); } if (e.key === 'Escape') setEditingRole(false); }}
                  className="rounded-md bg-white/5 border border-white/10 px-2 py-1 text-[14px] font-semibold text-[#A78BFA] outline-none focus:border-[#A78BFA]"
                />
                <button onClick={() => { setRole(draftRole); setEditingRole(false); }} className="text-emerald-400 hover:bg-white/5 rounded-md p-0.5"><Check size={14} /></button>
                <button onClick={() => setEditingRole(false)} className="text-[#484F58] hover:bg-white/5 rounded-md p-0.5"><X size={14} /></button>
              </div>
            ) : (
              <div className="group flex items-center gap-2">
                <p className="text-[14px] font-semibold text-[#A78BFA]">{role}</p>
                <button onClick={() => { setDraftRole(role); setEditingRole(true); }} className="opacity-0 group-hover:opacity-100 text-[#484F58] hover:text-[#A78BFA] transition-all"><Pencil size={11} /></button>
              </div>
            )}

            {/* Tagline */}
            {editingTagline ? (
              <div className="flex items-center gap-2">
                <input
                  autoFocus
                  value={draftTagline}
                  onChange={(e) => setDraftTagline(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { setTagline(draftTagline); setEditingTagline(false); } if (e.key === 'Escape') setEditingTagline(false); }}
                  className="rounded-md bg-white/5 border border-white/10 px-2 py-1 text-[13px] italic text-[#6B7280] outline-none focus:border-[#A78BFA] w-80"
                />
                <button onClick={() => { setTagline(draftTagline); setEditingTagline(false); }} className="text-emerald-400 hover:bg-white/5 rounded-md p-0.5"><Check size={14} /></button>
                <button onClick={() => setEditingTagline(false)} className="text-[#484F58] hover:bg-white/5 rounded-md p-0.5"><X size={14} /></button>
              </div>
            ) : (
              <div className="group flex items-center gap-2">
                <p className="text-[13px] text-[#6B7280] italic">"{tagline}"</p>
                <button onClick={() => { setDraftTagline(tagline); setEditingTagline(true); }} className="opacity-0 group-hover:opacity-100 text-[#484F58] hover:text-[#A78BFA] transition-all"><Pencil size={11} /></button>
              </div>
            )}
          </div>

          {/* Save button */}
          <Button
            className="gap-2 rounded-xl px-5 py-2.5 text-[13px] font-bold text-white border-0"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #6366F1)', boxShadow: '0 4px 16px rgba(124,58,237,0.3)' }}
          >
            <Save size={16} />
            Enregistrer
          </Button>
        </div>
      </div>

      {/* ── Content grid ── */}
      <div className="mx-auto max-w-6xl px-8 pb-10">
        <div className="grid grid-cols-12 gap-5">

          {/* LEFT COLUMN */}
          <div className="col-span-4 space-y-5">
            {/* Details */}
            <DarkCard title="Détails">
              <div className="space-y-4">
                <EditableField icon={MapPin} label="Localisation" value={location} onChange={setLocation} />
                <EditableField icon={Briefcase} label="Département" value={department} onChange={setDepartment} />
                <EditableField icon={Users} label="Équipe" value={team} onChange={setTeam} />
                <EditableField icon={Calendar} label="Date d'embauche" value={hireDate} onChange={setHireDate} />
                <EditableField icon={Hash} label="ID Employé" value={employeeId} onChange={setEmployeeId} />
              </div>
            </DarkCard>

            {/* Contact */}
            <DarkCard title="Contact">
              <div className="space-y-4">
                <EditableField icon={Phone} label="Téléphone" value={phone} onChange={setPhone} />
                <EditableField icon={Mail} label="Courriel" value={email} onChange={setEmail} />
              </div>
            </DarkCard>
          </div>

          {/* RIGHT COLUMN */}
          <div className="col-span-8 space-y-5">
            {/* KPI row */}
            <div className="grid grid-cols-5 gap-3">
              <KpiCard icon={DollarSign} label="Revenus" value={fmtCurrency(stats.revenue)} />
              <KpiCard icon={Target} label="Closes" value={String(stats.closes)} />
              <KpiCard icon={BarChart3} label="Deals" value={String(stats.deals)} />
              <KpiCard icon={TrendingUp} label="Conversion" value={`${stats.conversion}%`} />
              <KpiCard icon={MapPin} label="Portes" value={stats.doors.toLocaleString('fr-CA')} />
            </div>

            {/* Quarterly performance */}
            <DarkCard title="Ventes par trimestre">
              <div className="space-y-5">
                {quarterSales.map((q) => (
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
            </DarkCard>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function DarkCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-5" style={{ background: '#111519', border: '1px solid rgba(255,255,255,0.06)' }}>
      <h3 className="mb-4 text-[13px] font-bold text-[#E6EDF3]">{title}</h3>
      {children}
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
