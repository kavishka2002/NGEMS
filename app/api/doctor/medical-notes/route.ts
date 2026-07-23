import { NextResponse } from 'next/server';
import { medicalNotes } from '@/lib/data';

export function GET() {
  return NextResponse.json({ medicalNotes });
}
