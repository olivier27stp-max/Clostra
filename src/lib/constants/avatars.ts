/**
 * Centralized avatar URLs for all reps.
 * Use getRepAvatar(name) to get a consistent avatar across all pages.
 */

const REP_AVATARS: Record<string, string> = {
  'Sarah Chen': 'https://i.pravatar.cc/80?u=sarah-chen',
  'Marcus Davis': 'https://i.pravatar.cc/80?u=marcus-davis',
  'Emily Rodriguez': 'https://i.pravatar.cc/80?u=emily-rodriguez',
  'Alex Martin': 'https://i.pravatar.cc/80?u=alex-martin',
  'Jordan Kim': 'https://i.pravatar.cc/80?u=jordan-kim',
  'Taylor Brooks': 'https://i.pravatar.cc/80?u=taylor-brooks',
  'Casey Morgan': 'https://i.pravatar.cc/80?u=casey-morgan',
  'Riley Thompson': 'https://i.pravatar.cc/80?u=riley-thompson',
  'Quinn Harris': 'https://i.pravatar.cc/80?u=quinn-harris',
  'Drew Patel': 'https://i.pravatar.cc/80?u=drew-patel',
};

export function getRepAvatar(name: string): string | null {
  return REP_AVATARS[name] ?? null;
}
