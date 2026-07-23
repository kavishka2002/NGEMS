import { NextResponse } from "next/server";
import { getFirestoreClient } from "@/lib/firebaseAdmin";

export const runtime = "nodejs";

function normalizeString(v: unknown): string { return typeof v === 'string' ? v.trim() : ''; }
function normalizeNumber(v: unknown, fallback = 0): number {
  const value = Number(v);
  return Number.isFinite(value) && value >= 0 ? value : fallback;
}

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
    const items = snapshot.docs.map(d => {
      const data = d.data();
      return { id: d.id, ...data, minStock: normalizeNumber(data.minStock ?? data.minQty) };
    });
    return NextResponse.json({ success:true, data: items });
  } catch (err) { console.error(err); return NextResponse.json({ success:false, error:'Failed to load inventory' }, { status:500 }); }
}

export async function POST(request: Request) {
  try {
    const body = await parseBody(request);
    const hospitalId = normalizeString(body.hospitalId);
    const name = normalizeString(body.name);
    const quantity = normalizeNumber(body.quantity);
    const minStock = normalizeNumber(body.minStock ?? body.minQty);
    const unit = normalizeString(body.unit);
    const expiryDate = normalizeString(body.expiryDate);
    const price = normalizeNumber(body.price);
    if (!hospitalId || !name) return NextResponse.json({ success:false, error:'hospitalId and name required'}, { status:400 });
    const db = getFirestoreClient();
    const now = new Date().toISOString();
    const rec = { hospitalId, name, quantity, minStock, unit, price, expiryDate, createdAt: now, updatedAt: now };
    const docRef = await db.collection('inventory').add(rec);
    await db.collection('pharmacyTransactions').add({
      hospitalId, medicineId: docRef.id, medicineName: name, type: 'added', quantity, unit,
      reason: 'Inventory item created', operator: normalizeString(body.operator) || 'System', timestamp: now,
    });
    return NextResponse.json({ success:true, id: docRef.id, item: { id: docRef.id, ...rec } }, { status:201 });
  } catch (err) { console.error(err); return NextResponse.json({ success:false, error:'Failed to add inventory' }, { status:500 }); }
}

export async function PUT(request: Request) {
  try {
    const body = await parseBody(request);
    const id = normalizeString(body.id);
    if (!id) return NextResponse.json({ success:false, error:'id required'}, { status:400 });
    const updates: any = {
      name: normalizeString(body.name),
      quantity: normalizeNumber(body.quantity),
      minStock: normalizeNumber(body.minStock ?? body.minQty),
      unit: normalizeString(body.unit),
      price: normalizeNumber(body.price),
      expiryDate: normalizeString(body.expiryDate),
      updatedAt: new Date().toISOString(),
    };
    delete updates.id;
    const db = getFirestoreClient();
    const docRef = db.collection('inventory').doc(id);
    const existing = await docRef.get();
    const existingData = existing.data();
    if (!existing.exists || existingData?.hospitalId !== normalizeString(body.hospitalId)) {
      return NextResponse.json({ success:false, error:'Inventory item not found' }, { status:404 });
    }
    await docRef.update(updates);
    await db.collection('pharmacyTransactions').add({
      hospitalId: normalizeString(body.hospitalId), medicineId: id, medicineName: updates.name,
      type: 'adjusted', quantity: updates.quantity, unit: updates.unit, reason: 'Inventory item updated',
      operator: normalizeString(body.operator) || 'System', timestamp: updates.updatedAt,
      previousQuantity: normalizeNumber(existingData?.quantity),
    });
    return NextResponse.json({ success:true });
  } catch (err) { console.error(err); return NextResponse.json({ success:false, error:'Failed to update inventory' }, { status:500 }); }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = normalizeString(url.searchParams.get('id'));
    const hospitalId = normalizeString(url.searchParams.get('hospitalId'));
    if (!id || !hospitalId) return NextResponse.json({ success:false, error:'id and hospitalId required' }, { status:400 });
    const db = getFirestoreClient();
    const docRef = db.collection('inventory').doc(id);
    const existing = await docRef.get();
    if (!existing.exists || existing.data()?.hospitalId !== hospitalId) {
      return NextResponse.json({ success:false, error:'Inventory item not found' }, { status:404 });
    }
    await docRef.delete();
    await db.collection('pharmacyTransactions').add({
      hospitalId, medicineId: id, medicineName: normalizeString(existing.data()?.name), type: 'deleted',
      quantity: normalizeNumber(existing.data()?.quantity), unit: normalizeString(existing.data()?.unit),
      reason: 'Inventory item deleted', operator: 'System', timestamp: new Date().toISOString(),
    });
    return NextResponse.json({ success:true });
  } catch (err) { console.error(err); return NextResponse.json({ success:false, error:'Failed to delete inventory item' }, { status:500 }); }
}
