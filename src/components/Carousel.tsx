"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export type CarouselSlide = {
  title: string;
  subtitle?: string;
  href: string;
  imageUrl: string;
};

export function Carousel({ slides, intervalMs = 4500 }: { slides: CarouselSlide[]; intervalMs?: number }) {
  const safeSlides = useMemo(() => slides.filter((s) => s && s.href && s.imageUrl), [slides]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (safeSlides.length <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % safeSlides.length), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs, safeSlides.length]);

  if (safeSlides.length === 0) return null;
  const slide = safeSlides[index]!;

  return (
    <div className="surface-card relative flex h-full flex-col overflow-hidden rounded-3xl">
      <Link href={slide.href} className="flex h-full flex-col">
        <div className="relative h-56 w-full flex-1 bg-zinc-50 sm:min-h-[18rem]">
          <Image src={slide.imageUrl} alt={slide.title} fill className="object-contain p-10" priority />
        </div>
        <div className="border-t border-zinc-200 bg-white px-5 py-4">
          <div className="text-lg font-semibold text-zinc-900">{slide.title}</div>
          {slide.subtitle ? <div className="text-sm text-zinc-600">{slide.subtitle}</div> : null}
        </div>
      </Link>
      {safeSlides.length > 1 ? (
        <>
          <button
            type="button"
            onClick={() => setIndex((current) => (current - 1 + safeSlides.length) % safeSlides.length)}
            className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-zinc-900 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm hover:border-amber-400 hover:text-amber-600"
            aria-label="Slide anterior"
          >
            {"<"}
          </button>
          <button
            type="button"
            onClick={() => setIndex((current) => (current + 1) % safeSlides.length)}
            className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-zinc-900 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm hover:border-amber-400 hover:text-amber-600"
            aria-label="Slide siguiente"
          >
            {">"}
          </button>
        </>
      ) : null}
      {safeSlides.length > 1 ? (
        <div className="absolute bottom-3 right-3 flex gap-1 rounded-full border border-zinc-200 bg-white px-2 py-1 shadow-sm">
          {safeSlides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              className={`h-2 w-2 rounded-full ${i === index ? "bg-amber-400" : "bg-zinc-300"}`}
              aria-label={`Ir al slide ${i + 1}`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
