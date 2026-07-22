import { NextResponse } from "next/server";
import { getFirestoreClient } from "@/lib/firebaseAdmin";

export const runtime = "nodejs";

function n(v: unknown){ return typeof v==='string'?v.trim():'' }
async function parseBody(request: Request){ const ct = request.headers.get('content-type')||''; if(ct.includes('application/json')) return request.json(); const t=await request.text(); if(!t) return {}; try{return JSON.parse(t);}catch{} const f=await request.formData(); return Object.fromEntries(f.entries()); }

export async function GET(request: Request){
  try{
    const url = new URL(request.url);
    const hospitalId = n(url.searchParams.get('hospitalId'));
    if(!hospitalId) return NextResponse.json({ success:false, error:'hospitalId required' }, { status:400 });
    const db = getFirestoreClient();
    const snap = await db.collection('labTests').where('hospitalId','==',hospitalId).get();
    const data = snap.docs.map(d=>({ id:d.id, ...d.data() }));
    return NextResponse.json({ success:true, data });
  }catch(err){ console.error(err); return NextResponse.json({ success:false, error:'Failed to load lab tests' }, { status:500 }); }
}

export async function POST(request: Request){
  try{
    const body = await parseBody(request);
    const hospitalId = n(body.hospitalId); const requestId = n(body.requestId);
    if(!hospitalId||!requestId) return NextResponse.json({ success:false, error:'hospitalId and requestId required' }, { status:400 });
    const db = getFirestoreClient();
    const now = new Date().toISOString();
    const rec = { hospitalId, requestId, results: body.results||null, status: 'Completed', completedAt: now, createdAt: now, updatedAt: now };
    const doc = await db.collection('labTests').add(rec);
    // optionally mark lab request as completed
    try{ await db.collection('labRequests').doc(requestId).update({ status: 'Completed', updatedAt: now }); }catch{}
    return NextResponse.json({ success:true, id:doc.id, test:{ id:doc.id, ...rec } }, { status:201 });
  }catch(err){ console.error(err); return NextResponse.json({ success:false, error:'Failed to record lab test' }, { status:500 }); }
}
