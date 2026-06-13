import Image from "next/image";

export type GeekCatStickerName =
  | "thinking"
  | "hacking"
  | "gamerRage"
  | "victoryDance"
  | "pixelatedWave"
  | "workingHard"
  | "vrExplorer";

const stickerSrc: Record<GeekCatStickerName, string> = {
  thinking: "/brand/geekcat/thinking-cat.png",
  hacking: "/brand/geekcat/hacking-cat.png",
  gamerRage: "/brand/geekcat/gamer-rage.png",
  victoryDance: "/brand/geekcat/victory-dance.png",
  pixelatedWave: "/brand/geekcat/pixelated-wave.png",
  workingHard: "/brand/geekcat/working-hard.png",
  vrExplorer: "/brand/geekcat/vr-explorer.png",
};

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
  return (
    <Image
      src={stickerSrc[name]}
      alt=""
      width={size}
      height={size}
      className={className}
      priority={priority}
    />
  );
}
