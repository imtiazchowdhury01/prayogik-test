import { NextResponse } from 'next/server';
import { getPurchaseHistoryAction } from '@/services/wallet';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');
    const limit = url.searchParams.get('limit') ? Number(url.searchParams.get('limit')) : undefined;
    const offset = url.searchParams.get('offset') ? Number(url.searchParams.get('offset')) : undefined;
    if (!userId) return NextResponse.json({ success: false, error: 'userId required' }, { status: 400 });
    const result = await getPurchaseHistoryAction(userId, { limit, offset });
    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (error) {
    console.error('getPurchaseHistory error', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
