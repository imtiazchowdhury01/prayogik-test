import { NextResponse } from 'next/server';
import { addCreditsAction } from '@/services/wallet';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, amount, type, description, source, sourceReferenceId, expiresInMonths, metadata } = body || {};
    if (!userId || typeof amount !== 'number' || !type) return NextResponse.json({ success: false, error: 'userId, amount and type are required' }, { status: 400 });
    const params = { userId, amount, type, description, source, sourceReferenceId, expiresInMonths, metadata };
    const result = await addCreditsAction(params as any);
    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (error) {
    console.error('addCredits error', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
