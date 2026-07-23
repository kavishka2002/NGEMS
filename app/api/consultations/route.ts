import { NextResponse } from "next/server";
import { getFirestoreClient } from "@/lib/firebaseAdmin";

export const runtime = "nodejs";

function normalizeString(value: unknown): string {
    if (typeof value !== "string") {
        return "";
    }
    return value.trim();
}

async function parseRequestBody(request: Request): Promise<Record<string, unknown>> {
    const contentType = request.headers.get("content-type") ?? "";

    if (contentType.includes("application/json")) {
        return request.json();
    }

    const text = await request.text();
    if (!text) {
        return {};
    }

    try {
        const parsed = JSON.parse(text);
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
            return parsed as Record<string, unknown>;
        }
    } catch {
        // continue
    }

    const formData = await request.formData();
    return Object.fromEntries(formData.entries()) as Record<string, unknown>;
}

export async function POST(request: Request) {
    try {
        const body = await parseRequestBody(request);

        const hospitalId = normalizeString(body.hospitalId);
        const hospitalName = normalizeString(body.hospitalName);
        const patientId = normalizeString(body.patientId);
        const patientName = normalizeString(body.patientName);
        const patientNic = normalizeString(body.patientNic);
        const mobile = normalizeString(body.mobile);
        const department = normalizeString(body.department);
        const doctor = normalizeString(body.doctor);
        const consultationType = normalizeString(body.consultationType);
        const symptoms = normalizeString(body.symptoms);
        const consultedAt = normalizeString(body.consultedAt);
        const status = normalizeString(body.status) || "Scheduled";

        if (!hospitalId || !patientId || !doctor || !symptoms) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Hospital ID, patient ID, doctor name, and symptoms are required.",
                },
                { status: 400 }
            );
        }

        const firestore = getFirestoreClient();
        const consultationsRef = firestore.collection("consultations");

        const consultationRecord = {
            consultationId: `CONS-${Math.floor(100000 + Math.random() * 900000)}`,
            hospitalId,
            hospitalName,
            patientId,
            patientName,
            patientNic,
            mobile,
            department,
            doctor,
            consultationType,
            symptoms,
            status,
            consultedAt: consultedAt || new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        const consultationDoc = await consultationsRef.add(consultationRecord);

        return NextResponse.json(
            {
                success: true,
                consultationId: consultationRecord.consultationId,
                consultation: {
                    id: consultationDoc.id,
                    ...consultationRecord,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Consultation creation failed:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to create consultation.",
            },
            { status: 500 }
        );
    }
}

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const hospitalId = normalizeString(url.searchParams.get("hospitalId"));
        const patientId = normalizeString(url.searchParams.get("patientId"));

        if (!hospitalId) {
            return NextResponse.json(
                {
                    success: false,
                    error: "hospitalId is required.",
                },
                { status: 400 }
            );
        }

        const firestore = getFirestoreClient();
        const consultationsRef = firestore.collection("consultations");

        let query = consultationsRef.where("hospitalId", "==", hospitalId);
        if (patientId) {
            query = query.where("patientId", "==", patientId);
        }

        const snapshot = await query.orderBy("consultedAt", "desc").limit(100).get();

        const consultations = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        return NextResponse.json({
            success: true,
            data: consultations,
        });
    } catch (error) {
        console.error("Consultation lookup failed:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to lookup consultations.",
            },
            { status: 500 }
        );
    }
}
