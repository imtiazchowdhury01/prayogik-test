import { NextResponse } from 'next/server';
import { calculateOrderCreditsAction } from '@/services/wallet';

export async function POST(req: Request) {
  try {
    const { userId, orderTotalTk } = await req.json();
    if (!userId || typeof orderTotalTk !== 'number') return NextResponse.json({ success: false, error: 'userId and orderTotalTk required' }, { status: 400 });
    const result = await calculateOrderCreditsAction(userId, orderTotalTk);
    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (error) {
    console.error('calculateOrderCredits error', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
