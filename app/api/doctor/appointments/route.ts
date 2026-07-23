import { NextResponse } from 'next/server';
import { appointments } from '@/lib/data';

export function GET() {
  return NextResponse.json({ appointments });
}
