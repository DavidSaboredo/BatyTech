import Link from "next/link";
import { Carousel } from "@/components/Carousel";
import { GeekCatSticker } from "@/components/GeekCatSticker";
import { ProductCard } from "@/components/ProductCard";
import { formatMoney } from "@/lib/money";
import { performanceTierOptions } from "@/lib/performance-tier";
import { productImageUrl } from "@/lib/product-image";
import { socialLinks, whatsappHref } from "@/lib/site";
import { getHomeStorefrontData } from "@/lib/storefront-data";

export const dynamic = "force-dynamic";

const iconProps = {
  "aria-hidden": true,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className: "h-5 w-5",
};

function ChipIcon() {
  return (
    <svg {...iconProps}>
      <rect x="6" y="6" width="12" height="12" rx="2" />
      <rect x="9.5" y="9.5" width="5" height="5" rx="1" />
      <path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3" />
    </svg>
  );
}

function WrenchIcon() {
  return (
    <svg {...iconProps}>
      <path d="M14.7 6.3a4 4 0 0 0 5 5L21 13l-1.5 1.5-1.3-1.3a4 4 0 0 1-5-5L6.3 15.1a2 2 0 1 0 2.6 2.6l6.3-6.9" />
      <path d="M14.7 6.3 17 4l3 3-2.3 2.3" />
    </svg>
  );
}

// Fondo oscuro propio: los títulos ámbar no quedan sobre las líneas doradas del fondo general.
const sectionShell =
  "scroll-mt-24 rounded-[28px] border border-white/10 bg-zinc-950/90 p-5 shadow-[0_24px_60px_rgba(0,0,0,0.24)] sm:rounded-[32px] sm:p-8";
const sectionBadge =
  "inline-flex w-fit rounded-full bg-zinc-950 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-300";
const chipClass =
  "inline-flex min-h-11 shrink-0 items-center whitespace-nowrap rounded-full border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-800 hover:border-amber-400 hover:bg-amber-50 hover:text-zinc-950 lg:rounded-2xl";
const groupLabel = "hidden text-sm font-semibold text-zinc-300 lg:block";

export default async function Home() {
  const { categories, featured, usingFallback } = await getHomeStorefrontData();
  const contactHref = whatsappHref("¡Hola BatysTech! Quiero hacer una consulta.");

  const highlights = ["Stock actualizado", "Asesoramiento para armar tu PC", "Atención directa por WhatsApp"];
  const aboutPoints = [
    "Te ayudamos a elegir piezas compatibles entre sí y equilibradas para lo que querés hacer.",
    "PCs armadas de gama de entrada, media y alta para que encuentres rápido el equipo que buscás.",
  ];
  const buySteps = [
    { title: "Elegí tus productos", text: "Recorré el catálogo y sumá al carrito lo que necesitás." },
    { title: "Completá tus datos", text: "En “Finalizar compra” dejás tu nombre, email y teléfono." },
    { title: "Confirmá por WhatsApp", text: "Te abrimos el chat con el pedido armado para coordinar el pago y la entrega." },
  ];
  const services = [
    {
      title: "Asesoramiento en componentes",
      description: "Te ayudamos a elegir los componentes correctos y a sacarle el máximo a tu presupuesto.",
      cta: "Pedir asesoramiento",
      href: whatsappHref("¡Hola BatysTech! Quiero asesoramiento para armar o mejorar mi PC.") || "/products",
      icon: <ChipIcon />,
    },
    {
      title: "Soporte y mantenimiento",
      description: "Resolvemos mejoras, actualizaciones y problemas técnicos puntuales de tu equipo.",
      cta: "Pedir soporte",
      href: whatsappHref("¡Hola BatysTech! Necesito soporte técnico para mi equipo.") || "/#contacto",
      icon: <WrenchIcon />,
    },
  ];

  const slides = featured.slice(0, 4).map((p) => ({
    title: p.name,
    subtitle: formatMoney(p.priceCents),
    href: `/products/${p.slug}`,
    imageUrl: productImageUrl(p.images[0]?.url),
  }));

  const cards = featured.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    priceCents: p.priceCents,
    stock: p.stock,
    imageUrl: productImageUrl(p.images[0]?.url),
    performanceTier: p.performanceTier,
  }));

  return (
    <div className="flex flex-col gap-8 sm:gap-12">
      {usingFallback ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Estás viendo productos de ejemplo porque la base de datos no está conectada (solo en desarrollo).
        </div>
      ) : null}

      <section className={`grid items-stretch gap-6 ${slides.length > 0 ? "lg:grid-cols-[1.05fr_1fr]" : ""}`}>
        <div className="surface-card flex flex-col justify-center gap-5 rounded-3xl p-5 sm:gap-6 sm:p-8">
          <div className={sectionBadge}>Tienda online de hardware</div>
          <div className="flex flex-col gap-3 sm:gap-4">
            <h1 className="section-heading text-[1.9rem] font-semibold leading-tight tracking-tight text-zinc-950 sm:text-5xl sm:leading-[1.05]">
              Componentes de PC y PCs armadas para tu próximo setup
            </h1>
            <p className="max-w-2xl text-base leading-7 text-zinc-600 sm:text-lg">
              Procesadores, placas de video, motherboards, memorias, almacenamiento y más. Elegí online, sumá al carrito y
              confirmá tu pedido por WhatsApp.
            </p>
          </div>
          <ul className="flex flex-col gap-2 text-sm text-zinc-600 sm:flex-row sm:flex-wrap sm:gap-x-5">
            {highlights.map((highlight, index) => (
              <li key={highlight} className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${index === 1 ? "bg-zinc-950" : "bg-amber-400"}`} />
                {highlight}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/products"
              className="inline-flex min-h-11 items-center rounded-full border border-amber-400 bg-amber-400 px-5 py-2.5 text-sm font-semibold text-zinc-900 shadow-sm hover:bg-amber-300"
            >
              Ver productos
            </Link>
            <Link
              href={contactHref || "/#como-comprar"}
              target={contactHref ? "_blank" : undefined}
              rel={contactHref ? "noopener noreferrer" : undefined}
              className="inline-flex min-h-11 items-center rounded-full border border-zinc-900 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-900 hover:bg-zinc-900 hover:text-white"
            >
              {contactHref ? "Consultar por WhatsApp" : "Cómo comprar"}
            </Link>
          </div>
        </div>
        {/* En celular el carrusel repetía los destacados y los empujaba dos pantallas: se muestra desde escritorio. */}
        {slides.length > 0 ? (
          <div className="hidden h-full lg:block">
            <Carousel slides={slides} />
          </div>
        ) : null}
      </section>

      <section className="grid gap-4 rounded-[28px] border border-white/10 bg-zinc-950/90 p-3 shadow-[0_24px_60px_rgba(0,0,0,0.24)] sm:gap-6 sm:rounded-[32px] sm:p-5 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-start lg:p-6">
        {/* Celular: una sola fila deslizable con categorías y gamas. Escritorio: columna lateral con dos grupos. */}
        <nav aria-label="Explorar el catálogo" className="min-w-0 lg:sticky lg:top-24">
          <div className="-mx-3 flex gap-2 overflow-x-auto px-3 pb-1 [scrollbar-width:none] sm:-mx-5 sm:px-5 lg:mx-0 lg:flex-col lg:gap-6 lg:overflow-visible lg:px-0 lg:pb-0">
            {categories.length > 0 ? (
              <div className="contents lg:flex lg:flex-col lg:gap-2">
                <div className={groupLabel}>Categorías</div>
                {categories.map((c) => (
                  <Link key={c.id} href={`/products?category=${c.slug}`} className={chipClass}>
                    {c.name}
                  </Link>
                ))}
              </div>
            ) : null}
            <div className="contents lg:flex lg:flex-col lg:gap-2">
              <div className={groupLabel}>Gamas de PC</div>
              {performanceTierOptions.map((option) => (
                <Link key={option.value} href={`/products?tier=${option.value}`} className={chipClass}>
                  Gama {option.label}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        <div className="flex min-w-0 flex-col gap-4">
          <div className="flex items-end justify-between gap-4 px-1">
            <div className="flex flex-col gap-1">
              <h2 className="section-heading text-xl font-semibold text-amber-300 sm:text-2xl">Productos destacados</h2>
              <p className="text-sm text-zinc-300">Una selección de componentes y equipos para arrancar.</p>
            </div>
            <Link
              href="/products"
              className="inline-flex min-h-11 shrink-0 items-center text-sm font-medium text-amber-200 hover:text-amber-300 hover:underline underline-offset-4"
            >
              Ver todos
            </Link>
          </div>
          {cards.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
              {cards.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="surface-card flex flex-col items-center gap-3 rounded-3xl px-6 py-10 text-center">
              <GeekCatSticker name="thinking" size={110} />
              <h3 className="text-lg font-semibold text-zinc-900">Estamos preparando los destacados</h3>
              <p className="muted-copy max-w-md text-sm">Mientras tanto, podés recorrer el catálogo completo.</p>
              <Link
                href="/products"
                className="mt-1 inline-flex min-h-11 items-center rounded-full border border-zinc-900 bg-zinc-900 px-5 text-sm font-semibold text-white hover:text-amber-300"
              >
                Ver productos
              </Link>
            </div>
          )}
        </div>
      </section>

      <section id="quienes-somos" className={sectionShell}>
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-10">
          <div className="flex flex-col gap-3">
            <h2 className="section-heading text-2xl font-semibold text-amber-300">Hardware primero, ayuda real siempre</h2>
            <p className="max-w-3xl text-sm leading-6 text-zinc-300 sm:text-base">
              En BatysTech vendemos componentes de PC y equipos armados pensando en lo que de verdad vas a usar:
              compatibilidad, rendimiento y un presupuesto que cierre. Si tenés dudas, te ayudamos a elegir antes de comprar.
            </p>
            <ul className="flex flex-col gap-2">
              {aboutPoints.map((point) => (
                <li key={point} className="flex items-start gap-2.5 text-sm leading-6 text-zinc-300">
                  <span aria-hidden="true" className="mt-2 h-2 w-2 shrink-0 rounded-full bg-amber-400" />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          <div
            id="como-comprar"
            className="flex scroll-mt-24 flex-col gap-4 border-t border-white/10 pt-6 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0"
          >
            <h3 className="text-lg font-semibold text-white">Cómo comprar</h3>
            <ol className="flex flex-col gap-3">
              {buySteps.map((step, index) => (
                <li key={step.title} className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-400 text-sm font-bold text-zinc-950">
                    {index + 1}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-white">{step.title}</span>
                    <span className="text-sm leading-6 text-zinc-300">{step.text}</span>
                  </div>
                </li>
              ))}
            </ol>
            {socialLinks.length > 0 ? (
              <div className="flex flex-wrap items-center gap-2 border-t border-white/10 pt-4">
                <span className="text-sm text-zinc-300">Seguinos:</span>
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center rounded-full border border-white/20 px-4 text-sm font-medium text-zinc-100 hover:border-amber-300 hover:text-amber-300"
                  >
                    {social.label}
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section id="servicios" className={sectionShell}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h2 className="section-heading text-2xl font-semibold text-amber-300">Además de la tienda</h2>
            <p className="max-w-3xl text-sm leading-6 text-zinc-300 sm:text-base">
              Si necesitás una mano extra, también te acompañamos con estos servicios.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 md:gap-10">
            {services.map((service) => {
              const external = service.href.startsWith("http");
              return (
                <article key={service.title} className="flex flex-col gap-2 border-t border-white/10 pt-5">
                  <h3 className="flex items-center gap-2.5 text-base font-semibold text-white">
                    <span className="text-amber-300">{service.icon}</span>
                    {service.title}
                  </h3>
                  <p className="text-sm leading-6 text-zinc-300">{service.description}</p>
                  <Link
                    href={service.href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    className="inline-flex min-h-11 w-fit items-center text-sm font-semibold text-amber-300 hover:text-amber-200 hover:underline underline-offset-4"
                  >
                    {service.cta}
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="contacto" className={sectionShell}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex max-w-3xl flex-col gap-2">
            <h2 className="section-heading text-2xl font-semibold text-amber-300">¿Tenés una consulta?</h2>
            <p className="text-sm leading-6 text-zinc-300 sm:text-base">
              Si querés armar una PC, mejorar tu equipo actual o consultar por un servicio, escribinos y te orientamos sin
              vueltas.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 lg:shrink-0">
            {contactHref ? (
              <a
                href={contactHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-amber-400 bg-amber-400 px-5 py-2 text-sm font-semibold leading-none whitespace-nowrap text-zinc-900 hover:bg-amber-300"
              >
                Hablar por WhatsApp
              </a>
            ) : null}
            <Link
              href="/products"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-zinc-300 bg-white px-5 py-2 text-sm font-semibold leading-none whitespace-nowrap text-zinc-900 hover:border-amber-300 hover:bg-amber-50"
            >
              Ver catálogo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
