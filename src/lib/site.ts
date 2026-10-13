import type { Metadata } from "next";

export const siteName = "BatysTech";

export const siteDescription =
  "Tienda online de componentes de PC y PCs armadas: procesadores, placas de video, memorias, almacenamiento y más. Elegí online y confirmá tu pedido por WhatsApp.";

export const defaultOgImage = {
  url: "/og/batystech.jpg",
  width: 1200,
  height: 630,
  alt: "BatysTech · Componentes de PC y PCs armadas",
};

type ShareImage = { url: string; width?: number; height?: number; alt?: string };

// Next reemplaza (no combina) openGraph y twitter del layout, así que cada página los arma completos.
export function pageMetadata(args: {
  title: string;
  description: string;
  path: string;
  image?: ShareImage;
  noindex?: boolean;
}): Metadata {
  const image = args.image ?? defaultOgImage;
  const fullTitle = `${args.title} | ${siteName}`;
  return {
    title: args.title,
    description: args.description,
    alternates: { canonical: args.path },
    ...(args.noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      type: "website",
      locale: "es_AR",
      siteName,
      url: args.path,
      title: fullTitle,
      description: args.description,
      images: [image],
    },
    twitter: { card: "summary_large_image", title: fullTitle, description: args.description, images: [image.url] },
  };
}

// URL pública del sitio (solo servidor). En Vercel se toma el dominio de producción automáticamente.
export function getSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

// Número de WhatsApp de la tienda, solo dígitos (ej: 5491112345678). Vacío si no está configurado.
export const whatsappNumber = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "").replace(/\D/g, "");

export function whatsappHref(message?: string) {
  if (!whatsappNumber) return "";
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${whatsappNumber}${text}`;
}

// Redes sociales: se muestran solo si están configuradas.
export const socialLinks = [
  { label: "Instagram", href: process.env.NEXT_PUBLIC_INSTAGRAM_URL?.trim() ?? "" },
  { label: "TikTok", href: process.env.NEXT_PUBLIC_TIKTOK_URL?.trim() ?? "" },
].filter((link) => link.href.startsWith("http"));
