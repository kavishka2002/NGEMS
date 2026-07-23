import { NextResponse } from 'next/server';
import { radiologyReports } from '@/lib/data';

export function GET() {
  return NextResponse.json({ radiologyReports });
}
