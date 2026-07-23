import { NextResponse } from 'next/server';
import { queue } from '@/lib/data';

export function GET() {
  return NextResponse.json({ queue });
}
