import { NextResponse } from 'next/server';
import { admissions } from '@/lib/data';

export function GET() {
  return NextResponse.json({ admissions });
}
