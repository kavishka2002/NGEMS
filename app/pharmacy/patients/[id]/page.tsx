import React from 'react'

type Props = { params: { id: string } }

export default function PatientHistoryPage({ params }: Props) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Patient History</h1>
      <p className="mt-2">Patient ID: {params.id}</p>
      <p className="mt-4 text-sm text-muted-foreground">Patient medication/history UI placeholder.</p>
    </div>
  )
}
