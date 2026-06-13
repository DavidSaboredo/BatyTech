import { prisma } from "@/lib/db";
import { slugify } from "@/lib/slug";

export function toInt(value: FormDataEntryValue | null, fallback: number) {
  const n = Math.floor(Number(value));
  return Number.isFinite(n) ? n : fallback;
}

export function toPerformanceTier(value: FormDataEntryValue | null) {
  const tier = String(value || "").trim();
  return tier === "ENTRY" || tier === "MID" || tier === "HIGH" ? tier : null;
}

export async function resolveBrandId({
  brandId,
  brandName,
}: {
  brandId: string;
  brandName: string;
}) {
  const manualBrandName = brandName.trim();
  if (manualBrandName) {
    const slug = slugify(manualBrandName);
    if (!slug) return "";

    const brand = await prisma.brand.upsert({
      where: { slug },
      update: { name: manualBrandName },
      create: { name: manualBrandName, slug },
      select: { id: true },
    });

    return brand.id;
  }

  return brandId.trim();
}
