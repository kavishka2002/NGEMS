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
        const priority = normalizeString(body.priority) || "Normal";
        const notes = normalizeString(body.notes);
        const sentAt = normalizeString(body.sentAt);

        if (!hospitalId || !patientId || !doctor) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Hospital ID, patient ID, and doctor name are required.",
                },
                { status: 400 }
            );
        }

        const firestore = getFirestoreClient();
        const referralsRef = firestore.collection("referrals");

        const referralRecord = {
            referralId: `REF-${Math.floor(100000 + Math.random() * 900000)}`,
            hospitalId,
            hospitalName,
            patientId,
            patientName,
            patientNic,
            mobile,
            department,
            doctor,
            priority,
            notes,
            status: "Pending",
            sentAt: sentAt || new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        const referralDoc = await referralsRef.add(referralRecord);

        return NextResponse.json(
            {
                success: true,
                referralId: referralRecord.referralId,
                referral: {
                    id: referralDoc.id,
                    ...referralRecord,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Referral creation failed:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to send referral to doctor.",
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
        const referralsRef = firestore.collection("referrals");

        let query = referralsRef.where("hospitalId", "==", hospitalId);
        if (patientId) {
            query = query.where("patientId", "==", patientId);
        }

        const snapshot = await query.orderBy("sentAt", "desc").limit(100).get();

        const referrals = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        return NextResponse.json({
            success: true,
            data: referrals,
        });
    } catch (error) {
        console.error("Referral lookup failed:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to lookup referrals.",
            },
            { status: 500 }
        );
    }
}
