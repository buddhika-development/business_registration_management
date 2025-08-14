// components/documents/FileCard.jsx
"use client";
import React, { useState } from "react";
import { IconUpload as UploadIcon } from "@/components/ui/icons/icons";

const DEFAULT_MAX_FILE_BYTES = 10 * 1024 * 1024; // 10MB
const DEFAULT_ALLOWED_MIME = ["application/pdf"]; // PDF only

export default function FileCard({
  label,
  hint,
  value,                 // File | null
  onChange,              // (file: File) => void
  onClear,               // () => void
  required = false,
  error = "",            // external error text from parent (e.g., "This file is required.")
  allowedMime = DEFAULT_ALLOWED_MIME,
  maxBytes = DEFAULT_MAX_FILE_BYTES,
}) {
  const [localErr, setLocalErr] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const isPdfByExt = (name = "") => name.toLowerCase().endsWith(".pdf");

  const validateAndSet = (file) => {
    if (!file) return;
    const typeOk = allowedMime.includes(file.type) || (file.type === "" && isPdfByExt(file.name));
    if (!typeOk) return setLocalErr("Only PDF files are allowed.");
    if (file.size > maxBytes) return setLocalErr("File too large (max 10MB).");
    setLocalErr("");
    onChange(file);
  };

  const handleInput = (e) => validateAndSet(e.target.files?.[0] || null);
  const handleDrop  = (e) => { e.preventDefault(); setDragOver(false); validateAndSet(e.dataTransfer.files?.[0] || null); };

  const showErr = error || localErr;

  return (
    <div className="group relative flex flex-col gap-2">
      <label className="block text-sm font-semibold text-base-text">
        {label}
        {required && <span className="text-red-600 ml-1">*</span>}
        {hint && <span className="text-base-text/60 font-normal"> — {hint}</span>}
      </label>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={[
          "rounded-xl border border-transparent p-4 transition",
          "bg-indigo-50/80 focus-within:bg-white focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20",
          dragOver ? "bg-white ring-2 ring-primary/20 border-primary" : "hover:bg-indigo-50",
          value ? "ring-1 ring-primary/10" : "",
          showErr ? "ring-1 ring-red-300" : "",
        ].join(" ")}
      >
        <div className="flex items-center gap-4">
          <UploadIcon />
          <div className="flex-1">
            {!value ? (
              <>
                <p className="text-sm text-base-text">
                  <span className="font-semibold">Drag & drop</span> or <span className="font-semibold">click to upload</span>
                </p>
                <p className="text-xs text-base-text/70">PDF only · Max 10MB</p>
              </>
            ) : (
              <>
                <p className="text-sm text-base-text">
                  <span className="font-semibold">{value.name}</span>{" "}
                  <span className="text-base-text/60">({formatBytes(value.size)})</span>
                </p>
                <p className="text-xs text-base-text/70">Replace by dropping or clicking “Change file”.</p>
              </>
            )}
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <label className="inline-flex">
              <input type="file" className="hidden" accept="application/pdf,.pdf" onChange={handleInput} />
              <span className="px-3 py-2 rounded-lg border text-sm bg-white hover:bg-gray-50 cursor-pointer">
                {value ? "Change file" : "Choose file"}
              </span>
            </label>
            {value && (
              <button
                type="button"
                onClick={() => { setLocalErr(""); onClear(); }}
                className="px-3 py-2 rounded-lg border text-sm bg-white hover:bg-gray-50"
                title="Remove file"
              >
                Remove
              </button>
            )}
          </div>
        </div>
      </div>

      {showErr && <p className="text-xs text-red-600">{showErr}</p>}
    </div>
  );
}

function formatBytes(bytes) {
  if (!bytes && bytes !== 0) return "";
  const units = ["B", "KB", "MB", "GB"];
  let i = 0, v = bytes;
  while (v >= 1024 && i < units.length - 1) { v /= 1024; i++; }
  return `${v.toFixed(v < 10 && i > 0 ? 1 : 0)} ${units[i]}`;
}
