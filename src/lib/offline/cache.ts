/**
 * Local Cache Manager
 *
 * Caches territories, leads, and schedule data in IndexedDB for offline access.
 * Uses a simple key-value pattern over a single object store.
 */

const DB_NAME = 'fieldpulse_cache';
const STORE_NAME = 'cache';
const DB_VERSION = 1;

interface CacheEntry<T = unknown> {
  key: string;
  data: T;
  cached_at: string;
}

// ---------------------------------------------------------------------------
// IndexedDB helpers
// ---------------------------------------------------------------------------

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'key' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function setItem<T>(key: string, data: T): Promise<void> {
  const db = await openDB();
  const entry: CacheEntry<T> = {
    key,
    data,
    cached_at: new Date().toISOString(),
  };
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.put(entry);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

async function getItem<T>(key: string): Promise<T | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.get(key);
    req.onsuccess = () => {
      const entry = req.result as CacheEntry<T> | undefined;
      resolve(entry?.data ?? null);
    };
    req.onerror = () => reject(req.error);
  });
}

async function getCacheTime(key: string): Promise<string | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.get(key);
    req.onsuccess = () => {
      const entry = req.result as CacheEntry | undefined;
      resolve(entry?.cached_at ?? null);
    };
    req.onerror = () => reject(req.error);
  });
}

// ---------------------------------------------------------------------------
// Cache keys
// ---------------------------------------------------------------------------

const KEYS = {
  LEADS: 'leads',
  TERRITORIES: 'territories',
  SCHEDULE: 'schedule',
  MAP_PINS: 'map_pins',
  MAP_ZONES: 'map_zones',
} as const;

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function cacheLeads(leads: unknown[]): Promise<void> {
  await setItem(KEYS.LEADS, leads);
}

export async function getCachedLeads<T = unknown>(): Promise<T[] | null> {
  return getItem<T[]>(KEYS.LEADS);
}

export async function cacheTerritories(
  territories: unknown[]
): Promise<void> {
  await setItem(KEYS.TERRITORIES, territories);
}

export async function getCachedTerritories<T = unknown>(): Promise<
  T[] | null
> {
  return getItem<T[]>(KEYS.TERRITORIES);
}

export async function cacheSchedule(
  appointments: unknown[]
): Promise<void> {
  await setItem(KEYS.SCHEDULE, appointments);
}

export async function getCachedSchedule<T = unknown>(): Promise<
  T[] | null
> {
  return getItem<T[]>(KEYS.SCHEDULE);
}

export async function cacheMapPins(pins: unknown[]): Promise<void> {
  await setItem(KEYS.MAP_PINS, pins);
}

export async function getCachedMapPins<T = unknown>(): Promise<T[] | null> {
  return getItem<T[]>(KEYS.MAP_PINS);
}

export async function cacheMapZones(zones: unknown[]): Promise<void> {
  await setItem(KEYS.MAP_ZONES, zones);
}

export async function getCachedMapZones<T = unknown>(): Promise<T[] | null> {
  return getItem<T[]>(KEYS.MAP_ZONES);
}

export async function clearCache(): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.clear();
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function getLastCacheTime(): Promise<string | null> {
  // Return the most recent cache timestamp across all keys
  const times = await Promise.all(
    Object.values(KEYS).map((key) => getCacheTime(key))
  );
  const valid = times.filter(Boolean) as string[];
  if (valid.length === 0) return null;
  return valid.sort().pop() ?? null;
}
