import Image from "next/image";
import Link from "next/link";
import { socialLinks, whatsappHref } from "@/lib/site";

const linkClass = "hover:text-amber-300";
const titleClass = "text-xs font-semibold uppercase tracking-[0.18em] text-amber-300";

export function Footer() {
  const contactHref = whatsappHref("¡Hola BatysTech! Quiero hacer una consulta.");
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-amber-300 bg-zinc-950 text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 text-sm">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))]">
          <div className="col-span-2 flex flex-col gap-4 sm:col-span-3 lg:col-span-1">
            <Image src="/brand/batystech-logo.png" alt="BatysTech" width={1200} height={143} className="h-auto w-[220px]" />
            <div className="max-w-sm text-zinc-300">
              Componentes de PC y PCs armadas, con atención directa para ayudarte a elegir y cerrar tu compra.
            </div>
          </div>

          <nav aria-label="Tienda" className="flex flex-col gap-3">
            <div className={titleClass}>Tienda</div>
            <div className="flex flex-col gap-2 text-zinc-300">
              <Link href="/products" className={linkClass}>
                Productos
              </Link>
              <Link href="/cart" className={linkClass}>
                Carrito
              </Link>
              <Link href="/#como-comprar" className={linkClass}>
                Cómo comprar
              </Link>
            </div>
          </nav>

          <nav aria-label="BatysTech" className="flex flex-col gap-3">
            <div className={titleClass}>BatysTech</div>
            <div className="flex flex-col gap-2 text-zinc-300">
              <Link href="/#quienes-somos" className={linkClass}>
                Quiénes somos
              </Link>
              <Link href="/#servicios" className={linkClass}>
                Servicios
              </Link>
              <Link href="/#contacto" className={linkClass}>
                Contacto
              </Link>
            </div>
          </nav>

          <div className="flex flex-col gap-3">
            <div className={titleClass}>Contacto</div>
            <div className="flex flex-col gap-2 text-zinc-300">
              {contactHref ? (
                <a href={contactHref} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  WhatsApp
                </a>
              ) : (
                <Link href="/#contacto" className={linkClass}>
                  Escribinos
                </Link>
              )}
              {socialLinks.map((social) => (
                <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  {social.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1 border-t border-zinc-800 pt-4 text-xs text-zinc-400 sm:flex-row sm:justify-between">
          <span>© {year} BatysTech. Todos los derechos reservados.</span>
          <span>Precios en pesos argentinos.</span>
          <span>
            Sitio hecho por{" "}
            <a
              href="https://david-dev-ar.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-300 underline-offset-4 hover:text-amber-300 hover:underline"
            >
              David Saboredo
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
