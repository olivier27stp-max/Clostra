'use client';

import { useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { offlineQueue, type OfflineMutation } from '@/lib/offline/queue';
import { useOfflineStore } from '@/lib/stores/offline-store';

/**
 * Hook for the offline mutation queue.
 *
 * Monitors online/offline status, enqueues mutations when offline,
 * and auto-processes the queue when the device comes back online.
 */
export function useOfflineQueue() {
  const {
    isOnline,
    setOnline,
    incrementPending,
    decrementPending,
    setSyncing,
    setLastSynced,
    addError,
    clearErrors,
  } = useOfflineStore();

  // Listen to browser online/offline events
  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [setOnline]);

  // Process queue when coming back online
  useEffect(() => {
    if (isOnline) {
      processQueue();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline]);

  // Listen to queue events
  useEffect(() => {
    const onSyncStart = () => {
      setSyncing(true);
      clearErrors();
    };
    const onSyncComplete = () => {
      setSyncing(false);
      setLastSynced(new Date().toISOString());
    };
    const onSyncError = (detail: unknown) => {
      const info = detail as { error?: string } | undefined;
      if (info?.error) addError(info.error);
    };

    offlineQueue.on('sync-start', onSyncStart);
    offlineQueue.on('sync-complete', onSyncComplete);
    offlineQueue.on('sync-error', onSyncError);

    return () => {
      offlineQueue.off('sync-start', onSyncStart);
      offlineQueue.off('sync-complete', onSyncComplete);
      offlineQueue.off('sync-error', onSyncError);
    };
  }, [setSyncing, setLastSynced, addError, clearErrors]);

  const enqueue = useCallback(
    async (
      mutation: Omit<
        OfflineMutation,
        'id' | 'created_at' | 'retry_count' | 'last_error'
      >
    ) => {
      await offlineQueue.enqueue(mutation);
      incrementPending();
    },
    [incrementPending]
  );

  const processQueue = useCallback(async () => {
    const supabase = createClient();
    const result = await offlineQueue.processQueue(supabase);
    // Decrement pending for each successfully processed mutation
    for (let i = 0; i < result.processed; i++) {
      decrementPending();
    }
    return result;
  }, [decrementPending]);

  const getQueueLength = useCallback(async () => {
    const all = await offlineQueue.getAll();
    return all.length;
  }, []);

  return {
    enqueue,
    processQueue,
    getQueueLength,
    isOnline,
  };
}
