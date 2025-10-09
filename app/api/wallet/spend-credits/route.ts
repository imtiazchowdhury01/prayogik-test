import { NextResponse } from 'next/server';
import { spendCreditsAction } from '@/services/wallet';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, amount, description, referenceId, referenceType, metadata } = body || {};
    if (!userId || typeof amount !== 'number') return NextResponse.json({ success: false, error: 'userId and amount are required' }, { status: 400 });
    const params = { userId, amount, description, referenceId, referenceType, metadata };
    const result = await spendCreditsAction(params as any);
    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (error) {
    console.error('spendCredits error', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
