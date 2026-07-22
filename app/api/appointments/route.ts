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
        const snapshot = await firestore.collection("appointments").where("hospitalId", "==", hospitalId).get();

        const appointments = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        const filtered = search
            ? appointments.filter((item) => JSON.stringify(item).toLowerCase().includes(search))
            : appointments;

        return NextResponse.json({ success: true, data: filtered });
    } catch (error) {
        console.error("Error fetching appointments:", error);
        return NextResponse.json({ error: "Failed to fetch appointments." }, { status: 500 });
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
        const appointment = {
            hospitalId,
            appointmentId: (body.appointmentId as string)?.trim() || `APT-${Date.now()}`,
            patientName,
            doctor: (body.doctor as string)?.trim() || "",
            department: (body.department as string)?.trim() || "",
            time: (body.time as string)?.trim() || "",
            status: (body.status as string) || "Scheduled",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        const docRef = await firestore.collection("appointments").add(appointment);
        return NextResponse.json({ success: true, data: { id: docRef.id, ...appointment } }, { status: 201 });
    } catch (error) {
        console.error("Error creating appointment:", error);
        return NextResponse.json({ error: "Failed to create appointment." }, { status: 500 });
    }
}
