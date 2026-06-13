import Image from "next/image";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-amber-300 bg-zinc-950 text-white">
      <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-8 text-sm md:grid-cols-[auto_1fr] md:items-center">
        <Image
          src="/brand/logo.jpeg"
          alt="Logo BatyTech"
          width={220}
          height={48}
          className="h-10 w-auto object-contain"
        />
        <div className="flex flex-col gap-1 text-center md:text-left">
          <div className="font-medium text-white">BatyTech · Componentes de PC</div>
          <div className="text-zinc-300">Precios actualizados, stock real y atencion directa para cerrar la compra.</div>
        </div>
      </div>
    </footer>
  );
}
