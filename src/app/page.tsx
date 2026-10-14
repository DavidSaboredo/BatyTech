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

function BrowserIcon() {
  return (
    <svg {...iconProps}>
      <rect x="3" y="4" width="18" height="16" rx="2.5" />
      <path d="M3 9h18M6.5 6.5h.01M9 6.5h.01M8 14l-2 1.5L8 17M16 14l2 1.5-2 1.5M13 13l-2 5" />
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

const sectionShell =
  "relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] p-4 shadow-[0_24px_60px_rgba(0,0,0,0.24)] backdrop-blur-[2px] sm:rounded-[32px] sm:p-6";
const sectionBadge =
  "inline-flex w-fit rounded-full bg-zinc-950 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-300";
const chipClass =
  "shrink-0 whitespace-nowrap rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-800 hover:border-amber-400 hover:bg-amber-50 hover:text-zinc-950 lg:rounded-2xl lg:py-2.5";

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
      title: "Creación de páginas web",
      description: "Diseñamos webs modernas para negocios y emprendimientos, como esta tienda.",
      cta: "Consultar proyecto",
      href: whatsappHref("¡Hola BatysTech! Quiero consultar por una página web.") || "/#contacto",
      icon: <BrowserIcon />,
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

      <section className={`relative grid items-stretch gap-3 overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] p-2 shadow-[0_24px_60px_rgba(0,0,0,0.28)] backdrop-blur-[2px] sm:gap-8 sm:rounded-[36px] sm:p-3 ${slides.length > 0 ? "lg:grid-cols-[1.05fr_1fr]" : ""}`}>
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.12),rgba(255,255,255,0.02)_45%,rgba(0,0,0,0)_70%)]" />
        <div className="surface-card relative z-10 flex flex-col justify-center gap-5 overflow-hidden rounded-3xl p-5 shadow-[0_18px_40px_rgba(15,23,42,0.16)] sm:gap-6 sm:p-8">
          <div className="absolute inset-y-0 left-0 w-1.5 bg-amber-400" />
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
        {slides.length > 0 ? (
          <div className="relative z-10 h-full">
            <Carousel slides={slides} />
          </div>
        ) : null}
      </section>

      <section className="metallic-bg relative grid gap-5 overflow-hidden rounded-[28px] border border-white/10 p-3 shadow-[0_30px_80px_rgba(0,0,0,0.42),inset_0_1px_0_rgba(255,255,255,0.08)] sm:gap-6 sm:rounded-[32px] sm:p-5 lg:grid-cols-[250px_minmax(0,1fr)] lg:items-start lg:p-6">
        <div className="absolute inset-x-12 top-0 h-24 bg-gradient-to-b from-white/10 to-transparent blur-2xl" />
        <div className="absolute inset-y-8 left-0 w-px bg-gradient-to-b from-transparent via-amber-300/35 to-transparent" />
        <div className="absolute inset-y-8 right-0 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />
        <aside className="surface-card relative z-10 min-w-0 self-start rounded-3xl p-4 shadow-[0_18px_40px_rgba(0,0,0,0.28)] sm:p-5 lg:sticky lg:top-24">
          <div className="flex flex-col gap-1">
            <div className={sectionBadge}>Explorar</div>
            <h2 className="section-heading text-xl font-semibold text-zinc-950 sm:text-2xl">Catálogo</h2>
            <p className="muted-copy text-sm">Accesos directos para encontrar lo que buscás más rápido.</p>
          </div>

          <div className="mt-4 flex flex-col gap-4 sm:mt-6 sm:gap-6">
            {categories.length > 0 ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500 sm:text-sm">Categorías</h3>
                  <Link href="/products" className="text-sm text-zinc-600 hover:text-amber-600 hover:underline underline-offset-4">
                    Ver todo
                  </Link>
                </div>
                <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:-mx-5 sm:px-5 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0">
                  {categories.map((c) => (
                    <Link key={c.id} href={`/products?category=${c.slug}`} className={chipClass}>
                      {c.name}
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="flex flex-col gap-3 border-t border-zinc-200 pt-4 sm:pt-5">
              <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500 sm:text-sm">Gamas de PC</h3>
              <div className="flex flex-wrap gap-2 lg:flex-col">
                {performanceTierOptions.map((option) => (
                  <Link key={option.value} href={`/products?tier=${option.value}`} className={chipClass}>
                    Gama {option.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <div className="relative z-10 flex min-w-0 flex-col gap-4">
          <div className="flex items-end justify-between gap-4 px-1">
            <div className="flex flex-col gap-1">
              <h2 className="section-heading text-xl font-semibold text-white sm:text-2xl">Productos destacados</h2>
              <p className="text-sm text-zinc-300">Una selección de componentes y equipos para arrancar.</p>
            </div>
            <Link
              href="/products"
              className="shrink-0 text-sm font-medium text-amber-200 hover:text-amber-300 hover:underline underline-offset-4"
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

      <section id="quienes-somos" className={`${sectionShell} scroll-mt-24`}>
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,205,84,0.1),rgba(255,255,255,0.03)_38%,rgba(0,0,0,0)_72%)]" />
        <div className="relative z-10 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="flex flex-col gap-3">
            <div className={sectionBadge}>Quiénes somos</div>
            <h2 className="section-heading text-2xl font-semibold text-amber-300">Hardware primero, ayuda real siempre</h2>
            <p className="max-w-3xl text-sm leading-6 text-amber-100/85 sm:text-base">
              En BatysTech vendemos componentes de PC y equipos armados pensando en lo que de verdad vas a usar:
              compatibilidad, rendimiento y un presupuesto que cierre. Si tenés dudas, te ayudamos a elegir antes de comprar.
            </p>
            <div className="grid gap-2">
              {aboutPoints.map((point) => (
                <div key={point} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm leading-6 text-amber-50/90">
                  {point}
                </div>
              ))}
            </div>
          </div>

          <div id="como-comprar" className="surface-card flex scroll-mt-24 flex-col gap-4 rounded-3xl p-5 shadow-[0_16px_36px_rgba(15,23,42,0.14)]">
            <div className={sectionBadge}>Cómo comprar</div>
            <ol className="flex flex-col gap-3">
              {buySteps.map((step, index) => (
                <li key={step.title} className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-400 text-sm font-bold text-zinc-950">
                    {index + 1}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-zinc-900">{step.title}</span>
                    <span className="text-sm leading-6 text-zinc-600">{step.text}</span>
                  </div>
                </li>
              ))}
            </ol>
            {socialLinks.length > 0 ? (
              <div className="flex flex-wrap items-center gap-2 border-t border-zinc-200 pt-4">
                <span className="text-sm text-zinc-600">Seguinos:</span>
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-800 hover:border-amber-300 hover:bg-amber-50"
                  >
                    {social.label}
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section id="servicios" className={`${sectionShell} scroll-mt-24`}>
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,209,102,0.08),rgba(255,255,255,0.03)_40%,rgba(0,0,0,0)_75%)]" />
        <div className="relative z-10 flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <div className={sectionBadge}>Servicios</div>
            <h2 className="section-heading text-2xl font-semibold text-amber-300">Además de la tienda</h2>
            <p className="max-w-3xl text-sm leading-6 text-amber-100/85 sm:text-base">
              Si necesitás una mano extra, también te acompañamos con estos servicios.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {services.map((service) => {
              const external = service.href.startsWith("http");
              return (
                <article
                  key={service.title}
                  className="surface-card flex h-full flex-col gap-3 rounded-3xl p-5 shadow-[0_16px_36px_rgba(15,23,42,0.14)]"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-zinc-950 text-amber-300 shadow-sm">
                    {service.icon}
                  </div>
                  <div className="flex flex-1 flex-col gap-2">
                    <h3 className="text-base font-semibold text-zinc-950">{service.title}</h3>
                    <p className="text-sm leading-6 text-zinc-600">{service.description}</p>
                  </div>
                  <Link
                    href={service.href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    className="inline-flex min-h-10 w-fit items-center rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 hover:border-zinc-900 hover:bg-zinc-900 hover:text-white"
                  >
                    {service.cta}
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="contacto" className={`${sectionShell} scroll-mt-24`}>
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,205,84,0.1),rgba(255,255,255,0.03)_40%,rgba(0,0,0,0)_75%)]" />
        <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex max-w-3xl flex-col gap-2">
            <div className={sectionBadge}>Contacto</div>
            <h2 className="section-heading text-2xl font-semibold text-amber-300">¿Tenés una consulta?</h2>
            <p className="text-sm leading-6 text-amber-100/85 sm:text-base">
              Si querés armar una PC, mejorar tu equipo actual o consultar por un servicio, escribinos y te orientamos sin
              vueltas.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
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
