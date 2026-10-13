import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // El panel no se lista acá a propósito (ya tiene noindex) para no publicar su dirección.
      disallow: ["/api/", "/cart", "/checkout"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
