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

const firestore = getFirestore();
const localHospitals: Array<Record<string, unknown>> = [];

function parseRequestBody(request: Request) {
  return (async (): Promise<Record<string, unknown>> => {
    const contentType = request.headers.get("content-type") ?? "";
    const body: Record<string, unknown> = {};

    if (contentType.includes("application/json")) {
      try {
        const parsed = await request.json();
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
          return parsed as Record<string, unknown>;
        }
      } catch {
        // fall back to text parsing if json() fails
      }
    }

    const text = await request.text();
    if (text) {
      try {
        const parsed = JSON.parse(text);
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
          return parsed as Record<string, unknown>;
        }
      } catch {
        return Object.fromEntries(new URLSearchParams(text)) as Record<string, unknown>;
      }
    }

    const formData = await request.formData();
    return Object.fromEntries(formData.entries()) as Record<string, unknown>;
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

    try {
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
