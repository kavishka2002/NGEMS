import { NextResponse } from 'next/server';
import { notifications } from '@/lib/data';

export function GET() {
  return NextResponse.json({ notifications });
}
