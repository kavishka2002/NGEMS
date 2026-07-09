"use client";

import { UserPlus } from "lucide-react";
import Button from "@/components/Button";
import { staffOverview } from "@/lib/data";

const total = staffOverview.reduce((sum, r) => sum + r.count, 0);

export default function DataTable() {
  return (
    <div className="rounded-card border border-slate-border bg-white shadow-card">
      <div className="flex items-center justify-between border-b border-slate-border px-5 py-4">
        <div>
          <h3 className="font-display text-base font-semibold text-navy">Staff Overview</h3>
          <p className="text-xs text-navy/40">Active staff by role</p>
        </div>
        <Button icon={UserPlus} variant="primary" className="text-xs px-3 py-2">
          Create Staff Account
        </Button>
      </div>

      <table className="w-full text-left text-sm">
        <thead>
          <tr className="text-[11px] uppercase tracking-wider text-navy/40">
            <th className="px-5 py-2.5 font-medium">Role</th>
            <th className="px-5 py-2.5 font-medium">Count</th>
            <th className="hidden px-5 py-2.5 font-medium sm:table-cell">Share</th>
          </tr>
        </thead>
        <tbody>
          {staffOverview.map((row, i) => {
            const pct = Math.round((row.count / total) * 100);
            return (
              <tr
                key={row.role}
                className={i !== staffOverview.length - 1 ? "border-b border-slate-border" : ""}
              >
                <td className="px-5 py-3 font-medium text-navy">{row.role}</td>
                <td className="px-5 py-3 font-mono text-navy/80">{row.count}</td>
                <td className="hidden px-5 py-3 sm:table-cell">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-bg">
                      <div className="h-full rounded-full bg-clinical-600" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs text-navy/40">{pct}%</span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="border-t border-slate-border bg-slate-bg">
            <td className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-navy/50">Total</td>
            <td className="px-5 py-2.5 font-mono text-sm font-semibold text-navy">{total}</td>
            <td className="hidden sm:table-cell" />
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
