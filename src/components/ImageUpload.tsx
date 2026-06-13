"use client";

import { useMemo, useState } from "react";

type UploadState =
  | { state: "idle" }
  | { state: "uploading" }
  | { state: "done"; url: string }
  | { state: "error"; message: string };

export function ImageUpload({
  name,
  defaultValue,
  label,
}: {
  name: string;
  defaultValue?: string;
  label: string;
}) {
  const [value, setValue] = useState(defaultValue || "");
  const [upload, setUpload] = useState<UploadState>({ state: "idle" });

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "";
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "";
  const folder = process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER || "";

  const canUpload = useMemo(() => Boolean(cloudName && uploadPreset), [cloudName, uploadPreset]);

  return (
    <div className="flex flex-col gap-2">
      <div className="text-sm font-medium">{label}</div>

      <input type="hidden" name={name} value={value} />

      <div className="grid gap-3 rounded-2xl border border-zinc-200 bg-zinc-50/70 p-4">
        <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
          <div className="flex flex-col gap-1">
            <label htmlFor={`${name}-url`} className="text-sm font-medium text-zinc-800">
              URL de la imagen
            </label>
            <input
              id={`${name}-url`}
              type="url"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setUpload({ state: "idle" });
              }}
              placeholder="Pegá una URL o subí una imagen"
              className="h-11 rounded-xl border border-zinc-200 bg-white px-3 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <label
              htmlFor={`${name}-file`}
              className={`inline-flex h-11 cursor-pointer items-center justify-center rounded-full border px-4 text-sm font-semibold ${
                !canUpload || upload.state === "uploading"
                  ? "cursor-not-allowed border-zinc-200 bg-zinc-100 text-zinc-400"
                  : "border-zinc-900 bg-zinc-900 text-white hover:border-amber-400 hover:text-amber-300"
              }`}
            >
              {upload.state === "uploading" ? "Subiendo..." : "Subir archivo"}
            </label>
            <input
              id={`${name}-file`}
              type="file"
              accept="image/*"
              disabled={!canUpload || upload.state === "uploading"}
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                if (!canUpload) {
                  setUpload({ state: "error", message: "Falta configurar Cloudinary" });
                  return;
                }

                setUpload({ state: "uploading" });
                try {
                  const fd = new FormData();
                  fd.append("file", file);
                  fd.append("upload_preset", uploadPreset);
                  if (folder) fd.append("folder", folder);

                  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                    method: "POST",
                    body: fd,
                  });
                  const data = (await res.json()) as { secure_url?: string; error?: { message?: string } };
                  if (!res.ok || !data.secure_url) {
                    setUpload({ state: "error", message: data.error?.message || "Error subiendo imagen" });
                    return;
                  }
                  setValue(data.secure_url);
                  setUpload({ state: "done", url: data.secure_url });
                } catch {
                  setUpload({ state: "error", message: "Error subiendo imagen" });
                }
              }}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => {
                setValue("");
                setUpload({ state: "idle" });
              }}
              className="rounded-full border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 hover:border-amber-400 hover:text-zinc-950"
            >
              Quitar
            </button>
          </div>
        </div>

        {value ? (
          <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-3">
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 p-2">
              <img src={value} alt="Preview" className="max-h-full max-w-full object-contain" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">Vista previa</div>
              <div className="truncate text-sm text-zinc-700">{value}</div>
            </div>
          </div>
        ) : null}
      </div>

      {upload.state === "uploading" ? (
        <div className="text-sm text-zinc-600">Subiendo...</div>
      ) : null}
      {upload.state === "done" ? (
        <div className="text-sm text-emerald-700">Imagen subida correctamente.</div>
      ) : null}
      {upload.state === "error" ? (
        <div className="text-sm text-red-700">{upload.message}</div>
      ) : null}
      {!canUpload ? (
        <div className="text-sm text-zinc-600">
          Si Cloudinary no está disponible, podés pegar una URL manual de imagen.
        </div>
      ) : null}
    </div>
  );
}
