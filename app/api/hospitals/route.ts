import { NextResponse } from "next/server";
import { getFirestoreClient } from "@/lib/firebaseAdmin";

export const runtime = "nodejs";

const localHospitals: Array<Record<string, unknown>> = [];

function parseRequestBody(request: Request) {
  return (async (): Promise<Record<string, unknown>> => {
    const contentType = request.headers.get("content-type") ?? "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      return Object.fromEntries(formData.entries()) as Record<string, unknown>;
    }

    const text = await request.text();
    if (!text) return {};

    try {
      const parsed = JSON.parse(text);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        return parsed as Record<string, unknown>;
      }
    } catch (e) {
      try {
        let candidate = text
          .replace(/([,{]\s*)([A-Za-z0-9_]+)\s*:/g, '$1"$2":')
          .replace(/:\s*([^\",\[{\]\d\-\s][^,}\]]*)(?=[,}])/g, ':"$1"');
        const parsed2 = JSON.parse(candidate);
        if (parsed2 && typeof parsed2 === "object" && !Array.isArray(parsed2)) {
          return parsed2 as Record<string, unknown>;
        }
      } catch (e2) {
        // fall through to urlencoded parse
      }

      try {
        return Object.fromEntries(new URLSearchParams(text)) as Record<string, unknown>;
      } catch (e2) {
        return {};
      }
    }
    return {};
  })();
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const hospitalId = (url.searchParams.get("hospitalId") ?? "").trim();

    if (!hospitalId) {
      return NextResponse.json({ error: "Hospital ID is required." }, { status: 400 });
    }

    try {
      const firestore = getFirestoreClient();
      const querySnapshot = await firestore
        .collection("hospitals")
        .where("hospitalId", "==", hospitalId)
        .limit(1)
        .get();

      if (!querySnapshot.empty) {
        return NextResponse.json({ success: true, hospital: querySnapshot.docs[0].data() });
      }
    } catch (firestoreError) {
      console.error("Firestore hospital lookup failed", firestoreError);
    }

    const fallbackRecord = localHospitals.find((record) => record.hospitalId === hospitalId);
    if (fallbackRecord) {
      return NextResponse.json({ success: true, hospital: fallbackRecord });
    }

    return NextResponse.json({ error: "Hospital not found." }, { status: 404 });
  } catch (error) {
    console.error("Hospital lookup failed", error);
    return NextResponse.json({ error: "Failed to load hospital record." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await parseRequestBody(request);

    if (!body?.hospitalId || !body?.hospitalName) {
      return NextResponse.json({ error: "Hospital ID and hospital name are required." }, { status: 400 });
    }

    const record = {
      hospitalId: body.hospitalId,
      hospitalName: body.hospitalName,
      hospitalType: body.hospitalType || "",
      province: body.province || "",
      district: body.district || "",
      address: body.address || "",
      contactNumber: body.contactNumber || "",
      email: body.email || "",
      adminName: body.adminName || "",
      adminUsername: body.adminUsername || "",
      password: body.password || "",
      bedCapacity: body.bedCapacity || "",
      specialtyServices: body.specialtyServices || "",
      additionalNotes: body.additionalNotes || "",
      createdAt: body.createdAt || new Date().toISOString(),
    };

    try {
      const firestore = getFirestoreClient();
      const docRef = await firestore.collection("hospitals").add(record);
      return NextResponse.json({ success: true, id: docRef.id, hospitalId: body.hospitalId });
    } catch (firestoreError) {
      console.error("Firestore write failed, falling back to local storage", firestoreError);
      localHospitals.push(record);
      return NextResponse.json({ success: true, id: localHospitals.length, hospitalId: body.hospitalId, fallback: true });
    }
  } catch (error) {
    console.error("Hospital registration save failed", error);
    return NextResponse.json({ error: "Failed to save hospital registration." }, { status: 500 });
  }
}
