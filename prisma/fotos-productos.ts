// Fotos reales (licencia libre) de los productos de ejemplo, por SKU.
// Las usan la semilla (prisma/seed.ts) y el script scripts/actualizar-fotos-demo.ts.
// Créditos y licencias de cada foto: public/productos/CREDITOS.md

export type FotoProducto = { url: string; alt: string };

export const fotosProductos: Record<string, FotoProducto> = {
  "PC-ENTRY-R5-4060": { url: "/productos/pc-gamer-entrada.webp", alt: "PC gamer armada con vidrio templado e iluminación RGB" },
  "PC-MID-R7-4070S": { url: "/productos/pc-gamer-media.webp", alt: "Interior de una PC gamer armada con iluminación violeta" },
  "PC-HIGH-R7-4080S": { url: "/productos/pc-gamer-alta.webp", alt: "Interior de una PC gamer con cooler torre y ventiladores" },
  "CPU-RYZEN5-5600": { url: "/productos/amd-ryzen-5-5600.webp", alt: "Procesador AMD Ryzen" },
  "CPU-I5-12400F": { url: "/productos/intel-core-i5-12400f.webp", alt: "Procesador Intel Core i5-12400F" },
  "GPU-RTX-4060-8G": { url: "/productos/geforce-rtx-4060.webp", alt: "Placa de video GeForce RTX" },
  "MB-B550M-PROVDH": { url: "/productos/motherboard-b550m.webp", alt: "Zócalo AM4 de una motherboard" },
  "MB-B760M-ASUS-PRIME": { url: "/productos/motherboard-b760m.webp", alt: "Zócalo de procesador y ranuras de memoria de una motherboard" },
  "RAM-KINGSTON-16G-3200": { url: "/productos/memoria-ddr4.webp", alt: "Módulo de memoria RAM" },
  "RAM-CORSAIR-32G-6000": { url: "/productos/memoria-ddr5.webp", alt: "Chips de un módulo de memoria RAM" },
  "SSD-SAMSUNG-990EVO-1T": { url: "/productos/ssd-nvme.webp", alt: "Unidad SSD NVMe M.2" },
  "PSU-CM-650W-BRONZE": { url: "/productos/fuente-650w.webp", alt: "Fuente de alimentación ATX con ventilador" },
  "CASE-MIDTOWER-TG-01": { url: "/productos/gabinete-mid-tower.webp", alt: "Gabinete mid tower con frente de vidrio templado" },
  "COOLER-TOWER-120-01": { url: "/productos/cooler-torre-120.webp", alt: "Cooler de CPU tipo torre con ventilador de 120 mm" },
};

export function fotoProducto(sku: string): FotoProducto {
  const foto = fotosProductos[sku];
  if (!foto) throw new Error(`Falta la foto del producto ${sku} en prisma/fotos-productos.ts`);
  return foto;
}
