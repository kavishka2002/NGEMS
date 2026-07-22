import React from 'react'

type Props = { params: { id: string } }

export default function UploadTestResultPage({ params }: Props) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Upload Test Result</h1>
      <p className="mt-2">Report ID: {params.id}</p>
      <p className="mt-4 text-sm text-muted-foreground">Upload form placeholder.</p>
    </div>
  )
}
