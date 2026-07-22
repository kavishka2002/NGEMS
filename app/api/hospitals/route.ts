import { NextResponse } from "next/server";
import { getFirestoreClient } from "@/lib/firebaseAdmin";

export const runtime = "nodejs";

function parseRequestBody(request: Request) {
  return (async (): Promise<Record<string, unknown>> => {
    const contentType = request.headers.get("content-type") ?? "";

    // Handle multipart form-data
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      return Object.fromEntries(
        formData.entries()
      ) as Record<string, unknown>;
    }

    // Read request body as text
    const text = await request.text();

    if (!text) {
      return {};
    }

    // Try normal JSON parsing
    try {
      const parsed = JSON.parse(text);

      if (
        parsed &&
        typeof parsed === "object" &&
        !Array.isArray(parsed)
      ) {
        return parsed as Record<string, unknown>;
      }
    } catch (error) {
      // Continue with fallback parsing
    }

    // Try to parse JS-style object literals
    try {
      const candidate = text
        .replace(
          /([,{]\s*)([A-Za-z0-9_]+)\s*:/g,
          '$1"$2":'
        )
        .replace(
          /:\s*([^",\[{\]\d\-\s][^,}\]]*)(?=[,}])/g,
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
    } catch (error) {
      // Continue with URL encoded parsing
    }

    // Try URL encoded data
    try {
      return Object.fromEntries(
        new URLSearchParams(text)
      ) as Record<string, unknown>;
    } catch (error) {
      return {};
    }
  })();
}

// GET - Find hospital by Hospital ID
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);

    const hospitalId = (
      url.searchParams.get("hospitalId") ?? ""
    ).trim();

    if (!hospitalId) {
      return NextResponse.json(
        {
          error: "Hospital ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    try {
      const firestore = getFirestoreClient();

      const querySnapshot = await firestore
        .collection("hospitals")
        .where("hospitalId", "==", hospitalId)
        .limit(1)
        .get();

      if (!querySnapshot.empty) {
        return NextResponse.json({
          success: true,
          hospital: querySnapshot.docs[0].data(),
        });
      }
    } catch (firestoreError) {
      console.error(
        "Firestore hospital lookup failed:",
        firestoreError
      );
    }

    return NextResponse.json(
      {
        error: "Hospital not found.",
      },
      {
        status: 404,
      }
    );
  } catch (error) {
    console.error(
      "Hospital lookup failed:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to load hospital record.",
      },
      {
        status: 500,
      }
    );
  }
}

// POST - Register new hospital
export async function POST(request: Request) {
  try {
    const body = await parseRequestBody(request);

    if (!body?.hospitalId || !body?.hospitalName) {
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

    try {
      const firestore = getFirestoreClient();

      const docRef = await firestore
        .collection("hospitals")
        .add(record);

      return NextResponse.json({
        success: true,
        id: docRef.id,
        hospitalId: body.hospitalId,
      });
    } catch (firestoreError) {
      console.error(
        "Firestore write failed:",
        firestoreError
      );

      return NextResponse.json(
        {
          error:
            "Failed to save hospital registration to database.",
        },
        {
          status: 500,
        }
      );
    }
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