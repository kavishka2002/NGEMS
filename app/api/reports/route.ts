import { NextResponse } from "next/server";
import { getFirestoreClient } from "@/lib/firebaseAdmin";

export const runtime = "nodejs";

function normalizeString(v: unknown): string { return typeof v === 'string' ? v.trim() : ''; }

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const hospitalId = normalizeString(url.searchParams.get('hospitalId'));
    if (!hospitalId) return NextResponse.json({ success:false, error:'hospitalId required' }, { status:400 });
    const db = getFirestoreClient();

    // Simple summary report: counts
    const [presSnap, dispSnap, invSnap, prescSnap] = await Promise.all([
      db.collection('prescriptions').where('hospitalId','==',hospitalId).get(),
      db.collection('dispensing').where('hospitalId','==',hospitalId).get(),
      db.collection('inventory').where('hospitalId','==',hospitalId).get(),
      db.collection('patients').where('hospitalId','==',hospitalId).get(),
    ]);

    const report = {
      prescriptions: presSnap.size,
      dispensings: dispSnap.size,
      inventoryItems: invSnap.size,
      patients: prescSnap.size,
    };

    return NextResponse.json({ success:true, report });
  } catch (err) { console.error(err); return NextResponse.json({ success:false, error:'Failed to generate report' }, { status:500 }); }
}
