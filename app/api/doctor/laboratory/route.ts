import { NextResponse } from 'next/server';
import { laboratoryTests } from '@/lib/data';

export function GET() {
  return NextResponse.json({ laboratoryTests });
}
