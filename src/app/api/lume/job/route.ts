import { NextRequest, NextResponse } from 'next/server';
import { getJob } from '@/lib/integrations/lume';

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
  }

  const { data, error } = await getJob(id);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 502 },
    );
  }

  return NextResponse.json(data);
}
