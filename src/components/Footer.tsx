import Image from "next/image";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-amber-200 bg-white/90 backdrop-blur">
      <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-8 text-sm text-zinc-600 md:grid-cols-[auto_1fr_auto] md:items-center">
        <Image
          src="/brand/logo.jpeg"
          alt="Logo BatyTech"
          width={220}
          height={48}
          className="h-10 w-auto object-contain"
        />
        <div className="flex flex-col gap-1 text-center md:text-left">
          <div className="font-medium text-zinc-900">BatyTech · Componentes de PC</div>
          <div className="muted-copy">Precios actualizados, stock real y atencion directa para cerrar la compra.</div>
        </div>
        <div className="text-center text-xs md:text-right">Acceso privado del dueño por `/ingreso-batytech`</div>
      </div>
    </footer>
  );
}
