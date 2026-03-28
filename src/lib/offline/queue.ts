/**
 * Offline Queue Manager
 *
 * Stores pending mutations in IndexedDB and processes them when back online.
 * Each mutation tracks its retry count and last error for resilient sync.
 */

import type { SupabaseClient } from '@supabase/supabase-js';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface OfflineMutation {
  id: string;
  table: string;
  operation: 'insert' | 'update' | 'delete';
  data: Record<string, unknown>;
  created_at: string;
  retry_count: number;
  last_error: string | null;
}

type QueueEventType = 'sync-start' | 'sync-complete' | 'sync-error';
type QueueEventHandler = (detail?: unknown) => void;

// ---------------------------------------------------------------------------
// IndexedDB helpers
// ---------------------------------------------------------------------------

const DB_NAME = 'fieldpulse_offline';
const STORE_NAME = 'mutations';
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function txStore(
  db: IDBDatabase,
  mode: IDBTransactionMode
): IDBObjectStore {
  const tx = db.transaction(STORE_NAME, mode);
  return tx.objectStore(STORE_NAME);
}

// ---------------------------------------------------------------------------
// Queue Manager
// ---------------------------------------------------------------------------

const MAX_RETRIES = 3;

class OfflineQueueManager {
  private listeners: Map<QueueEventType, Set<QueueEventHandler>> = new Map();

  // -- Event emitter --------------------------------------------------------

  on(event: QueueEventType, handler: QueueEventHandler): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(handler);
  }

  off(event: QueueEventType, handler: QueueEventHandler): void {
    this.listeners.get(event)?.delete(handler);
  }

  private emit(event: QueueEventType, detail?: unknown): void {
    this.listeners.get(event)?.forEach((h) => h(detail));
  }

  // -- CRUD -----------------------------------------------------------------

  async enqueue(
    mutation: Omit<OfflineMutation, 'id' | 'created_at' | 'retry_count' | 'last_error'>
  ): Promise<OfflineMutation> {
    const entry: OfflineMutation = {
      ...mutation,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      retry_count: 0,
      last_error: null,
    };
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const store = txStore(db, 'readwrite');
      const req = store.add(entry);
      req.onsuccess = () => resolve(entry);
      req.onerror = () => reject(req.error);
    });
  }

  async getAll(): Promise<OfflineMutation[]> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const store = txStore(db, 'readonly');
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result as OfflineMutation[]);
      req.onerror = () => reject(req.error);
    });
  }

  async remove(id: string): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const store = txStore(db, 'readwrite');
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  async clear(): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const store = txStore(db, 'readwrite');
      const req = store.clear();
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  private async update(mutation: OfflineMutation): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const store = txStore(db, 'readwrite');
      const req = store.put(mutation);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  // -- Processing -----------------------------------------------------------

  async processQueue(
    supabase: SupabaseClient<any>
  ): Promise<{ processed: number; failed: number }> {
    const mutations = await this.getAll();
    if (mutations.length === 0) return { processed: 0, failed: 0 };

    this.emit('sync-start');

    let processed = 0;
    let failed = 0;

    // Process in chronological order
    const sorted = mutations.sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    for (const mutation of sorted) {
      try {
        await this.executeMutation(supabase, mutation);
        await this.remove(mutation.id);
        processed++;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error';
        mutation.retry_count += 1;
        mutation.last_error = errorMessage;

        if (mutation.retry_count >= MAX_RETRIES) {
          this.emit('sync-error', {
            mutation,
            error: `Max retries reached: ${errorMessage}`,
          });
          // Leave in queue but mark as failed
          await this.update(mutation);
          failed++;
        } else {
          await this.update(mutation);
          failed++;
        }
      }
    }

    this.emit('sync-complete', { processed, failed });
    return { processed, failed };
  }

  private async executeMutation(
    supabase: SupabaseClient<any>,
    mutation: OfflineMutation
  ): Promise<void> {
    const { table, operation, data } = mutation;

    switch (operation) {
      case 'insert': {
        const { error } = await supabase
          .from(table as never)
          .insert(data as never);
        if (error) throw new Error(error.message);
        break;
      }
      case 'update': {
        const { id, ...rest } = data;
        const { error } = await supabase
          .from(table as never)
          .update(rest as never)
          .eq('id', id as string);
        if (error) throw new Error(error.message);
        break;
      }
      case 'delete': {
        const { error } = await supabase
          .from(table as never)
          .delete()
          .eq('id', data.id as string);
        if (error) throw new Error(error.message);
        break;
      }
    }
  }
}

export const offlineQueue = new OfflineQueueManager();
