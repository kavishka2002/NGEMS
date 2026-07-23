import { NextResponse } from "next/server";
import { getFirestoreClient } from "@/lib/firebaseAdmin";

export const runtime = "nodejs";

function normalizeString(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value);
  return "";
}

function normalizeCredential(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.trim().toLowerCase();
}

function isLaboratoryRole(role: string) {
  const normalized = role.toLowerCase();
  return normalized.includes("laboratory") || normalized.includes("lab");
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    let body: Record<string, unknown> = {};

    if (contentType.includes("application/json")) {
      body = await request.json();
    } else {
      const text = await request.text();
      if (text) {
        try {
          body = JSON.parse(text);
        } catch {
          body = Object.fromEntries(new URLSearchParams(text)) as Record<string, unknown>;
        }
      }
    }

    const hospitalId = normalizeString(body.hospitalId);
    const username = normalizeString(body.username);
    const password = normalizeString(body.password);

    if (!hospitalId || !username || !password) {
      return NextResponse.json(
        { success: false, error: "Hospital ID, username, and password are required." },
        { status: 400 }
      );
    }

    const db = getFirestoreClient();

    const hospitalSnapshot = await db
      .collection("hospitals")
      .where("hospitalId", "==", hospitalId)
      .limit(1)
      .get();

    if (!hospitalSnapshot.empty) {
      const hospitalData = hospitalSnapshot.docs[0].data();
      const adminUsername = normalizeCredential(hospitalData.adminUsername);
      const adminPassword = normalizeCredential(hospitalData.password);
      const role = normalizeString(hospitalData.role) || "Hospital Administrator";

      if (adminUsername === normalizeCredential(username) && adminPassword === normalizeCredential(password)) {
        if (!isLaboratoryRole(role)) {
          return NextResponse.json(
            { success: false, error: "This login is not authorized for the laboratory module." },
            { status: 403 }
          );
        }

        return NextResponse.json({
          success: true,
          hospitalId,
          hospitalName: normalizeString(hospitalData.hospitalName) || "Hospital",
          role,
          redirectPath: "/laboratory/dashboard",
        });
      }
    }

    const staffSnapshot = await db
      .collection("staff")
      .where("hospitalId", "==", hospitalId)
      .where("username", "==", username)
      .limit(1)
      .get();

    if (!staffSnapshot.empty) {
      const staffData = staffSnapshot.docs[0].data();
      const storedPassword = normalizeString(staffData.password);
      const role = normalizeString(staffData.role) || "Staff";

      if ((storedPassword && storedPassword === password) || normalizeCredential(staffData.password) === normalizeCredential(password)) {
        if (!isLaboratoryRole(role)) {
          return NextResponse.json(
            { success: false, error: "This login is not authorized for the laboratory module." },
            { status: 403 }
          );
        }

        return NextResponse.json({
          success: true,
          hospitalId,
          hospitalName: normalizeString(staffData.hospitalName) || "Hospital",
          role,
          redirectPath: "/laboratory/dashboard",
        });
      }
    }

    return NextResponse.json(
      { success: false, error: "Invalid Hospital ID, username, or password." },
      { status: 401 }
    );
  } catch (error) {
    console.error("Laboratory login failed", error);
    return NextResponse.json({ success: false, error: "Laboratory login failed." }, { status: 500 });
  }
}
