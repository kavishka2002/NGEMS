"use client";

import PharmacyNavbar from "@/components/pharmacy/PharmacyNavbar";
import PharmacySidebar from "@/components/pharmacy/PharmacySidebar";
import InventoryList from "@/components/pharmacy/InventoryList";
import Link from "next/link";
import Button from "@/components/Button";

export default function InventoryPage() {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-50">
      <PharmacyNavbar />
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <PharmacySidebar />

        <main className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden px-4 py-6 md:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="rounded-lg bg-white px-6 py-6 shadow-sm border border-slate-border">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-health-600">
                  Inventory Management
                </p>
                <h1 className="mt-2 font-display text-3xl font-bold text-navy-900">
                  Medicine Inventory
                </h1>
                <p className="mt-2 text-sm text-navy/60">
                  Track and manage medicine stock levels
                </p>
              </div>
            </div>
          </div>

          {/* Inventory List */}
          <div className="rounded-lg bg-white shadow-sm border border-slate-border p-6 mb-8">
            <InventoryList />
          </div>

          <div className="text-center">
            <Link href="/pharmacy/dashboard">
              <Button type="button" variant="secondary" className="px-4 py-2 text-sm">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
