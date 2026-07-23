"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import Sidebar from "@/components/dashboard/Sidebar";
import Button from "@/components/Button";
import { Plus, Search } from "lucide-react";
import { createDepartment, getDepartments } from "@/lib/operations-service";

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showAddDepartment, setShowAddDepartment] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [newDepartment, setNewDepartment] = useState({
    name: "",
    head: "",
    location: "",
    staffCount: "",
  });

  useEffect(() => {
    const hospitalSession = typeof window !== "undefined" ? window.localStorage.getItem("ngemsHospitalSession") : null;
    const hospitalId = hospitalSession ? JSON.parse(hospitalSession).hospitalId : null;

    if (!hospitalId) {
      setError("Hospital context is missing. Please sign in again.");
      setIsLoading(false);
      return;
    }

    const fetchDepartments = async () => {
      const data = await getDepartments(hospitalId);
      setDepartments(data);
      setIsLoading(false);
    };

    void fetchDepartments();
  }, []);

  const filteredDepartments = useMemo(
    () =>
      departments.filter((item) =>
        [item.name, item.head, item.location]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(searchTerm.toLowerCase()))
      ),
    [departments, searchTerm]
  );

  const handleInputChange = (field: keyof typeof newDepartment, value: string) => {
    setNewDepartment((prev) => ({ ...prev, [field]: value }));
    setCreateError(null);
    setSuccessMessage(null);
  };

  const handleCreateDepartment = async () => {
    if (creating) return;
    const hospitalSession = typeof window !== "undefined" ? window.localStorage.getItem("ngemsHospitalSession") : null;
    const hospitalId = hospitalSession ? JSON.parse(hospitalSession).hospitalId : null;

    if (!hospitalId) {
      setCreateError("Hospital context is missing. Please sign in again.");
      return;
    }

    if (!newDepartment.name.trim()) {
      setCreateError("Department name is required.");
      return;
    }

    setCreating(true);
    setCreateError(null);
    setSuccessMessage(null);

    try {
      const created = await createDepartment(hospitalId, {
        name: newDepartment.name.trim(),
        head: newDepartment.head.trim(),
        location: newDepartment.location.trim(),
        staffCount: Number(newDepartment.staffCount) || 0,
      });

      setDepartments((prev) => [created, ...prev]);
      setSuccessMessage("Department created successfully.");
      setNewDepartment({ name: "", head: "", location: "", staffCount: "" });
      setShowAddDepartment(false);
    } catch (error) {
      setCreateError(error instanceof Error ? error.message : "Failed to create department.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden" style={{ backgroundColor: "#F0F4F8" }}>
      <DashboardNavbar />
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <Sidebar />

        <main className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden px-4 py-6 md:px-6 lg:px-8">
          <div className="mb-6">
            <div className="max-w-7xl w-full mx-auto rounded-lg bg-white/60 px-4 py-6 shadow-sm md:px-6 lg:px-8">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">Operations Management</p>
                  <h1 className="mt-1 font-display text-3xl font-bold leading-tight text-[#0B2545]">Departments</h1>
                  <p className="mt-1 text-sm text-[#146C94]">Manage hospital departments and staff coverage.</p>
                </div>
                <Button
                  type="button"
                  variant="primary"
                  className="w-auto px-4 py-2 text-sm"
                  onClick={() => setShowAddDepartment((prev) => !prev)}
                >
                  <Plus size={16} className="mr-2 inline" /> Add Department
                </Button>
              </div>
            </div>
          </div>

          {showAddDepartment && (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                handleCreateDepartment();
              }}
              className="mb-6 rounded-lg bg-white shadow-sm border border-slate-border p-6"
            >
              <div className="flex items-center justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-navy-900">Create Department</h2>
                  <p className="text-sm text-slate-500">Enter department details and save to the hospital directory.</p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-auto px-4 py-2 text-sm"
                  onClick={(event) => {
                    event.preventDefault();
                    setShowAddDepartment(false);
                  }}
                >
                  Cancel
                </Button>
              </div>

              {createError && <div className="mb-4 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{createError}</div>}
              {successMessage && <div className="mb-4 rounded-md border border-health-200 bg-health-50 px-4 py-3 text-sm text-health-700">{successMessage}</div>}

              <div className="grid gap-4 lg:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Department Name</span>
                  <input
                    value={newDepartment.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-navy-900 focus:border-health-600 focus:ring-2 focus:ring-health-100"
                    placeholder="e.g. Cardiology"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Department Head</span>
                  <input
                    value={newDepartment.head}
                    onChange={(e) => handleInputChange("head", e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-navy-900 focus:border-health-600 focus:ring-2 focus:ring-health-100"
                    placeholder="e.g. Dr. Kamal Silva"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Location</span>
                  <input
                    value={newDepartment.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-navy-900 focus:border-health-600 focus:ring-2 focus:ring-health-100"
                    placeholder="e.g. Building A, Floor 2"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Staff Count</span>
                  <input
                    value={newDepartment.staffCount}
                    onChange={(e) => handleInputChange("staffCount", e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-navy-900 focus:border-health-600 focus:ring-2 focus:ring-health-100"
                    placeholder="0"
                    type="number"
                    min="0"
                  />
                </label>
              </div>

              <div className="mt-5 flex items-center gap-3">
                <Button
                  type="submit"
                  variant="primary"
                  className="w-auto px-4 py-2 text-sm"
                  disabled={creating}
                >
                  {creating ? "Creating..." : "Save Department"}
                </Button>
              </div>
            </form>
          )}

          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-3 text-navy/40" />
              <input
                type="text"
                placeholder="Search departments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-health-600 focus:border-transparent"
              />
            </div>
          </div>

          <div className="rounded-lg bg-white shadow-sm border border-slate-border p-6">
            {isLoading ? (
              <div className="text-center py-12 text-slate-500">Loading departments...</div>
            ) : error ? (
              <div className="text-center py-12 text-rose-600">{error}</div>
            ) : filteredDepartments.length === 0 ? (
              <div className="text-center py-12 text-slate-500">No departments found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] table-auto text-left">
                  <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-600">
                    <tr>
                      <th className="px-4 py-3">Department</th>
                      <th className="px-4 py-3">Head</th>
                      <th className="px-4 py-3">Location</th>
                      <th className="px-4 py-3">Staff Count</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredDepartments.map((department) => (
                      <tr key={department.id} className="hover:bg-slate-50">
                        <td className="px-4 py-4 font-medium text-slate-900">{department.name || "Untitled"}</td>
                        <td className="px-4 py-4 text-slate-600">{department.head || "Not assigned"}</td>
                        <td className="px-4 py-4 text-slate-600">{department.location || "Unknown"}</td>
                        <td className="px-4 py-4 text-slate-600">{department.staffCount ?? "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
