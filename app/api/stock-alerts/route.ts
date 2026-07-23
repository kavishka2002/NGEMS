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
    const snapshot = await db.collection('inventory').where('hospitalId','==',hospitalId).get();
    const alerts = snapshot.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .filter(i => (i.quantity || 0) <= (i.minStock ?? i.minQty ?? 0));
    return NextResponse.json({ success:true, data: alerts });
  } catch (err) { console.error(err); return NextResponse.json({ success:false, error:'Failed to load stock alerts' }, { status:500 }); }
}
