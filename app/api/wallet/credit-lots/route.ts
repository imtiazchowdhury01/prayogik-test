
import { NextResponse } from 'next/server';
import { getCreditLotsForUser } from '@/services/wallet';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');
    const startDate = url.searchParams.get('startDate') ? new Date(url.searchParams.get('startDate') as string) : undefined;
    const endDate = url.searchParams.get('endDate') ? new Date(url.searchParams.get('endDate') as string) : undefined;
    const limit = url.searchParams.get('limit') ? Number(url.searchParams.get('limit')) : undefined;
    const offset = url.searchParams.get('offset') ? Number(url.searchParams.get('offset')) : undefined;
    if (!userId) return NextResponse.json({ success: false, error: 'userId required' }, { status: 400 });
    const result = await getCreditLotsForUser(userId, { startDate, endDate, limit, offset });
    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (error) {
    console.error('getCreditLotsForUser error', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
