import { NextResponse } from "next/server";
import { getFirestoreClient } from "@/lib/firebaseAdmin";

export const runtime = "nodejs";

function stringValue(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function numberValue(value: unknown): number {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function transactionFromDispensing(id: string, data: FirebaseFirestore.DocumentData) {
  const items = Array.isArray(data.items) ? data.items : [];
  return items.map((item: unknown, index: number) => {
    const record = typeof item === "object" && item !== null ? item as Record<string, unknown> : {};
    return {
      id: `${id}-${index}`,
      medicineName: stringValue(record.name ?? record.medicineName ?? item) || "Unknown medicine",
      type: "dispensed",
      quantity: numberValue(record.quantity ?? record.qty ?? 1),
      unit: stringValue(record.unit),
      reason: `Prescription #${stringValue(data.prescriptionId)}`,
      operator: stringValue(data.performedBy) || "System",
      timestamp: stringValue(data.createdAt) || new Date(0).toISOString(),
    };
  });
}

export async function GET(request: Request) {
  try {
    const hospitalId = stringValue(new URL(request.url).searchParams.get("hospitalId"));
    if (!hospitalId) {
      return NextResponse.json({ success: false, error: "hospitalId required" }, { status: 400 });
    }

    const db = getFirestoreClient();
    const [transactionsSnapshot, dispensingSnapshot] = await Promise.all([
      db.collection("pharmacyTransactions").where("hospitalId", "==", hospitalId).get(),
      db.collection("dispensing").where("hospitalId", "==", hospitalId).get(),
    ]);
    const transactions = transactionsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Array<Record<string, any>>;
    const recordedDispensingIds = new Set(
      transactions.filter((transaction) => transaction.sourceId).map((transaction) => transaction.sourceId)
    );
    const existingDispensing = dispensingSnapshot.docs
      .filter((doc) => !recordedDispensingIds.has(doc.id))
      .flatMap((doc) => transactionFromDispensing(doc.id, doc.data()));
    const data = [...transactions, ...existingDispensing].sort((left, right) =>
      String(right.timestamp || "").localeCompare(String(left.timestamp || ""))
    );
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Pharmacy history GET failed:", error);
    return NextResponse.json({ success: false, error: "Failed to load pharmacy history" }, { status: 500 });
  }
}