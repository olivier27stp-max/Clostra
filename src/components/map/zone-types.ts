/**
 * Zone system — types and color palette for map zones.
 */

export interface ZoneData {
  id: string;
  name: string;
  created_by: string;
  assigned_to: string | null;
  assigned_to_name: string | null;
  coordinates: [number, number][];
  color: string;
  created_at: string;
}

/** Rotating palette for zone colors — distinguishable on satellite imagery */
export const ZONE_COLORS = [
  '#6366f1', // indigo
  '#f59e0b', // amber
  '#10b981', // emerald
  '#ef4444', // red
  '#8b5cf6', // violet
  '#06b6d4', // cyan
  '#f97316', // orange
  '#ec4899', // pink
  '#14b8a6', // teal
  '#a855f7', // purple
];

export function getZoneColor(index: number): string {
  return ZONE_COLORS[index % ZONE_COLORS.length];
}
