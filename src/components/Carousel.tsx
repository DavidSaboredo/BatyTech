"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { isDemoPhoto } from "@/lib/product-image";

export type CarouselSlide = {
  title: string;
  subtitle?: string;
  href: string;
  imageUrl: string;
};

function Chevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="h-4 w-4">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d={direction === "left" ? "M14.5 5.5 8 12l6.5 6.5" : "M9.5 5.5 16 12l-6.5 6.5"}
      />
    </svg>
  );
}

export function Carousel({ slides, intervalMs = 4500 }: { slides: CarouselSlide[]; intervalMs?: number }) {
  const safeSlides = useMemo(() => slides.filter((s) => s && s.href && s.imageUrl), [slides]);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (safeSlides.length <= 1 || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % safeSlides.length), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs, safeSlides.length, paused]);

  if (safeSlides.length === 0) return null;
  const slide = safeSlides[index % safeSlides.length]!;
  const photo = isDemoPhoto(slide.imageUrl);
  const go = (step: number) => setIndex((current) => (current + step + safeSlides.length) % safeSlides.length);
  const arrowClass =
    "absolute top-1/2 z-10 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-200 bg-white/95 text-zinc-900 shadow-sm hover:border-amber-400 hover:text-amber-600";

  return (
    <div
      className="surface-card relative flex h-full flex-col overflow-hidden rounded-3xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carrusel"
      aria-label="Productos destacados"
    >
      <div className={`relative min-h-60 w-full flex-1 sm:min-h-[18rem] ${photo ? "bg-zinc-950" : "bg-zinc-50"}`}>
        <Link href={slide.href} className="absolute inset-0" tabIndex={-1} aria-hidden="true">
          <Image
            key={slide.imageUrl}
            src={slide.imageUrl}
            alt=""
            fill
            sizes="(min-width: 1024px) 560px, 100vw"
            className={photo ? "object-contain" : "object-contain p-8 sm:p-10"}
            priority
          />
        </Link>
        {safeSlides.length > 1 ? (
          <>
            <button type="button" onClick={() => go(-1)} className={`${arrowClass} left-3`} aria-label="Producto anterior">
              <Chevron direction="left" />
            </button>
            <button type="button" onClick={() => go(1)} className={`${arrowClass} right-3`} aria-label="Producto siguiente">
              <Chevron direction="right" />
            </button>
            <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5 rounded-full border border-zinc-200 bg-white/95 px-2.5 py-1.5 shadow-sm">
              {safeSlides.map((item, i) => (
                <button
                  key={item.href}
                  type="button"
                  onClick={() => setIndex(i)}
                  className={`h-2 rounded-full ${i === index ? "w-5 bg-amber-400" : "w-2 bg-zinc-300 hover:bg-zinc-400"}`}
                  aria-label={`Ver ${item.title}`}
                  aria-current={i === index}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>
      <Link href={slide.href} className="group border-t border-zinc-200 bg-white px-5 py-4">
        <div className="line-clamp-2 text-base font-semibold text-zinc-900 group-hover:text-amber-700 sm:text-lg">{slide.title}</div>
        <div className="mt-1 flex items-center justify-between gap-3 text-sm">
          {slide.subtitle ? <span className="font-semibold text-zinc-900">{slide.subtitle}</span> : <span />}
          <span className="font-medium text-amber-700 group-hover:underline group-hover:underline-offset-4">Ver producto</span>
        </div>
      </Link>
    </div>
  );
}
