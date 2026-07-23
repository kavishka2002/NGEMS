import { NextResponse } from 'next/server';
import { schedule } from '@/lib/data';

export function GET() {
  return NextResponse.json({ schedule });
}
