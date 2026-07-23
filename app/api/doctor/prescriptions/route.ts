import { NextResponse } from 'next/server';
import { prescriptions } from '@/lib/data';

export function GET() {
  return NextResponse.json({ prescriptions });
}
