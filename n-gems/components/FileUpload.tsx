"use client";

import { useRef, useState } from "react";

type FileUploadProps = {
  label?: string;
  hint?: string;
  onFileChange?: (file: File | null) => void;
};

export default function FileUpload({
  label = "Hospital Logo",
  hint = "PNG or JPG, up to 2MB — used on your hospital's registry profile.",
  onFileChange,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = (file: File | null) => {
    onFileChange?.(file);
    if (!file) {
      setPreview(null);
      setFileName(null);
      return;
    }
    setFileName(file.name);
    setPreview(URL.createObjectURL(file));
  };

  return (
    <div>
      <label className="field-label">{label}</label>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFile(e.dataTransfer.files?.[0] ?? null);
        }}
        className={`flex cursor-pointer items-center gap-4 rounded-lg border border-dashed px-4 py-4 transition-colors ${
          dragging ? "border-clinical-400 bg-clinical-50" : "border-slate-200 hover:border-slate-300 bg-white"
        }`}
      >
        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-50">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Hospital logo preview" className="h-full w-full object-cover" />
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-navy-300">
              <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
              <circle cx="9" cy="10" r="1.6" stroke="currentColor" strokeWidth="1.6" />
              <path d="M4 16.5 8.5 12l3 3 3-2.5L21 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-navy-700">
            {fileName ?? "Click or drag a file to upload"}
          </p>
          <p className="mt-0.5 text-xs text-navy-300">{hint}</p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
        />
      </div>
    </div>
  );
}
