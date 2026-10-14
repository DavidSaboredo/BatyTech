"use client";

import Image from "next/image";
import { useState } from "react";
import { isDemoPhoto, productImageUrl } from "@/lib/product-image";

type GalleryImage = { id: string; url: string; alt: string };

export function ProductGallery({ images, name }: { images: GalleryImage[]; name: string }) {
  const [active, setActive] = useState(0);
  const list = images.length > 0 ? images : [{ id: "sin-foto", url: "", alt: name }];
  const current = list[Math.min(active, list.length - 1)]!;
  const photo = isDemoPhoto(current.url);

  return (
    <div className="surface-card overflow-hidden rounded-3xl">
      <div className={`relative aspect-square w-full sm:aspect-[4/3] ${photo ? "bg-zinc-950" : "bg-zinc-50"}`}>
        <Image
          key={current.id}
          src={productImageUrl(current.url)}
          alt={current.alt || name}
          fill
          sizes="(min-width: 1024px) 560px, 100vw"
          className={photo ? "object-contain" : "object-contain p-6 sm:p-10"}
          priority
        />
      </div>
      {list.length > 1 ? (
        <div className="flex gap-2 overflow-x-auto border-t border-zinc-200 bg-white p-3">
          {list.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Ver imagen ${i + 1} de ${list.length}`}
              aria-current={i === active}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border bg-zinc-50 sm:h-20 sm:w-20 ${
                i === active ? "border-amber-400 ring-2 ring-amber-200" : "border-zinc-200 hover:border-amber-300"
              }`}
            >
              <Image
                src={productImageUrl(img.url)}
                alt=""
                fill
                sizes="80px"
                className={isDemoPhoto(img.url) ? "object-cover" : "object-contain p-1.5"}
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
