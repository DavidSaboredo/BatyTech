import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

// Se regenera cada hora para sumar los productos nuevos sin redeployar.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const pages: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, changeFrequency: "daily", priority: 1 },
    { url: `${siteUrl}/products`, changeFrequency: "daily", priority: 0.9 },
  ];

  try {
    const { prisma } = await import("@/lib/db");
    const products = await prisma.product.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
      take: 1000,
    });
    for (const product of products) {
      pages.push({
        url: `${siteUrl}/products/${product.slug}`,
        lastModified: product.updatedAt,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  } catch {
    // Sin base disponible: el sitemap sale igual con las páginas principales.
  }

  return pages;
}
