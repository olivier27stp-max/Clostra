'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';

type PostgresEvent = 'INSERT' | 'UPDATE' | 'DELETE' | '*';

interface UseRealtimeOptions<T> {
  /** The Supabase table to subscribe to. */
  table: string;
  /** Schema, defaults to 'public'. */
  schema?: string;
  /** Which events to listen for. Defaults to '*' (all). */
  event?: PostgresEvent;
  /** Optional filter string, e.g. "profile_id=eq.abc123". */
  filter?: string;
  /** Initial data to start with before any events arrive. */
  initialData?: T[];
  /** Called on each event. Return the new data array. */
  onEvent?: (
    payload: RealtimePostgresChangesPayload<Record<string, unknown>>,
    current: T[]
  ) => T[];
}

/**
 * Generic hook for subscribing to Supabase realtime Postgres changes.
 *
 * Returns a reactive `data` array that is updated on each matching event.
 * The channel is automatically cleaned up on unmount.
 */
export function useRealtime<T extends { id?: string }>(
  options: UseRealtimeOptions<T>
) {
  const {
    table,
    schema = 'public',
    event = '*',
    filter,
    initialData = [],
    onEvent,
  } = options;

  const [data, setData] = useState<T[]>(initialData);
  const channelRef = useRef<RealtimeChannel | null>(null);

  // Default event handler: merge inserts, update in place, remove deletes
  const defaultHandler = useCallback(
    (
      payload: RealtimePostgresChangesPayload<Record<string, unknown>>,
      current: T[]
    ): T[] => {
      const record = payload.new as T | undefined;
      const old = payload.old as { id?: string } | undefined;

      switch (payload.eventType) {
        case 'INSERT':
          return record ? [...current, record] : current;
        case 'UPDATE':
          return record
            ? current.map((item) =>
                item.id === (record as { id?: string }).id ? record : item
              )
            : current;
        case 'DELETE':
          return old?.id
            ? current.filter((item) => item.id !== old.id)
            : current;
        default:
          return current;
      }
    },
    []
  );

  useEffect(() => {
    const supabase = createClient();

    const channelConfig: Record<string, string> = {
      event,
      schema,
      table,
    };
    if (filter) {
      channelConfig.filter = filter;
    }

    const channel = supabase
      .channel(`realtime:${table}:${filter ?? 'all'}`)
      .on(
        'postgres_changes' as never,
        channelConfig as never,
        (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => {
          setData((current) =>
            onEvent
              ? onEvent(payload, current)
              : defaultHandler(payload, current)
          );
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      channel.unsubscribe();
      channelRef.current = null;
    };
  }, [table, schema, event, filter, onEvent, defaultHandler]);

  return { data, setData };
}
