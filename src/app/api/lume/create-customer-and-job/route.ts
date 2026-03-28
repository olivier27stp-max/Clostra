import { NextRequest, NextResponse } from 'next/server';
import { createCustomerAndJob } from '@/lib/integrations/lume';
import type { LumeCreatePayload } from '@/types/lume';

export async function POST(request: NextRequest) {
  let body: LumeCreatePayload;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  // Validate required fields
  if (!body.source_pin_id || !body.customer || !body.job) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const { customer, job } = body;

  if (!customer.full_name?.trim()) {
    return NextResponse.json({ error: 'Le nom est requis' }, { status: 400 });
  }
  if (!customer.phone?.trim()) {
    return NextResponse.json({ error: 'Le téléphone est requis' }, { status: 400 });
  }
  if (!customer.street_address?.trim()) {
    return NextResponse.json({ error: "L'adresse est requise" }, { status: 400 });
  }
  if (!job.service_type?.trim()) {
    return NextResponse.json({ error: 'Le type de service est requis' }, { status: 400 });
  }

  const { data, error } = await createCustomerAndJob(body);

  if (error) {
    return NextResponse.json(
      { error: error.message, error_code: error.error_code },
      { status: 502 },
    );
  }

  return NextResponse.json(data);
}
