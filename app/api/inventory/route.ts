import { NextResponse } from "next/server";
import { getFirestoreClient } from "@/lib/firebaseAdmin";

export const runtime = "nodejs";

function normalizeString(v: unknown): string { return typeof v === 'string' ? v.trim() : ''; }

async function parseBody(request: Request) {
  const ct = request.headers.get('content-type') || '';
  if (ct.includes('application/json')) return request.json();
  const t = await request.text(); if (!t) return {};
  try { return JSON.parse(t); } catch {}
  const f = await request.formData(); return Object.fromEntries(f.entries());
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const hospitalId = normalizeString(url.searchParams.get('hospitalId'));
    if (!hospitalId) return NextResponse.json({ success:false, error: 'hospitalId required' }, { status:400 });
    const db = getFirestoreClient();
    const snapshot = await db.collection('inventory').where('hospitalId','==',hospitalId).get();
    const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    return NextResponse.json({ success:true, data: items });
  } catch (err) { console.error(err); return NextResponse.json({ success:false, error:'Failed to load inventory' }, { status:500 }); }
}

export async function POST(request: Request) {
  try {
    const body = await parseBody(request);
    const hospitalId = normalizeString(body.hospitalId);
    const name = normalizeString(body.name);
    const quantity = Number(body.quantity || 0);
    const minQty = Number(body.minQty || 0);
    if (!hospitalId || !name) return NextResponse.json({ success:false, error:'hospitalId and name required'}, { status:400 });
    const db = getFirestoreClient();
    const now = new Date().toISOString();
    const rec = { hospitalId, name, quantity, minQty, createdAt: now, updatedAt: now };
    const docRef = await db.collection('inventory').add(rec);
    return NextResponse.json({ success:true, id: docRef.id, item: { id: docRef.id, ...rec } }, { status:201 });
  } catch (err) { console.error(err); return NextResponse.json({ success:false, error:'Failed to add inventory' }, { status:500 }); }
}

export async function PUT(request: Request) {
  try {
    const body = await parseBody(request);
    const id = normalizeString(body.id);
    if (!id) return NextResponse.json({ success:false, error:'id required'}, { status:400 });
    const updates: any = { ...(body || {}), updatedAt: new Date().toISOString() };
    delete updates.id;
    const db = getFirestoreClient();
    await db.collection('inventory').doc(id).update(updates);
    return NextResponse.json({ success:true });
  } catch (err) { console.error(err); return NextResponse.json({ success:false, error:'Failed to update inventory' }, { status:500 }); }
}
