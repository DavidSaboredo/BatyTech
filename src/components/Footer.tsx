import Image from "next/image";
import Link from "next/link";

export function Footer() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "");
  const contactHref = whatsappNumber ? `https://wa.me/${whatsappNumber}` : "/#contacto";

  return (
    <footer className="mt-auto border-t border-amber-300 bg-zinc-950 text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 text-sm">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_repeat(4,minmax(0,1fr))]">
          <div className="flex flex-col gap-4">
            <Image
              src="/brand/logo.jpeg"
              alt="Logo BatysTech"
              width={220}
              height={48}
              className="h-10 w-auto object-contain"
            />
            <div className="flex flex-col gap-1">
              <div className="font-medium text-white">BatysTech · Componentes de PC</div>
              <div className="max-w-sm text-zinc-300">
                Precios actualizados, stock real y atencion directa para cerrar la compra o ayudarte con tu proyecto.
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">Marca</div>
            <div className="flex flex-col gap-2 text-zinc-300">
              <Link href="/#quienes-somos" className="hover:text-amber-300">
                Quienes somos
              </Link>
              <Link href="/#servicios" className="hover:text-amber-300">
                Servicios
              </Link>
              <Link href="/#contacto" className="hover:text-amber-300">
                Contactanos
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">Servicios</div>
            <div className="flex flex-col gap-2 text-zinc-300">
              <Link href="/#servicios" className="hover:text-amber-300">
                Asesoramiento en componentes
              </Link>
              <Link href="/#servicios" className="hover:text-amber-300">
                Creacion de paginas web
              </Link>
              <Link href="/#servicios" className="hover:text-amber-300">
                Soporte y mantenimiento
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">Comunidad</div>
            <div className="flex flex-col gap-2 text-zinc-300">
              <Link href="/#comunidad" className="hover:text-amber-300">
                Instagram · Proximamente
              </Link>
              <Link href="/#comunidad" className="hover:text-amber-300">
                TikTok · Proximamente
              </Link>
              <Link href="/products" className="hover:text-amber-300">
                Catalogo online
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">Contactanos</div>
            <div className="flex flex-col gap-2 text-zinc-300">
              <Link href="/#contacto" className="hover:text-amber-300">
                Consulta general
              </Link>
              <Link href={contactHref} className="hover:text-amber-300">
                WhatsApp
              </Link>
              <Link href="/checkout" className="hover:text-amber-300">
                Iniciar pedido
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-zinc-800 pt-4 text-xs text-zinc-400">
          BatysTech combina tienda, asesoramiento y soporte para ayudarte a elegir mejor y avanzar mas rapido.
        </div>
      </div>
    </footer>
  );
}
