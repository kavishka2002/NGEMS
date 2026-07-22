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
        const snapshot = await firestore.collection("departments").where("hospitalId", "==", hospitalId).get();

        const departments = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        const filtered = search
            ? departments.filter((item) => JSON.stringify(item).toLowerCase().includes(search))
            : departments;

        return NextResponse.json({ success: true, data: filtered });
    } catch (error) {
        console.error("Error fetching departments:", error);
        return NextResponse.json({ error: "Failed to fetch departments." }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const hospitalId = (body.hospitalId as string)?.trim();
        const name = (body.name as string)?.trim();

        if (!hospitalId || !name) {
            return NextResponse.json({ error: "Hospital ID and department name are required." }, { status: 400 });
        }

        const firestore = getFirestoreClient();
        const department = {
            hospitalId,
            name,
            head: (body.head as string)?.trim() || "",
            location: (body.location as string)?.trim() || "",
            staffCount: Number(body.staffCount) || 0,
            status: (body.status as string) || "Active",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        const docRef = await firestore.collection("departments").add(department);
        return NextResponse.json({ success: true, data: { id: docRef.id, ...department } }, { status: 201 });
    } catch (error) {
        console.error("Error creating department:", error);
        return NextResponse.json({ error: "Failed to create department." }, { status: 500 });
    }
}
