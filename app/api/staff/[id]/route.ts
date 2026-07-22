import { NextResponse, type NextRequest } from "next/server";
import { existsSync, readFileSync } from "fs";
import * as path from "path";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

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
            storageBucket:
                process.env.FIREBASE_STORAGE_BUCKET || `${serviceAccount.project_id}.appspot.com`,
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
                privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\n/g, "\n"),
            }),
            storageBucket:
                process.env.FIREBASE_STORAGE_BUCKET || `${process.env.FIREBASE_PROJECT_ID}.appspot.com`,
        });
    }
}

const firestore = getFirestore();
const auth = getAuth();

function normalizeUrl(value: unknown): string | null {
    if (!value || typeof value !== "string") return null;
    const trimmed = value.trim();
    if (!trimmed || trimmed.toLowerCase() === "none" || trimmed.toLowerCase() === "null" || trimmed.toLowerCase() === "undefined") {
        return null;
    }
    return trimmed;
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const staffId = params.id;
        const docRef = firestore.collection("staff").doc(staffId);
        const snapshot = await docRef.get();

        if (!snapshot.exists) {
            return NextResponse.json({ error: "Staff member not found." }, { status: 404 });
        }

        const data = snapshot.data() as Record<string, unknown>;
        return NextResponse.json({ success: true, data: { id: snapshot.id, ...data, photoUrl: normalizeUrl(data.photoUrl) } });
    } catch (error) {
        console.error("Error fetching staff member:", error);
        return NextResponse.json({ error: "Failed to fetch staff member." }, { status: 500 });
    }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const staffId = params.id;
        const updates = await request.json();

        if (!updates || typeof updates !== "object") {
            return NextResponse.json({ error: "Invalid update payload." }, { status: 400 });
        }

        const docRef = firestore.collection("staff").doc(staffId);
        const snapshot = await docRef.get();

        if (!snapshot.exists) {
            return NextResponse.json({ error: "Staff member not found." }, { status: 404 });
        }

        const existingData = snapshot.data() as Record<string, unknown>;
        const uid = typeof existingData.uid === "string" ? existingData.uid : null;

        await docRef.update(updates);

        if (uid && updates.email) {
            try {
                await auth.updateUser(uid, { email: updates.email as string });
            } catch (authErr) {
                console.warn("Unable to update auth email for staff user:", authErr);
            }
        }

        if (uid && updates.fullName) {
            try {
                await auth.updateUser(uid, { displayName: updates.fullName as string });
            } catch (authErr) {
                console.warn("Unable to update auth displayName for staff user:", authErr);
            }
        }

        return NextResponse.json({ success: true, message: "Staff member updated successfully." });
    } catch (error) {
        console.error("Error updating staff member:", error);
        return NextResponse.json({ error: "Failed to update staff member." }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const staffId = params.id;
        const docRef = firestore.collection("staff").doc(staffId);
        const snapshot = await docRef.get();

        if (!snapshot.exists) {
            return NextResponse.json({ error: "Staff member not found." }, { status: 404 });
        }

        const existingData = snapshot.data() as Record<string, unknown>;
        const uid = typeof existingData.uid === "string" ? existingData.uid : null;

        await docRef.delete();

        if (uid) {
            try {
                await auth.deleteUser(uid);
            } catch (authErr) {
                console.warn("Unable to delete auth user for staff member:", authErr);
            }
        }

        return NextResponse.json({ success: true, message: "Staff member deleted successfully." });
    } catch (error) {
        console.error("Error deleting staff member:", error);
        return NextResponse.json({ error: "Failed to delete staff member." }, { status: 500 });
    }
}
