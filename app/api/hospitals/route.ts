import { NextResponse } from "next/server";
import { existsSync, readFileSync } from "fs";
import * as path from "path";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

export const runtime = "nodejs";

const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || path.join(process.cwd(), "ngems-62de5-firebase-adminsdk-fbsvc-338326775c.json");

if (!getApps().length) {
  if (existsSync(serviceAccountPath)) {
    const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf8"));
    initializeApp({
      credential: cert(serviceAccount),
      projectId: serviceAccount.project_id || process.env.FIREBASE_PROJECT_ID,
    });
  } else if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      }),
    });
  }
}

let firestore: ReturnType<typeof getFirestore> | null = null;
const localHospitals: Array<Record<string, unknown>> = [];

if (getApps().length) {
  try {
    firestore = getFirestore();
  } catch (err) {
    console.error("Failed to initialize Firestore despite firebase app existing:", err);
    firestore = null;
  }
} else {
  console.warn("Firebase admin not initialized; Firestore unavailable — using local fallback.");
}

function parseRequestBody(request: Request) {
  return (async (): Promise<Record<string, unknown>> => {
    const contentType = request.headers.get("content-type") ?? "";

    // For multipart form-data we must use formData() and must not read text()
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      return Object.fromEntries(formData.entries()) as Record<string, unknown>;
    }

    // Read the body as text exactly once, then attempt to parse
    const text = await request.text();
    // Debug logging to help diagnose unexpected empty bodies in dev
    try {
      console.debug("[api/hospitals] content-type:", contentType);
      console.debug("[api/hospitals] body text length:", text?.length ?? 0);
      console.debug("[api/hospitals] body text (truncated):", text ? text.substring(0, 1000) : "")
    } catch (e) {
      /* ignore logging errors */
    }
    if (!text) return {};

    try {
      const parsed = JSON.parse(text);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        return parsed as Record<string, unknown>;
      }
    } catch (e) {
      // not JSON — try to coerce common JS-style object literals like
      // {hospitalId:TEST-999,hospitalName:Test Clinic} into valid JSON
      try {
        let candidate = text
          .replace(/([,{]\s*)([A-Za-z0-9_]+)\s*:/g, '$1"$2":')
          .replace(/:\s*([^",\[{\]\d\-\s][^,}\]]*)(?=[,}])/g, ':"$1"');
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

    if (firestore) {
      try {
        const docRef = await firestore.collection("hospitals").add(record);
        return NextResponse.json({ success: true, id: docRef.id, hospitalId: body.hospitalId });
      } catch (firestoreError) {
        console.error("Firestore write failed, falling back to local storage", firestoreError);
        localHospitals.push(record);
        return NextResponse.json({ success: true, id: localHospitals.length, hospitalId: body.hospitalId, fallback: true });
      }
    } else {
      // Firestore not available; persist in-memory for local development
      localHospitals.push(record);
      return NextResponse.json({ success: true, id: localHospitals.length, hospitalId: body.hospitalId, fallback: true });
    }
  } catch (error) {
    console.error("Hospital registration save failed", error);
    return NextResponse.json({ error: "Failed to save hospital registration." }, { status: 500 });
  }
}
