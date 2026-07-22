import { NextResponse, type NextRequest } from "next/server";
import { getFirestoreClient } from "@/lib/firebaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = request.nextUrl;
        const hospitalId = searchParams.get("hospitalId")?.trim();
        const search = searchParams.get("search")?.trim().toLowerCase() || "";

        if (!hospitalId) {
            return NextResponse.json({ error: "Hospital ID is required." }, { status: 400 });
        }

        const firestore = getFirestoreClient();
        const snapshot = await firestore.collection("admissions").where("hospitalId", "==", hospitalId).get();

        const admissions = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        const filtered = search
            ? admissions.filter((item) => JSON.stringify(item).toLowerCase().includes(search))
            : admissions;

        return NextResponse.json({ success: true, data: filtered });
    } catch (error) {
        console.error("Error fetching admissions:", error);
        return NextResponse.json({ error: "Failed to fetch admissions." }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const hospitalId = (body.hospitalId as string)?.trim();
        const patientName = (body.patientName as string)?.trim();

        if (!hospitalId || !patientName) {
            return NextResponse.json({ error: "Hospital ID and patient name are required." }, { status: 400 });
        }

        const firestore = getFirestoreClient();
        const admission = {
            hospitalId,
            admissionId: (body.admissionId as string)?.trim() || `ADM-${Date.now()}`,
            patientName,
            bedNumber: (body.bedNumber as string)?.trim() || "",
            ward: (body.ward as string)?.trim() || "",
            status: (body.status as string) || "Admitted",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        const docRef = await firestore.collection("admissions").add(admission);
        return NextResponse.json({ success: true, data: { id: docRef.id, ...admission } }, { status: 201 });
    } catch (error) {
        console.error("Error creating admission:", error);
        return NextResponse.json({ error: "Failed to create admission." }, { status: 500 });
    }
}
