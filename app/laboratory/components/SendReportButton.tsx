"use client"
import React from 'react'

export default function SendReportButton({ reportId }: { reportId: string }) {
  const handleSend = () => {
    if (confirm('Send report to doctor?')) {
      // Placeholder - wire to API later
      alert(`Report ${reportId} sent`)
    }
  }

  return (
    <button onClick={handleSend} className="px-3 py-1 rounded bg-blue-600 text-white">
      Send to Doctor
    </button>
  )
}
