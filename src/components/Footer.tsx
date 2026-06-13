import Image from "next/image";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-amber-200 bg-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-3 px-4 py-6 text-center text-sm text-zinc-600">
        <Image
          src="/brand/logo.jpeg"
          alt="Logo BatyTech"
          width={220}
          height={48}
          className="h-10 w-auto object-contain"
        />
        <div>BatyTech · Componentes de PC</div>
      </div>
    </footer>
  );
}
