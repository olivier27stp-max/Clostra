/**
 * Lume CRM Integration — Server-side only
 *
 * All calls to Lume go through this layer.
 * Never import this file from client components.
 */

import type {
  LumeCreatePayload,
  LumeCreateResponse,
  LumeCustomerSummary,
  LumeJobSummary,
  LumeApiError,
} from '@/types/lume';

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

function getConfig() {
  const baseUrl = process.env.LUME_API_BASE_URL;
  const apiKey = process.env.LUME_API_KEY;

  if (!baseUrl) throw new Error('LUME_API_BASE_URL is not configured');
  if (!apiKey) throw new Error('LUME_API_KEY is not configured');

  return { baseUrl: baseUrl.replace(/\/$/, ''), apiKey };
}

// ---------------------------------------------------------------------------
// HTTP helper
// ---------------------------------------------------------------------------

type LumeResult<T> = { data: T | null; error: LumeApiError | null };

async function lumeFetch<T>(path: string, options: RequestInit = {}): Promise<LumeResult<T>> {
  const { baseUrl, apiKey } = getConfig();

  try {
    const res = await fetch(`${baseUrl}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        ...options.headers,
      },
    });

    const body = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        data: null,
        error: {
          success: false,
          error_code: body.error_code || `HTTP_${res.status}`,
          message: body.message || `Request failed (${res.status})`,
        },
      };
    }

    return { data: body as T, error: null };
  } catch (err) {
    return {
      data: null,
      error: {
        success: false,
        error_code: 'NETWORK_ERROR',
        message: err instanceof Error ? err.message : 'Connection failed',
      },
    };
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function createCustomerAndJob(
  payload: LumeCreatePayload,
): Promise<LumeResult<LumeCreateResponse>> {
  return lumeFetch<LumeCreateResponse>('/api/integrations/clostra/create-customer-and-job', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getCustomer(customerId: string): Promise<LumeResult<LumeCustomerSummary>> {
  return lumeFetch<LumeCustomerSummary>(`/api/integrations/clostra/customers/${customerId}`);
}

export async function getJob(jobId: string): Promise<LumeResult<LumeJobSummary>> {
  return lumeFetch<LumeJobSummary>(`/api/integrations/clostra/jobs/${jobId}`);
}
