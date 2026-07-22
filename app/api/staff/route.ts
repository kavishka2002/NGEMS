import { NextResponse, type NextRequest } from "next/server";
import { existsSync, readFileSync } from "fs";
import * as path from "path";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { getStorage } from "firebase-admin/storage";

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
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "ngems-9815e.firebasestorage.app",
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
                privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
            }),
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        });
    }
}

const firestore = getFirestore();
const auth = getAuth();
const storage = getStorage();

async function parseFormData(request: NextRequest) {
    const contentType = request.headers.get("content-type");

    if (contentType?.includes("multipart/form-data")) {
        const formData = await request.formData();
        const data: Record<string, string | File> = {};

        for (const [key, value] of formData.entries()) {
            data[key] = value;
        }

        return data;
    }

    const body = await request.json();
    return body;
}

async function uploadPhotoToStorage(
    photoBase64: string,
    hospitalId: string,
    employeeId: string
): Promise<string | null> {
    try {
        if (!photoBase64) return null;

        // Convert base64 to buffer
        const buffer = Buffer.from(photoBase64.replace(/^data:image\/\w+;base64,/, ""), "base64");
        const bucket = storage.bucket();
        const fileName = `staff-photos/${hospitalId}/${employeeId}.jpg`;
        const file = bucket.file(fileName);

        await file.save(buffer, {
            metadata: {
                contentType: "image/jpeg",
            },
        });

        // Make file public and get signed URL
        const [url] = await file.getSignedUrl({
            version: "v4",
            action: "read",
            expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        return url;
    } catch (error) {
        console.error("Error uploading photo:", error);
        return null;
    }
}

export async function POST(request: NextRequest) {
    try {
        const data = await parseFormData(request);

        // Validate required fields
        const requiredFields = [
            "hospitalId",
            "hospitalName",
            "role",
            "fullName",
            "nic",
            "dob",
            "gender",
            "mobile",
            "email",
            "address",
            "department",
            "employeeId",
            "joiningDate",
            "employmentType",
            "username",
            "password",
        ];

        const missingFields = requiredFields.filter((field) => !data[field]);
        if (missingFields.length > 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: `Missing required fields: ${missingFields.join(", ")}`,
                },
                { status: 400 }
            );
        }

        // Check if username already exists
        try {
            const existingUser = await auth.getUserByEmail(data.email as string);
            return NextResponse.json(
                {
                    success: false,
                    error: "This email is already registered. Please use a different email address.",
                },
                { status: 400 }
            );
        } catch (error: any) {
            // Email not found is expected
            if (error.code !== "auth/user-not-found") {
                throw error;
            }
        }

        // Check username uniqueness in Firestore
        const usernameQuery = await firestore
            .collection("staff")
            .where("username", "==", data.username)
            .where("hospitalId", "==", data.hospitalId)
            .limit(1)
            .get();

        if (!usernameQuery.empty) {
            return NextResponse.json(
                {
                    success: false,
                    error: "This username is already taken. Please choose a different username.",
                },
                { status: 400 }
            );
        }

        // Upload photo if provided
        let photoUrl: string | null = null;
        if (data.photoBase64) {
            photoUrl = await uploadPhotoToStorage(
                data.photoBase64 as string,
                data.hospitalId as string,
                data.employeeId as string
            );
        }

        // Create authentication user
        let uid: string;
        try {
            const userRecord = await auth.createUser({
                email: data.email as string,
                password: data.password as string,
                displayName: data.fullName as string,
                photoURL: photoUrl || undefined,
            });
            uid = userRecord.uid;
        } catch (authError: any) {
            console.error("Auth error:", authError);
            return NextResponse.json(
                {
                    success: false,
                    error: `Failed to create authentication user: ${authError.message}`,
                },
                { status: 400 }
            );
        }

        // Create staff record in Firestore
        const now = new Date().toISOString();
        const staffData = {
            uid,
            hospitalId: data.hospitalId,
            hospitalName: data.hospitalName,
            role: data.role,
            fullName: data.fullName,
            nic: data.nic,
            dob: data.dob,
            gender: data.gender,
            mobile: data.mobile,
            email: data.email,
            address: data.address,
            department: data.department,
            employeeId: data.employeeId,
            specialization: data.specialization || null,
            medicalRegNo: data.medicalRegNo || null,
            licenseNo: data.licenseNo || null,
            joiningDate: data.joiningDate,
            employmentType: data.employmentType,
            username: data.username,
            status: data.status || "Active",
            photoUrl: photoUrl || null,
            createdAt: now,
            updatedAt: now,
            createdBy: data.createdBy || "admin",
        };

        const docRef = await firestore.collection("staff").add(staffData);

        // Set custom claims for role-based access
        try {
            await auth.setCustomUserClaims(uid, {
                role: data.role,
                hospitalId: data.hospitalId,
                employeeId: data.employeeId,
            });
        } catch (error) {
            console.warn("Could not set custom claims:", error);
        }

        return NextResponse.json(
            {
                success: true,
                message: `Staff account created successfully for ${data.fullName}`,
                staffId: docRef.id,
                employeeId: data.employeeId,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Staff creation error:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        return NextResponse.json(
            {
                success: false,
                error: `Failed to create staff account: ${errorMessage}`,
            },
            { status: 500 }
        );
    }
}

// GET endpoint to fetch staff members
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const hospitalId = searchParams.get("hospitalId");
        const role = searchParams.get("role");

        if (!hospitalId) {
            return NextResponse.json({ error: "Hospital ID is required" }, { status: 400 });
        }

        let query = firestore.collection("staff").where("hospitalId", "==", hospitalId);

        if (role) {
            query = query.where("role", "==", role);
        }

        const snapshot = await query.get();
        const staff = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        return NextResponse.json({ success: true, data: staff });
    } catch (error) {
        console.error("Error fetching staff:", error);
        return NextResponse.json(
            { error: "Failed to fetch staff members" },
            { status: 500 }
        );
    }
}
