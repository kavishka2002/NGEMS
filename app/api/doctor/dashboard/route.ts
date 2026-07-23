import { NextResponse } from 'next/server';
import { doctor, notifications, schedule, overviewStats, todaysActivity, patientTrend, monthlyAdmissions, medicineUsage, diseaseStats } from '@/lib/data';

export function GET() {
  return NextResponse.json({ doctor, notifications, schedule, overviewStats, todaysActivity, patientTrend, monthlyAdmissions, medicineUsage, diseaseStats });
}
