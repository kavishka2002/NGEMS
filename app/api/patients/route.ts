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
        const snapshot = await firestore.collection("patients").where("hospitalId", "==", hospitalId).get();

        const patients = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        const filtered = search
            ? patients.filter((item) => JSON.stringify(item).toLowerCase().includes(search))
            : patients;

        return NextResponse.json({ success: true, data: filtered });
    } catch (error) {
        console.error("Error fetching patients:", error);
        return NextResponse.json({ error: "Failed to fetch patients." }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const hospitalId = (body.hospitalId as string)?.trim();
        const fullName = (body.fullName as string)?.trim();

        if (!hospitalId || !fullName) {
            return NextResponse.json({ error: "Hospital ID and patient name are required." }, { status: 400 });
        }

        const firestore = getFirestoreClient();
        const patient = {
            hospitalId,
            fullName,
            patientId: (body.patientId as string)?.trim() || `PT-${Date.now()}`,
            email: (body.email as string)?.trim() || "",
            phone: (body.phone as string)?.trim() || "",
            ward: (body.ward as string)?.trim() || "",
            status: (body.status as string) || "Active",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        const docRef = await firestore.collection("patients").add(patient);
        return NextResponse.json({ success: true, data: { id: docRef.id, ...patient } }, { status: 201 });
    } catch (error) {
        console.error("Error creating patient:", error);
        return NextResponse.json({ error: "Failed to create patient." }, { status: 500 });
    }
}
