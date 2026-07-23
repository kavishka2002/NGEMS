import { NextResponse } from "next/server";
import { getFirestoreClient } from "@/lib/firebaseAdmin";

export const runtime = "nodejs";

function normalizeString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function isToday(value: unknown, now: Date): boolean {
  if (typeof value !== "string") return false;
  const date = new Date(value);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === now.toISOString().slice(0, 10);
}

export async function GET(request: Request) {
  try {
    const hospitalId = normalizeString(new URL(request.url).searchParams.get("hospitalId"));
    if (!hospitalId) return NextResponse.json({ success: false, error: "hospitalId is required" }, { status: 400 });

    const db = getFirestoreClient();
    const [prescriptionsSnapshot, dispensingSnapshot, inventorySnapshot] = await Promise.all([
      db.collection("prescriptions").where("hospitalId", "==", hospitalId).get(),
      db.collection("dispensing").where("hospitalId", "==", hospitalId).get(),
      db.collection("inventory").where("hospitalId", "==", hospitalId).get(),
    ]);

    const now = new Date();
    const prescriptions = prescriptionsSnapshot.docs.map((doc) => doc.data());
    const dispensing = dispensingSnapshot.docs.map((doc) => doc.data());
    const inventory = inventorySnapshot.docs.map((doc) => doc.data());
    const pendingPrescriptions = prescriptions.filter((item) => String(item.status || "pending").toLowerCase() === "pending").length;
    const dispensedToday = dispensing.filter((item) => isToday(item.createdAt, now)).length;
    const lowStock = inventory.filter((item) => Number(item.quantity || 0) <= Number(item.minStock ?? item.minQty ?? 0)).length;
    const expired = inventory.filter((item) => {
      if (typeof item.expiryDate !== "string" || !item.expiryDate) return false;
      const expiry = new Date(item.expiryDate);
      return !Number.isNaN(expiry.getTime()) && expiry < now;
    }).length;

    return NextResponse.json({
      success: true,
      data: {
        pendingPrescriptions,
        dispensedToday,
        totalMedicines: inventory.length,
        lowStockAlerts: lowStock,
        expiredMedicines: expired,
      },
    });
  } catch (error) {
    console.error("Pharmacy dashboard GET failed:", error);
    return NextResponse.json({ success: false, error: "Failed to load pharmacy dashboard" }, { status: 500 });
  }
}