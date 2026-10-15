import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/AddToCartButton";
import { ProductGallery } from "@/components/ProductGallery";
import { SaleTerms } from "@/components/SaleTerms";
import { getPerformanceTierLabel } from "@/lib/performance-tier";
import { formatMoney } from "@/lib/money";
import { productImageUrl } from "@/lib/product-image";
import { defaultOgImage, pageMetadata, whatsappHref } from "@/lib/site";
import { getStorefrontProductBySlug } from "@/lib/storefront-data";

export const dynamic = "force-dynamic";

type ProductPageProps = { params: Promise<{ slug: string }> };

// Foto del producto lista para compartir (1200x630 con fondo blanco si viene de Cloudinary).
function shareImage(url: string | undefined, alt: string) {
  if (url && /^https:\/\/res\.cloudinary\.com\/.+\/image\/upload\//.test(url)) {
    return {
      url: url.replace("/image/upload/", "/image/upload/c_pad,b_white,w_1200,h_630,f_jpg,q_auto/"),
      width: 1200,
      height: 630,
      alt,
    };
  }
  if (url && /^https?:\/\//.test(url)) return { url, alt };
  return defaultOgImage;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { product } = await getStorefrontProductBySlug(slug);
  if (!product || !product.isActive) {
    return { title: "Producto no encontrado", robots: { index: false } };
  }

  const summary = product.description.replace(/\s+/g, " ").trim();
  const description = `${formatMoney(product.priceCents)} · ${
    summary.length > 150 ? `${summary.slice(0, 147).trimEnd()}...` : summary
  }`;
  return pageMetadata({
    title: product.name,
    description,
    path: `/products/${product.slug}`,
    image: shareImage(product.images[0]?.url, product.name),
  });
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const p = await params;
  const { product, usingFallback } = await getStorefrontProductBySlug(p.slug);

  if (!product || !product.isActive) notFound();

  const imageUrl = productImageUrl(product.images[0]?.url);
  const performanceTierLabel = getPerformanceTierLabel(product.performanceTier);
  const toLines = (value: string | null) => value?.split("\n").map((line) => line.trim()).filter(Boolean) ?? [];
  const specs = toLines(product.specs);
  const fpsGames = toLines(product.fpsGames);
  // Las descripciones copiadas de otros sitios suelen traer muchos saltos de línea seguidos.
  const description = product.description.replace(/\r\n?/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
  const consultHref = whatsappHref(`¡Hola BatysTech! Quiero consultar por ${product.name} (SKU ${product.sku}).`);
  const inStock = product.stock > 0;

  return (
    <div className="flex flex-col gap-5">
      {usingFallback ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Estás viendo un producto de ejemplo porque la base de datos no está conectada (solo en desarrollo).
        </div>
      ) : null}

      <nav aria-label="Ruta de navegación" className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-amber-100/85">
        <Link href="/products" className="hover:text-amber-300 hover:underline underline-offset-4">
          Productos
        </Link>
        <span aria-hidden="true">/</span>
        <Link href={`/products?category=${product.category.slug}`} className="hover:text-amber-300 hover:underline underline-offset-4">
          {product.category.name}
        </Link>
        <span aria-hidden="true">/</span>
        <Link href={`/products?brand=${product.brand.slug}`} className="hover:text-amber-300 hover:underline underline-offset-4">
          {product.brand.name}
        </Link>
      </nav>

      <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
        <div className="self-start lg:sticky lg:top-24">
          <ProductGallery
            images={product.images.map((img) => ({ id: img.id, url: img.url, alt: img.alt }))}
            name={product.name}
          />
        </div>

        <div className="flex min-w-0 flex-col gap-4">
          <div className="flex flex-col gap-2">
            {performanceTierLabel ? (
              <div className="inline-flex w-fit rounded-full bg-zinc-950 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">
                Gama {performanceTierLabel}
              </div>
            ) : null}
            <h1 className="section-heading text-2xl font-semibold tracking-tight text-amber-300 sm:text-3xl">{product.name}</h1>
            <div className="text-sm text-amber-100/75">
              {product.brand.name} · SKU {product.sku}
            </div>
            <div className="text-3xl font-bold text-amber-200">{formatMoney(product.priceCents)}</div>
          </div>

          <SaleTerms price={product.priceCents} />

          <div className="surface-card flex flex-col gap-4 rounded-3xl p-5">
            <div className="flex items-center gap-2 text-sm font-medium">
              <span className={`h-2 w-2 rounded-full ${inStock ? "bg-emerald-500" : "bg-red-500"}`} />
              <span className={inStock ? "text-emerald-700" : "text-red-600"}>
                {inStock
                  ? `En stock · ${product.stock} ${product.stock === 1 ? "disponible" : "disponibles"}`
                  : "Sin stock por ahora"}
              </span>
            </div>
            <AddToCartButton
              product={{
                id: product.id,
                name: product.name,
                slug: product.slug,
                priceCents: product.priceCents,
                imageUrl,
                stock: product.stock,
              }}
              showQuantitySelector
            />
            {consultHref ? (
              <a
                href={consultHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-zinc-700 hover:text-amber-700 hover:underline underline-offset-4"
              >
                {inStock ? "¿Tenés dudas? Consultanos por WhatsApp" : "Consultá por WhatsApp cuándo vuelve a entrar"}
              </a>
            ) : null}
          </div>

          {description ? (
            <div className="surface-card rounded-3xl p-5">
              <h2 className="text-sm font-semibold text-zinc-900">Descripción</h2>
              <div className="mt-2 whitespace-pre-line break-words text-sm leading-6 text-zinc-700">{description}</div>
            </div>
          ) : null}

          {specs.length > 0 ? (
            <div className="surface-card rounded-3xl p-5">
              <h2 className="text-sm font-semibold text-zinc-900">Características</h2>
              <ul className="mt-3 flex flex-col gap-2 text-sm text-zinc-700">
                {specs.map((item, index) => (
                  <li key={`${index}-${item}`} className="flex items-start gap-2">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-amber-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {fpsGames.length > 0 ? (
            <div className="surface-card rounded-3xl p-5">
              <h2 className="text-sm font-semibold text-zinc-900">FPS en juegos del momento</h2>
              <ul className="mt-3 flex flex-col gap-2 text-sm text-zinc-700">
                {fpsGames.map((item, index) => (
                  <li key={`${index}-${item}`} className="flex items-start gap-2">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-zinc-900" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-zinc-500">
                Valores aproximados: varían según la configuración y la versión del juego.
              </p>
            </div>
          ) : null}

          <Link
            href="/products"
            className="inline-flex w-fit rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:border-amber-400 hover:text-zinc-950"
          >
            Volver a productos
          </Link>
        </div>
      </div>
    </div>
  );
}
