"use client";

import { FormEvent, useEffect, useState } from "react";
import { AlertTriangle, Eye, Pencil, Plus, Trash2, X } from "lucide-react";
import Button from "@/components/Button";
import * as service from "@/lib/pharmacy-service";

type MedicineForm = Omit<service.Medicine, "id">;
const emptyForm: MedicineForm = { name: "", quantity: 0, minStock: 0, unit: "", price: 0, expiryDate: "" };

export default function InventoryList() {
  const [inventory, setInventory] = useState<service.Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dialog, setDialog] = useState<"form" | "view" | null>(null);
  const [selected, setSelected] = useState<service.Medicine | null>(null);
  const [form, setForm] = useState<MedicineForm>(emptyForm);
  const [saving, setSaving] = useState(false);

  async function loadInventory() {
    setLoading(true);
    try { setInventory(await service.getInventory()); setError(""); }
    catch { setError("Unable to load inventory."); }
    finally { setLoading(false); }
  }

  useEffect(() => { void loadInventory(); }, []);

  function openAdd() { setSelected(null); setForm(emptyForm); setDialog("form"); }
  function openEdit(medicine: service.Medicine) { setSelected(medicine); setForm({ ...emptyForm, ...medicine }); setDialog("form"); }
  function openView(medicine: service.Medicine) { setSelected(medicine); setDialog("view"); }

  async function remove(medicine: service.Medicine) {
    if (!window.confirm(`Delete ${medicine.name}?`)) return;
    try { await service.deleteInventoryItem(medicine.id); setInventory(items => items.filter(item => item.id !== medicine.id)); }
    catch { setError("Unable to delete this medicine."); }
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    if (!form.name.trim()) { setError("Medicine name is required."); return; }
    setSaving(true);
    try {
      if (selected) await service.updateInventoryItem(selected.id, form);
      else await service.createInventoryItem(form);
      setDialog(null); await loadInventory();
    } catch { setError("Unable to save this medicine."); }
    finally { setSaving(false); }
  }

  const lowStock = inventory.filter(medicine => medicine.quantity <= (medicine.minStock ?? 0));
  const field = (key: keyof MedicineForm, value: string | number) => setForm(current => ({ ...current, [key]: value }));

  return <div className="space-y-4">
    <div className="flex items-center justify-between gap-4"><h3 className="font-semibold text-navy">Medicine Inventory</h3><Button type="button" variant="primary" onClick={openAdd} className="flex items-center gap-2 px-3 py-2 text-sm"><Plus size={16} />Add Medicine</Button></div>
    {error && <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
    {lowStock.length > 0 && <div className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4"><AlertTriangle size={20} className="flex-shrink-0 text-amber-600" /><div><p className="text-sm font-semibold text-amber-900">Low Stock Alert</p><p className="mt-1 text-xs text-amber-700">{lowStock.length} medicine(s) below minimum stock levels</p></div></div>}
    {loading ? <p className="py-8 text-center text-sm text-navy/60">Loading inventory...</p> : inventory.length === 0 ? <div className="py-10 text-center"><p className="font-medium text-navy">No medicines in inventory</p><p className="mt-1 text-sm text-navy/60">Add your first medicine to start tracking stock.</p></div> : <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-slate-border bg-slate-50">{["Medicine Name", "Quantity", "Min Stock", "Unit Price", "Expiry Date", "Status", "Actions"].map(label => <th key={label} className="whitespace-nowrap px-4 py-3 text-left font-semibold text-navy">{label}</th>)}</tr></thead><tbody className="divide-y divide-slate-border">{inventory.map(medicine => <tr key={medicine.id} className="transition hover:bg-slate-50"><td className="px-4 py-3 font-medium text-navy">{medicine.name}</td><td className="px-4 py-3 text-navy/70">{medicine.quantity} {medicine.unit}</td><td className="px-4 py-3 text-navy/70">{medicine.minStock ?? 0} {medicine.unit}</td><td className="px-4 py-3 text-navy/70">${(medicine.price ?? 0).toFixed(2)}</td><td className="px-4 py-3 text-navy/70">{medicine.expiryDate || "-"}</td><td className="px-4 py-3"><span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${medicine.quantity <= (medicine.minStock ?? 0) ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>{medicine.quantity <= (medicine.minStock ?? 0) ? "Low Stock" : "In Stock"}</span></td><td className="px-4 py-3"><div className="flex gap-1"><button title="View medicine" onClick={() => openView(medicine)} className="rounded-md p-1.5 text-navy/60 hover:bg-slate-100 hover:text-navy"><Eye size={16} /></button><button title="Edit medicine" onClick={() => openEdit(medicine)} className="rounded-md p-1.5 text-navy/60 hover:bg-slate-100 hover:text-navy"><Pencil size={16} /></button><button title="Delete medicine" onClick={() => void remove(medicine)} className="rounded-md p-1.5 text-navy/60 hover:bg-slate-100 hover:text-red-600"><Trash2 size={16} /></button></div></td></tr>)}</tbody></table></div>}
    {dialog && <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/40 p-4" onClick={() => setDialog(null)}><div role="dialog" aria-modal="true" className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl" onClick={event => event.stopPropagation()}><div className="mb-5 flex items-center justify-between"><h2 className="text-xl font-bold text-navy">{dialog === "view" ? "Medicine Details" : selected ? "Edit Medicine" : "Add Medicine"}</h2><button title="Close" onClick={() => setDialog(null)} className="rounded-md p-1 text-navy/60 hover:bg-slate-100"><X size={20} /></button></div>{dialog === "view" && selected ? <div className="space-y-3 text-sm">{[["Name", selected.name], ["Quantity", `${selected.quantity} ${selected.unit || ""}`], ["Minimum stock", `${selected.minStock ?? 0} ${selected.unit || ""}`], ["Unit price", `$${(selected.price ?? 0).toFixed(2)}`], ["Expiry date", selected.expiryDate || "-"]].map(([label, value]) => <div key={label} className="flex justify-between border-b border-slate-100 py-2"><span className="text-navy/60">{label}</span><strong className="text-navy">{value}</strong></div>)}</div> : <form onSubmit={save} className="space-y-4">{[["name", "Medicine name", "text"], ["quantity", "Quantity", "number"], ["minStock", "Minimum stock", "number"], ["unit", "Unit (tablets, bottles...)", "text"], ["price", "Unit price", "number"], ["expiryDate", "Expiry date", "date"]].map(([key, label, type]) => <label key={key} className="block text-sm font-medium text-navy">{label}<input required={key === "name"} type={type} min={type === "number" ? "0" : undefined} step={key === "price" ? "0.01" : "1"} value={String(form[key as keyof MedicineForm] ?? "")} onChange={event => field(key as keyof MedicineForm, type === "number" ? Number(event.target.value) : event.target.value)} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 font-normal outline-none focus:border-health-600" /></label>)}<div className="flex justify-end gap-3 pt-2"><Button type="button" variant="secondary" onClick={() => setDialog(null)}>Cancel</Button><Button type="submit" variant="primary" disabled={saving}>{saving ? "Saving..." : selected ? "Save Changes" : "Add Medicine"}</Button></div></form>}</div></div>}
  </div>;
}
