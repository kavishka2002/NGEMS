"use client";

import { useEffect, useState } from "react";
import {
    Search,
    Filter,
    MoreVertical,
    Edit2,
    Lock,
    Trash2,
    CheckCircle,
    XCircle,
    Loader,
    X,
} from "lucide-react";
import { StaffAccount } from "@/lib/types";
import { getStaffList, deactivateStaffAccount, reactivateStaffAccount, deleteStaffAccount, updateStaffAccount } from "@/lib/staff-service";

interface StaffListProps {
    hospitalId: string;
    onEditStaff?: (staff: StaffAccount) => void;
    roleFilter?: string;
}

export default function StaffListComponent({ hospitalId, onEditStaff, roleFilter }: StaffListProps) {
    const [staff, setStaff] = useState<StaffAccount[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>(roleFilter ? "custom" : "all");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [editingStaff, setEditingStaff] = useState<StaffAccount | null>(null);
    const [editForm, setEditForm] = useState<Partial<StaffAccount>>({});
    const [editError, setEditError] = useState<string | null>(null);
    const [isEditSaving, setIsEditSaving] = useState(false);
    const [deletingStaff, setDeletingStaff] = useState<StaffAccount | null>(null);
    const [isDeleteProcessing, setIsDeleteProcessing] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    const roles = ["all", "Doctor", "Nurse", "Reception Staff", "Pharmacy Staff", "Laboratory Staff"];
    const statuses = ["all", "Active", "Inactive"];

    useEffect(() => {
        loadStaff();
    }, [hospitalId]);

    const loadStaff = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await getStaffList(hospitalId);
            setStaff(data);
        } catch (err) {
            setError("Failed to load staff members");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusToggle = async (staffMember: StaffAccount) => {
        try {
            if (staffMember.status === "Active") {
                await deactivateStaffAccount(staffMember.id!);
                setStaff((prev) =>
                    prev.map((s) => (s.id === staffMember.id ? { ...s, status: "Inactive" } : s))
                );
            } else {
                await reactivateStaffAccount(staffMember.id!);
                setStaff((prev) =>
                    prev.map((s) => (s.id === staffMember.id ? { ...s, status: "Active" } : s))
                );
            }
        } catch (err) {
            console.error("Failed to toggle status:", err);
        }
    };

    const handleEditStaff = (staffMember: StaffAccount) => {
        setEditingStaff(staffMember);
        setEditForm({
            fullName: staffMember.fullName,
            email: staffMember.email,
            mobile: staffMember.mobile,
            department: staffMember.department,
            role: staffMember.role,
            status: staffMember.status,
        });
        setEditError(null);
        setOpenMenuId(null);
    };

    const closeEditModal = () => {
        setEditingStaff(null);
        setEditForm({});
        setEditError(null);
    };

    const handleEditChange = (key: keyof Partial<StaffAccount>, value: string) => {
        setEditForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleSaveEdit = async () => {
        if (!editingStaff?.id) return;
        setIsEditSaving(true);
        setEditError(null);

        try {
            const updates: Partial<StaffAccount> = {
                fullName: editForm.fullName ?? editingStaff.fullName,
                email: editForm.email ?? editingStaff.email,
                mobile: editForm.mobile ?? editingStaff.mobile,
                department: editForm.department ?? editingStaff.department,
                role: editForm.role ?? editingStaff.role,
                status: editForm.status ?? editingStaff.status,
            };

            const result = await updateStaffAccount(editingStaff.id, updates);
            if (!result.success) {
                setEditError(result.error || "Failed to update staff.");
                return;
            }

            setStaff((prev) => prev.map((member) => (member.id === editingStaff.id ? { ...member, ...updates } : member)));
            closeEditModal();
        } catch (err) {
            console.error("Failed to update staff member:", err);
            setEditError("An unexpected error occurred while updating staff.");
        } finally {
            setIsEditSaving(false);
        }
    };

    const confirmDeleteStaff = (staffMember: StaffAccount) => {
        setDeletingStaff(staffMember);
        setDeleteError(null);
        setOpenMenuId(null);
    };

    const cancelDelete = () => {
        setDeletingStaff(null);
        setDeleteError(null);
    };

    const handleDeleteStaff = async () => {
        if (!deletingStaff?.id) return;

        setIsDeleteProcessing(true);
        setDeleteError(null);

        try {
            const result = await deleteStaffAccount(deletingStaff.id);
            if (result.success) {
                setStaff((prev) => prev.filter((s) => s.id !== deletingStaff.id));
                cancelDelete();
            } else {
                setDeleteError(result.error || "Failed to delete staff member.");
                console.error("Delete failed:", result.error);
            }
        } catch (err) {
            console.error("Failed to delete staff member:", err);
            setDeleteError("An unexpected error occurred while deleting staff.");
        } finally {
            setIsDeleteProcessing(false);
        }
    };

    const filteredStaff = staff.filter((member) => {
        const matchesSearch =
            member.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.employeeId.toLowerCase().includes(searchTerm.toLowerCase());

        const activeRoleFilter = roleFilter || selectedRoleFilter;
        const matchesRole = activeRoleFilter === "all" ? true : member.role === activeRoleFilter;
        const matchesStatus = statusFilter === "all" || member.status === statusFilter;

        return matchesSearch && matchesRole && matchesStatus;
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <Loader className="animate-spin text-clinical-500" size={32} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {error && (
                <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-rose-700">
                    {error}
                </div>
            )}

            {/* Filters */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                    <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by name, email, or employee ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm focus:border-clinical-500 focus:outline-none"
                    />
                </div>

                {!roleFilter && (
                    <select
                        value={selectedRoleFilter}
                        onChange={(e) => setSelectedRoleFilter(e.target.value)}
                        className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm focus:border-clinical-500 focus:outline-none"
                    >
                        {roles.map((role) => (
                            <option key={role} value={role}>
                                {role === "all" ? "All Roles" : role}
                            </option>
                        ))}
                    </select>
                )}

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm focus:border-clinical-500 focus:outline-none"
                >
                    {statuses.map((status) => (
                        <option key={status} value={status}>
                            {status === "all" ? "All Status" : status}
                        </option>
                    ))}
                </select>
            </div>

            {/* Staff Table */}
            <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
                <table className="w-full">
                    <thead className="border-b border-slate-200 bg-slate-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Employee ID</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Department</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Status</th>
                            <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {filteredStaff.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-8 text-center text-sm text-slate-500">
                                    No staff members found
                                </td>
                            </tr>
                        ) : (
                            filteredStaff.map((member) => (
                                <tr key={member.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {member.photoUrl && member.photoUrl !== "none" && member.photoUrl !== "null" ? (
                                                <img
                                                    src={member.photoUrl}
                                                    alt={member.fullName}
                                                    className="h-8 w-8 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200">
                                                    <span className="text-xs font-semibold text-slate-600">
                                                        {member.fullName.charAt(0)}
                                                    </span>
                                                </div>
                                            )}
                                            <span className="text-sm font-medium text-slate-900">{member.fullName}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-mono text-slate-700">{member.employeeId}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center rounded-full bg-clinical-50 px-3 py-1 text-xs font-semibold text-clinical-700">
                                            {member.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-slate-600">{member.department}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-slate-600">{member.email}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {member.status === "Active" ? (
                                                <CheckCircle size={16} className="text-health-600" />
                                            ) : (
                                                <XCircle size={16} className="text-slate-400" />
                                            )}
                                            <span className={`text-sm font-medium ${member.status === "Active" ? "text-health-700" : "text-slate-600"
                                                }`}>
                                                {member.status}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="relative flex items-center justify-center">
                                            <button
                                                onClick={() => {
                                                    const memberId = member.id ?? null;
                                                    setOpenMenuId(openMenuId === memberId ? null : memberId);
                                                }}
                                                className="rounded-full p-2 hover:bg-slate-100"
                                            >
                                                <MoreVertical size={16} className="text-slate-600" />
                                            </button>

                                            {openMenuId === member.id && (
                                                <div className="absolute right-0 top-full z-10 mt-1 w-48 rounded-lg border border-slate-200 bg-white shadow-lg">
                                                    <button
                                                        onClick={() => {
                                                            handleEditStaff(member);
                                                            setOpenMenuId(null);
                                                        }}
                                                        className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                                                    >
                                                        <Edit2 size={16} /> Edit Information
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            handleStatusToggle(member);
                                                            setOpenMenuId(null);
                                                        }}
                                                        className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                                                    >
                                                        <Lock size={16} />
                                                        {member.status === "Active" ? "Deactivate" : "Activate"}
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            confirmDeleteStaff(member);
                                                        }}
                                                        className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50"
                                                    >
                                                        <Trash2 size={16} /> Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Edit Modal */}
            {editingStaff && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
                    <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-slate-900">Edit staff information</h2>
                                <p className="text-sm text-slate-500">Update core profile details for {editingStaff.fullName}</p>
                            </div>
                            <button onClick={closeEditModal} className="rounded-full p-2 text-slate-500 hover:bg-slate-100">
                                <X size={18} />
                            </button>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <label className="block text-sm font-medium text-slate-700">
                                Full name
                                <input
                                    type="text"
                                    value={editForm.fullName ?? ""}
                                    onChange={(e) => handleEditChange("fullName", e.target.value)}
                                    className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                                />
                            </label>
                            <label className="block text-sm font-medium text-slate-700">
                                Email
                                <input
                                    type="email"
                                    value={editForm.email ?? ""}
                                    onChange={(e) => handleEditChange("email", e.target.value)}
                                    className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                                />
                            </label>
                            <label className="block text-sm font-medium text-slate-700">
                                Mobile
                                <input
                                    type="text"
                                    value={editForm.mobile ?? ""}
                                    onChange={(e) => handleEditChange("mobile", e.target.value)}
                                    className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                                />
                            </label>
                            <label className="block text-sm font-medium text-slate-700">
                                Department
                                <input
                                    type="text"
                                    value={editForm.department ?? ""}
                                    onChange={(e) => handleEditChange("department", e.target.value)}
                                    className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                                />
                            </label>
                            <label className="block text-sm font-medium text-slate-700 sm:col-span-2">
                                Role
                                <input
                                    type="text"
                                    value={editForm.role ?? ""}
                                    onChange={(e) => handleEditChange("role", e.target.value)}
                                    className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                                />
                            </label>
                            <label className="block text-sm font-medium text-slate-700 sm:col-span-2">
                                Status
                                <select
                                    value={editForm.status ?? "Active"}
                                    onChange={(e) => handleEditChange("status", e.target.value)}
                                    className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </label>
                        </div>
                        {editError && <p className="mt-4 text-sm text-rose-600">{editError}</p>}
                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={closeEditModal}
                                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveEdit}
                                disabled={isEditSaving}
                                className="rounded-lg bg-clinical-600 px-4 py-2 text-sm font-semibold text-white hover:bg-clinical-700 disabled:opacity-60"
                            >
                                Save changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deletingStaff && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
                    <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
                        <div className="mb-4 flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-lg font-semibold text-slate-900">Confirm delete</h2>
                                <p className="mt-2 text-sm text-slate-600">
                                    Are you sure you want to delete {deletingStaff.fullName}? This action cannot be undone.
                                </p>
                            </div>
                            <button
                                onClick={cancelDelete}
                                className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        {deleteError && <p className="mb-4 text-sm text-rose-600">{deleteError}</p>}
                        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                            <button
                                onClick={cancelDelete}
                                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteStaff}
                                disabled={isDeleteProcessing}
                                className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-60"
                            >
                                {isDeleteProcessing ? "Deleting..." : "Delete staff"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Summary */}
            <div className="rounded-lg bg-slate-50 px-6 py-4">
                <p className="text-sm text-slate-600">
                    Showing <span className="font-semibold text-slate-900">{filteredStaff.length}</span> of{" "}
                    <span className="font-semibold text-slate-900">{staff.length}</span> staff members
                </p>
            </div>
        </div>
    );
}
