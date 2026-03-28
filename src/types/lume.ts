// ---------------------------------------------------------------------------
// Lume Integration Types
// Aligned with Lume's /api/integrations/clostra/* endpoints
// ---------------------------------------------------------------------------

/** Status of a pin's Lume linkage */
export type LumeStatus = 'not_created' | 'creating' | 'created' | 'failed';

/** Fields Clostra stores as lightweight references to Lume */
export interface LumeReference {
  lume_customer_id: string | null;
  lume_job_id: string | null;
  lume_status: LumeStatus;
  lume_synced_at: string | null;
  lume_error_message: string | null;
}

// ---------------------------------------------------------------------------
// CREATE — POST /api/integrations/clostra/create-customer-and-job
// ---------------------------------------------------------------------------

/** Payload Clostra sends to Lume — matches Lume's expected format exactly */
export interface LumeCreatePayload {
  rep_id: string;
  source_pin_id: string;
  source_status: 'closed_won';
  customer: {
    full_name: string;
    phone: string;
    email: string;
    street_address: string;
    city: string;
    province: string;
    postal_code: string;
  };
  job: {
    service_type: string;
    requested_date: string;
    estimated_value: number | null;
    internal_notes: string;
  };
}

/** Response from Lume after successful creation */
export interface LumeCreateResponse {
  success: true;
  customer_id: string;
  job_id: string;
  customer_created: boolean;
  reused_existing_customer: boolean;
  customer_summary: {
    name: string;
    phone: string;
    address: string;
  };
  job_summary: {
    service_type: string;
    scheduled_date: string;
    status: string;
  };
  lume_url: string;
}

// ---------------------------------------------------------------------------
// READ — GET /api/integrations/clostra/customers/[id]
// ---------------------------------------------------------------------------

export interface LumeCustomerSummary {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  address: string;
  created_at: string;
  updated_at: string;
  lume_url: string;
}

// ---------------------------------------------------------------------------
// READ — GET /api/integrations/clostra/jobs/[id]
// ---------------------------------------------------------------------------

export interface LumeJobSummary {
  id: string;
  service_type: string;
  requested_date: string;
  scheduled_date: string;
  job_status: string;
  estimated_value: number | null;
  customer_id: string;
  lume_url: string;
}

// ---------------------------------------------------------------------------
// Error
// ---------------------------------------------------------------------------

export interface LumeApiError {
  success: false;
  error_code: string;
  message: string;
}

/** Combined customer + job view for the pin detail UI */
export interface LumePinDetail {
  customer: LumeCustomerSummary | null;
  job: LumeJobSummary | null;
  status: LumeStatus;
  error: string | null;
}
