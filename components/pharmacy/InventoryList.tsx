"use client";

import { useState } from "react";
import { Package, Plus, Edit2, Trash2, AlertTriangle } from "lucide-react";
import Button from "@/components/Button";

interface Medicine {
  id: string;
  name: string;
  quantity: number;
  minStock: number;
  unit: string;
  price: number;
  expiryDate: string;
}

const mockInventory: Medicine[] = [
  {
    id: "M001",
    name: "Aspirin 500mg",
    quantity: 150,
    minStock: 50,
    unit: "tablets",
    price: 5.5,
    expiryDate: "2027-06-15",
  },
  {
    id: "M002",
    name: "Amoxicillin 250mg",
    quantity: 45,
    minStock: 50,
    unit: "capsules",
    price: 12.0,
    expiryDate: "2027-08-20",
  },
  {
    id: "M003",
    name: "Ibuprofen 200mg",
    quantity: 200,
    minStock: 100,
    unit: "tablets",
    price: 8.0,
    expiryDate: "2026-12-30",
  },
  {
    id: "M004",
    name: "Cough Syrup",
    quantity: 20,
    minStock: 30,
    unit: "bottles",
    price: 15.0,
    expiryDate: "2026-10-15",
  },
];

export default function InventoryList() {
  const lowStockMedicines = mockInventory.filter((m) => m.quantity <= m.minStock);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-navy">Medicine Inventory</h3>
        <Button type="button" variant="primary" className="flex items-center gap-2 px-3 py-2 text-sm">
          <Plus size={16} />
          Add Medicine
        </Button>
      </div>

      {lowStockMedicines.length > 0 && (
        <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 flex gap-3">
          <AlertTriangle size={20} className="text-amber-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-amber-900">Low Stock Alert</p>
            <p className="text-xs text-amber-700 mt-1">
              {lowStockMedicines.length} medicine(s) below minimum stock levels
            </p>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-border bg-slate-50">
              <th className="px-4 py-3 text-left font-semibold text-navy">Medicine Name</th>
              <th className="px-4 py-3 text-right font-semibold text-navy">Quantity</th>
              <th className="px-4 py-3 text-right font-semibold text-navy">Min Stock</th>
              <th className="px-4 py-3 text-right font-semibold text-navy">Unit Price</th>
              <th className="px-4 py-3 text-right font-semibold text-navy">Expiry Date</th>
              <th className="px-4 py-3 text-center font-semibold text-navy">Status</th>
              <th className="px-4 py-3 text-center font-semibold text-navy">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-border">
            {mockInventory.map((medicine) => (
              <tr key={medicine.id} className="hover:bg-slate-50 transition">
                <td className="px-4 py-3 font-medium text-navy">{medicine.name}</td>
                <td className="px-4 py-3 text-right text-navy/70">{medicine.quantity} {medicine.unit}</td>
                <td className="px-4 py-3 text-right text-navy/70">{medicine.minStock} {medicine.unit}</td>
                <td className="px-4 py-3 text-right text-navy/70">${medicine.price.toFixed(2)}</td>
                <td className="px-4 py-3 text-right text-navy/70">{medicine.expiryDate}</td>
                <td className="px-4 py-3 text-center">
                  {medicine.quantity <= medicine.minStock ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700">
                      Low Stock
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                      In Stock
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-center gap-2">
                    <button className="p-1.5 rounded-md hover:bg-slate-100 text-navy/60 hover:text-navy transition">
                      <Edit2 size={16} />
                    </button>
                    <button className="p-1.5 rounded-md hover:bg-slate-100 text-navy/60 hover:text-red-600 transition">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
