/**
 * LeadPin — Status config, marker builder, popup builder
 */

export type PinStatus =
  | 'closed_won'
  | 'follow_up'
  | 'appointment'
  | 'no_answer'
  | 'rejected'
  | 'other';

export interface LeadPinData {
  id: string;
  lat: number;
  lng: number;
  status: PinStatus;
  name: string;
  address: string;
  note: string;
  /** Lume CRM reference — only populated after customer creation */
  lume_customer_id?: string | null;
  lume_job_id?: string | null;
  lume_status?: 'not_created' | 'creating' | 'created' | 'failed';
  lume_error?: string | null;
}

export interface PinStatusConfig {
  color: string;
  gradientFrom: string;
  gradientTo: string;
  label: string;
  iconPaths: string;
}

export const PIN_STATUS_CONFIG: Record<PinStatus, PinStatusConfig> = {
  closed_won: {
    color: '#22C55E',
    gradientFrom: '#4ADE80',
    gradientTo: '#16A34A',
    label: 'Fermé ✓',
    iconPaths: '<polyline points="20 6 9 17 4 12"/>',
  },
  follow_up: {
    color: '#06B6D4',
    gradientFrom: '#22D3EE',
    gradientTo: '#0891B2',
    label: 'Suivi',
    iconPaths: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  },
  appointment: {
    color: '#8B5CF6',
    gradientFrom: '#A78BFA',
    gradientTo: '#7C3AED',
    label: 'Rendez-vous',
    iconPaths: '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
  },
  no_answer: {
    color: '#EAB308',
    gradientFrom: '#FDE047',
    gradientTo: '#CA8A04',
    label: 'Pas de réponse',
    iconPaths: '<path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><circle cx="12" cy="17" r=".5"/>',
  },
  rejected: {
    color: '#EF4444',
    gradientFrom: '#F87171',
    gradientTo: '#DC2626',
    label: 'Refusé',
    iconPaths: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
  },
  other: {
    color: '#9CA3AF',
    gradientFrom: '#D1D5DB',
    gradientTo: '#6B7280',
    label: 'Autre',
    iconPaths: '<circle cx="12" cy="12" r="1.5"/>',
  },
};

let gradientIdCounter = 0;

function svgIcon(paths: string, size = 12, bold = false): string {
  const sw = bold ? '3' : '2.5';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;
}

/**
 * Creates a 30x30 circular marker element with gradient background.
 */
export function createLeadPinElement(status: PinStatus): HTMLDivElement {
  const cfg = PIN_STATUS_CONFIG[status];

  const el = document.createElement('div');
  el.setAttribute('style', [
    'box-sizing:border-box',
    'width:28px',
    'height:28px',
    'border-radius:50%',
    `background:linear-gradient(135deg,${cfg.gradientFrom},${cfg.gradientTo})`,
    'border:2px solid rgba(255,255,255,0.92)',
    `box-shadow:0 0 8px ${cfg.color}66,0 2px 6px rgba(0,0,0,0.4)`,
    'cursor:pointer',
    'display:flex',
    'align-items:center',
    'justify-content:center',
    'line-height:0',
  ].join(';'));

  el.innerHTML = svgIcon(cfg.iconPaths, 12, true);

  // Add hover ONLY after pin is settled — prevents any placement glitch
  setTimeout(() => {
    el.addEventListener('mouseenter', () => {
      el.style.boxShadow = `0 0 14px ${cfg.color}88,0 4px 12px rgba(0,0,0,0.5)`;
      el.style.borderColor = 'white';
    });
    el.addEventListener('mouseleave', () => {
      el.style.boxShadow = `0 0 8px ${cfg.color}66,0 2px 6px rgba(0,0,0,0.4)`;
      el.style.borderColor = 'rgba(255,255,255,0.92)';
    });
  }, 500);

  return el;
}

export function createLeadPinPopupHTML(
  pin: LeadPinData,
  editBtnId: string,
  deleteBtnId: string,
  lumeBtnId?: string,
): string {
  const cfg = PIN_STATUS_CONFIG[pin.status];
  const hasLume = pin.lume_status === 'created' && pin.lume_customer_id;
  const lumeFailed = pin.lume_status === 'failed';

  let lumeRow = '';
  if (hasLume && lumeBtnId) {
    lumeRow = `
      <button id="${lumeBtnId}" style="
        width:100%;padding:6px 0;border-radius:8px;margin-top:6px;
        border:1px solid rgba(99,102,241,.25);background:rgba(99,102,241,.08);color:#818cf8;
        font-size:11px;font-weight:600;cursor:pointer;
      ">Voir le client</button>
    `;
  } else if (lumeFailed && lumeBtnId) {
    lumeRow = `
      <button id="${lumeBtnId}" style="
        width:100%;padding:6px 0;border-radius:8px;margin-top:6px;
        border:1px solid rgba(245,158,11,.25);background:rgba(245,158,11,.08);color:#fbbf24;
        font-size:11px;font-weight:600;cursor:pointer;
      ">Réessayer la création</button>
    `;
  }

  return `
    <div style="font-family:Inter,system-ui,sans-serif;min-width:210px;">
      <div style="margin-bottom:10px;">
        <span style="
          display:inline-flex;align-items:center;gap:5px;
          padding:3px 10px;border-radius:999px;
          font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;
          background:${cfg.color}15;color:${cfg.color};border:1px solid ${cfg.color}30;
        ">${svgIcon(cfg.iconPaths, 10, true)} ${cfg.label}</span>
      </div>
      <div style="font-size:14px;font-weight:600;color:#fff;">${pin.name}</div>
      <div style="font-size:11px;color:rgba(255,255,255,.4);margin-top:5px;">📍 ${pin.address}</div>
      ${pin.note ? `<div style="font-size:11px;color:rgba(255,255,255,.55);margin-top:6px;padding:6px 8px;background:rgba(255,255,255,.04);border-radius:6px;border:1px solid rgba(255,255,255,.06);line-height:1.4;">📝 ${pin.note}</div>` : ''}
      <div style="margin-top:12px;display:flex;gap:6px;">
        <button id="${editBtnId}" style="
          flex:1;padding:7px 0;border-radius:8px;
          border:1px solid ${cfg.color}30;background:${cfg.color}12;color:${cfg.color};
          font-size:11px;font-weight:600;cursor:pointer;
        ">✎ Modifier</button>
        <button id="${deleteBtnId}" style="
          padding:7px 12px;border-radius:8px;
          border:1px solid rgba(239,68,68,.25);background:rgba(239,68,68,.08);color:#f87171;
          font-size:11px;font-weight:600;cursor:pointer;
        ">✕</button>
      </div>
      ${lumeRow}
    </div>
  `;
}
