"use client";

import Image from "next/image";
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

      <div className="flex flex-wrap items-center gap-3">
        <input
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
          className="text-sm"
        />

        {value ? (
          <div className="flex items-center gap-3">
            <div className="relative h-14 w-14 overflow-hidden rounded-xl border bg-white">
              <Image src={value} alt="Preview" fill className="object-contain p-2" />
            </div>
            <button
              type="button"
              onClick={() => {
                setValue("");
                setUpload({ state: "idle" });
              }}
              className="rounded-full border px-3 py-1.5 text-sm hover:bg-zinc-50"
            >
              Quitar
            </button>
          </div>
        ) : null}
      </div>

      {upload.state === "uploading" ? (
        <div className="text-sm text-zinc-600">Subiendo...</div>
      ) : null}
      {upload.state === "error" ? (
        <div className="text-sm text-red-700">{upload.message}</div>
      ) : null}
      {!canUpload ? (
        <div className="text-sm text-zinc-600">
          Configurá NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME y NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET en .env
        </div>
      ) : null}
    </div>
  );
}
