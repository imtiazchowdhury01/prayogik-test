import { NextResponse } from 'next/server';
import { createWalletAction } from '@/services/wallet';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId } = body;
    if (!userId) return NextResponse.json({ success: false, error: 'userId required' }, { status: 400 });
    const result = await createWalletAction(userId);
    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (error) {
    console.error('createWallet error', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
