import { NextResponse } from 'next/server';
import { referrals } from '@/lib/data';

export function GET() {
  return NextResponse.json({ referrals });
}
