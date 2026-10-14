import Image from "next/image";

// Solo los stickers de la mascota que no traen texto en inglés ni recortes de otros stickers.
const stickers = {
  thinking: { src: "/brand/geekcat/thinking-cat.png", width: 177, height: 184 },
  error404: { src: "/brand/geekcat/error-404.png", width: 152, height: 163 },
  coffee: { src: "/brand/geekcat/geek-coffee.png", width: 167, height: 169 },
} as const;

export type GeekCatStickerName = keyof typeof stickers;

export function GeekCatSticker({
  name,
  size = 120,
  className,
  priority,
}: {
  name: GeekCatStickerName;
  size?: number;
  className?: string;
  priority?: boolean;
}) {
  const sticker = stickers[name];
  return (
    <Image
      src={sticker.src}
      alt=""
      width={size}
      height={Math.round((size * sticker.height) / sticker.width)}
      className={className}
      priority={priority}
    />
  );
}
