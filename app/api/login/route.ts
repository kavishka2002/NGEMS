import { NextResponse } from "next/server";
import { existsSync, readFileSync } from "fs";
import * as path from "path";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

export const runtime = "nodejs";

const serviceAccountPath =
  process.env.FIREBASE_SERVICE_ACCOUNT_PATH ||
  path.join(process.cwd(), "ngems-62de5-firebase-adminsdk-fbsvc-338326775c.json");

if (!getApps().length) {
  if (existsSync(serviceAccountPath)) {
    const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf8"));
    initializeApp({
      credential: cert(serviceAccount),
      projectId: serviceAccount.project_id || process.env.FIREBASE_PROJECT_ID,
    });
  } else if (
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY
  ) {
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

async function parseRequestBody(request: Request): Promise<Record<string, unknown>> {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    try {
      const json = await request.json();
      if (json && typeof json === "object" && !Array.isArray(json)) {
        return json as Record<string, unknown>;
      }
    } catch {
      // fall back to text parsing
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
}

function normalizeString(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value);
  return "";
}

export async function POST(request: Request) {
  try {
    const body = await parseRequestBody(request);
    const hospitalId = normalizeString(body.hospitalId);
    const username = normalizeString(body.username);
    const password = normalizeString(body.password);

    if (!hospitalId || !username || !password) {
      return NextResponse.json(
        { error: "Hospital ID, username, and password are required." },
        { status: 400 }
      );
    }

    let userRecord: Record<string, unknown> | null = null;

    try {
      const querySnapshot = await firestore
        .collection("hospitals")
        .where("hospitalId", "==", hospitalId)
        .where("adminUsername", "==", username)
        .where("password", "==", password)
        .limit(1)
        .get();

      if (!querySnapshot.empty) {
        userRecord = querySnapshot.docs[0].data();
      }
    } catch (firestoreError) {
      console.error("Firestore login lookup failed", firestoreError);
    }

    if (!userRecord) {
      userRecord = localHospitals.find(
        (record) =>
          normalizeString(record.hospitalId) === hospitalId &&
          normalizeString(record.adminUsername) === username &&
          normalizeString(record.password) === password
      ) || null;
    }

    if (!userRecord) {
      return NextResponse.json(
        { error: "Invalid Hospital ID, username, or password." },
        { status: 401 }
      );
    }

    const role = normalizeString(userRecord.role) ||
      (username === "admin" ? "Administrator" : "Hospital User");

    return NextResponse.json({
      success: true,
      hospitalId,
      username,
      role,
    });
  } catch (error) {
    console.error("Hospital login failed", error);
    return NextResponse.json({ error: "Hospital login failed." }, { status: 500 });
  }
}
