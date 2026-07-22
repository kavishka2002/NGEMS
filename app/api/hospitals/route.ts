import { NextResponse } from "next/server";
import { getFirestoreClient } from "@/lib/firebaseAdmin";

export const runtime = "nodejs";

async function parseRequestBody(
  request: Request
): Promise<Record<string, unknown>> {
  const contentType = request.headers.get("content-type") ?? "";

  // Handle multipart form-data
  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    return Object.fromEntries(formData.entries()) as Record<string, unknown>;
  }

  // Read body once
  const text = await request.text();

  try {
    console.debug("[api/hospitals] content-type:", contentType);
    console.debug("[api/hospitals] body length:", text.length);
  } catch {}

  if (!text) return {};

  try {
    const parsed = JSON.parse(text);

    if (
      parsed &&
      typeof parsed === "object" &&
      !Array.isArray(parsed)
    ) {
      return parsed as Record<string, unknown>;
    }
  } catch {
    // Try to convert JS object literal into JSON
    try {
      const candidate = text
        .replace(/([,{]\s*)([A-Za-z0-9_]+)\s*:/g, '$1"$2":')
        .replace(
          /:\s*([^",\[\{\]\d\-\s][^,}\]]*)(?=[,}])/g,
          ':"$1"'
        );

      const parsed = JSON.parse(candidate);

      if (
        parsed &&
        typeof parsed === "object" &&
        !Array.isArray(parsed)
      ) {
        return parsed as Record<string, unknown>;
      }
    } catch {}

    // Try URL encoded form
    try {
      return Object.fromEntries(
        new URLSearchParams(text)
      ) as Record<string, unknown>;
    } catch {
      return {};
    }
  }

  return {};
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const hospitalId =
      url.searchParams.get("hospitalId")?.trim() ?? "";

    if (!hospitalId) {
      return NextResponse.json(
        { error: "Hospital ID is required." },
        { status: 400 }
      );
    }

    const firestore = getFirestoreClient();

    const snapshot = await firestore
      .collection("hospitals")
      .where("hospitalId", "==", hospitalId)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return NextResponse.json(
        { error: "Hospital not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      hospital: snapshot.docs[0].data(),
    });
  } catch (error) {
    console.error("Hospital lookup failed:", error);

    return NextResponse.json(
      { error: "Failed to load hospital record." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await parseRequestBody(request);

    if (!body.hospitalId || !body.hospitalName) {
      return NextResponse.json(
        {
          error:
            "Hospital ID and hospital name are required.",
        },
        {
          status: 400,
        }
      );
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
      createdAt:
        body.createdAt || new Date().toISOString(),
    };

    const firestore = getFirestoreClient();

    const docRef = await firestore
      .collection("hospitals")
      .add(record);

    return NextResponse.json({
      success: true,
      id: docRef.id,
      hospitalId: body.hospitalId,
    });
  } catch (error) {
    console.error(
      "Hospital registration save failed:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to save hospital registration.",
      },
      {
        status: 500,
      }
    );
  }
}