import React from 'react'

type Props = { params: { id: string } }

export default function DispensePage({ params }: Props) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Dispense Medication</h1>
      <p className="mt-2">Dispense record ID: {params.id}</p>
      <p className="mt-4 text-sm text-muted-foreground">Dispense action UI (mark dispensed) goes here.</p>
    </div>
  )
}
