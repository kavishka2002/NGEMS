import { NextResponse } from 'next/server';
import { doctorProfile } from '@/lib/data';

export function GET() {
  return NextResponse.json({ doctorProfile });
}
