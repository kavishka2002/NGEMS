import { NextResponse } from 'next/server';
import { patients } from '@/lib/data';

export function GET() {
  return NextResponse.json({ patients });
}
