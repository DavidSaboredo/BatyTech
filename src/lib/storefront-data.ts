import { prisma } from "@/lib/db";
import { isDatabaseUnavailableError } from "@/lib/database-errors";

export type StoreCategory = {
  id: string;
  name: string;
  slug: string;
};

export type StoreBrand = {
  id: string;
  name: string;
  slug: string;
};

export type StoreImage = {
  id: string;
  url: string;
  alt: string;
  sortOrder: number;
};

export type StoreProduct = {
  id: string;
  name: string;
  slug: string;
  description: string;
  specs: string | null;
  fpsGames: string | null;
  sku: string;
  priceCents: number;
  stock: number;
  performanceTier: "ENTRY" | "MID" | "HIGH" | null;
  featured: boolean;
  isActive: boolean;
  category: StoreCategory;
  brand: StoreBrand;
  images: StoreImage[];
};

const demoCategories: StoreCategory[] = [
  { id: "pc-armadas", name: "PC Armadas", slug: "pc-armadas" },
  { id: "procesadores", name: "Procesadores", slug: "procesadores" },
  { id: "placas-de-video", name: "Placas de video", slug: "placas-de-video" },
  { id: "motherboards", name: "Motherboards", slug: "motherboards" },
  { id: "memorias-ram", name: "Memorias RAM", slug: "memorias-ram" },
  { id: "almacenamiento", name: "Almacenamiento", slug: "almacenamiento" },
  { id: "fuentes", name: "Fuentes", slug: "fuentes" },
  { id: "gabinetes", name: "Gabinetes", slug: "gabinetes" },
  { id: "refrigeracion", name: "Refrigeracion", slug: "refrigeracion" },
];

const demoBrands: StoreBrand[] = [
  { id: "batytech", name: "BatysTech", slug: "batytech" },
  { id: "amd", name: "AMD", slug: "amd" },
  { id: "intel", name: "Intel", slug: "intel" },
  { id: "nvidia", name: "NVIDIA", slug: "nvidia" },
  { id: "asus", name: "ASUS", slug: "asus" },
  { id: "msi", name: "MSI", slug: "msi" },
  { id: "corsair", name: "Corsair", slug: "corsair" },
  { id: "kingston", name: "Kingston", slug: "kingston" },
  { id: "samsung", name: "Samsung", slug: "samsung" },
  { id: "cooler-master", name: "Cooler Master", slug: "cooler-master" },
];

const categoryBySlug = new Map(demoCategories.map((category) => [category.slug, category]));
const brandBySlug = new Map(demoBrands.map((brand) => [brand.slug, brand]));

function image(id: string, url: string, alt: string, sortOrder = 0): StoreImage {
  return { id, url, alt, sortOrder };
}

function product(input: Omit<StoreProduct, "category" | "brand"> & { categorySlug: string; brandSlug: string }): StoreProduct {
  return {
    ...input,
    category: categoryBySlug.get(input.categorySlug)!,
    brand: brandBySlug.get(input.brandSlug)!,
  };
}

const demoProducts: StoreProduct[] = [
  product({
    id: "pc-entry-r5-4060",
    slug: "pc-gamer-entrada-ryzen-5-rtx-4060",
    name: "PC Gamer Entrada Ryzen 5 + RTX 4060",
    sku: "PC-ENTRY-R5-4060",
    priceCents: 1499999,
    stock: 6,
    categorySlug: "pc-armadas",
    brandSlug: "batytech",
    featured: true,
    performanceTier: "ENTRY",
    description: "PC gamer equilibrada para jugar en 1080p con buen rendimiento en esports y AAA actuales.",
    specs: "AMD Ryzen 5 5600\nNVIDIA GeForce RTX 4060 8GB\n16GB DDR4 3200\nSSD NVMe 1TB\nFuente 650W 80+ Bronze",
    fpsGames:
      "Counter-Strike 2: 220+ FPS en 1080p competitivo\nFortnite: 140 FPS en 1080p alto\nWarzone: 95 FPS en 1080p balanceado\nGTA V Enhanced: 120 FPS en 1080p muy alto",
    images: [image("img-pc-entry", "/demo/pc-build.svg", "PC Gamer Entrada")],
    isActive: true,
  }),
  product({
    id: "pc-mid-r7-4070s",
    slug: "pc-gamer-media-ryzen-7-rtx-4070-super",
    name: "PC Gamer Media Ryzen 7 + RTX 4070 Super",
    sku: "PC-MID-R7-4070S",
    priceCents: 2399999,
    stock: 4,
    categorySlug: "pc-armadas",
    brandSlug: "batytech",
    featured: true,
    performanceTier: "MID",
    description: "PC orientada a 1440p de alta calidad para gaming competitivo y titulos AAA con excelente fluidez.",
    specs: "AMD Ryzen 7 7700\nNVIDIA GeForce RTX 4070 Super 12GB\n32GB DDR5 6000\nSSD NVMe 1TB\nRefrigeracion por aire premium",
    fpsGames:
      "Counter-Strike 2: 300+ FPS en 1080p competitivo\nFortnite: 200 FPS en 1440p alto\nWarzone: 140 FPS en 1440p balanceado\nCyberpunk 2077: 95 FPS en 1440p alto con DLSS",
    images: [image("img-pc-mid", "/demo/pc-build.svg", "PC Gamer Media")],
    isActive: true,
  }),
  product({
    id: "pc-high-r7-4080s",
    slug: "pc-gamer-alta-ryzen-7-rtx-4080-super",
    name: "PC Gamer Alta Ryzen 7 + RTX 4080 Super",
    sku: "PC-HIGH-R7-4080S",
    priceCents: 3699999,
    stock: 2,
    categorySlug: "pc-armadas",
    brandSlug: "batytech",
    featured: true,
    performanceTier: "HIGH",
    description: "Equipo de alta gama para 1440p ultra y 4K, pensado para jugar lo mas pesado con margen de sobra.",
    specs: "AMD Ryzen 7 7800X3D\nNVIDIA GeForce RTX 4080 Super 16GB\n32GB DDR5 6000\nSSD NVMe 2TB\nFuente 850W Gold",
    fpsGames:
      "Counter-Strike 2: 400+ FPS en 1080p competitivo\nFortnite: 240 FPS en 1440p epico\nWarzone: 190 FPS en 1440p competitivo\nBlack Myth Wukong: 90 FPS en 4K alto con DLSS",
    images: [image("img-pc-high", "/demo/pc-build.svg", "PC Gamer Alta")],
    isActive: true,
  }),
  product({
    id: "cpu-ryzen5-5600",
    slug: "amd-ryzen-5-5600",
    name: "AMD Ryzen 5 5600",
    sku: "CPU-RYZEN5-5600",
    priceCents: 189999,
    stock: 20,
    categorySlug: "procesadores",
    brandSlug: "amd",
    featured: true,
    performanceTier: null,
    description: "Procesador 6 nucleos / 12 hilos ideal para gaming y productividad. Excelente relacion precio/rendimiento.",
    specs: null,
    fpsGames: null,
    images: [image("img-cpu-5600", "/demo/cpu.svg", "AMD Ryzen 5 5600")],
    isActive: true,
  }),
  product({
    id: "cpu-i5-12400f",
    slug: "intel-core-i5-12400f",
    name: "Intel Core i5 12400F",
    sku: "CPU-I5-12400F",
    priceCents: 209999,
    stock: 15,
    categorySlug: "procesadores",
    brandSlug: "intel",
    featured: true,
    performanceTier: null,
    description: "6 nucleos / 12 hilos con gran desempeno en juegos. Requiere GPU dedicada.",
    specs: null,
    fpsGames: null,
    images: [image("img-cpu-12400f", "/demo/cpu.svg", "Intel Core i5 12400F")],
    isActive: true,
  }),
  product({
    id: "gpu-rtx-4060",
    slug: "nvidia-geforce-rtx-4060-8gb",
    name: "NVIDIA GeForce RTX 4060 8GB",
    sku: "GPU-RTX-4060-8G",
    priceCents: 479999,
    stock: 10,
    categorySlug: "placas-de-video",
    brandSlug: "nvidia",
    featured: true,
    performanceTier: null,
    description: "GPU eficiente para 1080p/1440p, con soporte para tecnologias modernas de renderizado.",
    specs: null,
    fpsGames: null,
    images: [image("img-gpu-4060", "/demo/gpu.svg", "RTX 4060")],
    isActive: true,
  }),
  product({
    id: "mb-b550m-provdh",
    slug: "msi-b550m-pro-vdh-wifi",
    name: "MSI B550M PRO-VDH WiFi",
    sku: "MB-B550M-PROVDH",
    priceCents: 159999,
    stock: 12,
    categorySlug: "motherboards",
    brandSlug: "msi",
    featured: false,
    performanceTier: null,
    description: "Motherboard AM4 con buen VRM, conectividad WiFi y compatibilidad con Ryzen 3000/5000.",
    specs: null,
    fpsGames: null,
    images: [image("img-mb-b550", "/demo/motherboard.svg", "MSI B550M")],
    isActive: true,
  }),
  product({
    id: "mb-b760m-asus-prime",
    slug: "asus-prime-b760m-a",
    name: "ASUS PRIME B760M-A",
    sku: "MB-B760M-ASUS-PRIME",
    priceCents: 189999,
    stock: 9,
    categorySlug: "motherboards",
    brandSlug: "asus",
    featured: false,
    performanceTier: null,
    description: "Motherboard LGA1700 para Intel 12/13/14th gen, ideal para armado equilibrado.",
    specs: null,
    fpsGames: null,
    images: [image("img-mb-b760", "/demo/motherboard.svg", "ASUS PRIME B760M-A")],
    isActive: true,
  }),
  product({
    id: "ram-kingston-16g-3200",
    slug: "kingston-fury-16gb-2x8-ddr4-3200",
    name: "Kingston Fury 16GB (2x8) DDR4 3200",
    sku: "RAM-KINGSTON-16G-3200",
    priceCents: 69999,
    stock: 40,
    categorySlug: "memorias-ram",
    brandSlug: "kingston",
    featured: true,
    performanceTier: null,
    description: "Kit dual channel DDR4 3200MHz para gaming y multitarea.",
    specs: null,
    fpsGames: null,
    images: [image("img-ram-kingston", "/demo/ram.svg", "Kingston Fury DDR4")],
    isActive: true,
  }),
  product({
    id: "ram-corsair-32g-6000",
    slug: "corsair-vengeance-32gb-2x16-ddr5-6000",
    name: "Corsair Vengeance 32GB (2x16) DDR5 6000",
    sku: "RAM-CORSAIR-32G-6000",
    priceCents: 189999,
    stock: 18,
    categorySlug: "memorias-ram",
    brandSlug: "corsair",
    featured: false,
    performanceTier: null,
    description: "DDR5 de alto rendimiento para plataformas modernas. Excelente para productividad y juegos.",
    specs: null,
    fpsGames: null,
    images: [image("img-ram-corsair", "/demo/ram.svg", "Corsair Vengeance DDR5")],
    isActive: true,
  }),
  product({
    id: "ssd-samsung-990evo-1t",
    slug: "samsung-990-evo-1tb-nvme",
    name: "Samsung 990 EVO 1TB NVMe",
    sku: "SSD-SAMSUNG-990EVO-1T",
    priceCents: 149999,
    stock: 22,
    categorySlug: "almacenamiento",
    brandSlug: "samsung",
    featured: true,
    performanceTier: null,
    description: "SSD NVMe 1TB rapido para sistema y juegos. Mejora los tiempos de carga.",
    specs: null,
    fpsGames: null,
    images: [image("img-storage-990evo", "/demo/storage.svg", "Samsung 990 EVO")],
    isActive: true,
  }),
  product({
    id: "psu-cm-650w-bronze",
    slug: "cooler-master-mwe-650w-80-bronze",
    name: "Cooler Master MWE 650W 80+ Bronze",
    sku: "PSU-CM-650W-BRONZE",
    priceCents: 99999,
    stock: 25,
    categorySlug: "fuentes",
    brandSlug: "cooler-master",
    featured: false,
    performanceTier: null,
    description: "Fuente 650W 80+ Bronze para builds de gama media, con buena eficiencia.",
    specs: null,
    fpsGames: null,
    images: [image("img-psu-650", "/demo/psu.svg", "Cooler Master 650W")],
    isActive: true,
  }),
  product({
    id: "case-midtower-tg-01",
    slug: "gabinete-mid-tower-con-vidrio-templado",
    name: "Gabinete Mid Tower con vidrio templado",
    sku: "CASE-MIDTOWER-TG-01",
    priceCents: 79999,
    stock: 14,
    categorySlug: "gabinetes",
    brandSlug: "cooler-master",
    featured: false,
    performanceTier: null,
    description: "Gabinete con buen airflow y panel lateral de vidrio templado para tu setup.",
    specs: null,
    fpsGames: null,
    images: [image("img-case-mid", "/demo/case.svg", "Gabinete Mid Tower")],
    isActive: true,
  }),
  product({
    id: "cooler-tower-120-01",
    slug: "cooler-cpu-torre-120mm",
    name: "Cooler CPU Torre 120mm",
    sku: "COOLER-TOWER-120-01",
    priceCents: 39999,
    stock: 30,
    categorySlug: "refrigeracion",
    brandSlug: "cooler-master",
    featured: false,
    performanceTier: null,
    description: "Disipador tipo torre 120mm para mantener bajas temperaturas en CPUs populares.",
    specs: null,
    fpsGames: null,
    images: [image("img-cooler-tower", "/demo/cooling.svg", "Cooler CPU Torre")],
    isActive: true,
  }),
];

type CatalogFilters = {
  category?: string;
  brand?: string;
  tier?: string;
  q?: string;
};

export async function getHomeStorefrontData() {
  try {
    const [categories, featured] = await Promise.all([
      prisma.category.findMany({ orderBy: { name: "asc" } }),
      prisma.product.findMany({
        where: { featured: true, isActive: true },
        include: {
          images: { orderBy: { sortOrder: "asc" }, take: 1 },
          category: true,
          brand: true,
        },
        orderBy: { updatedAt: "desc" },
        take: 8,
      }),
    ]);

    return { categories, featured, usingFallback: false };
  } catch (error) {
    if (!isDatabaseUnavailableError(error)) throw error;
    return {
      categories: demoCategories,
      featured: demoProducts.filter((item) => item.featured && item.isActive).slice(0, 8),
      usingFallback: true,
    };
  }
}

export async function getCatalogStorefrontData(filters: CatalogFilters) {
  try {
    const [categories, brands, products] = await Promise.all([
      prisma.category.findMany({ orderBy: { name: "asc" } }),
      prisma.brand.findMany({ orderBy: { name: "asc" } }),
      prisma.product.findMany({
        where: {
          isActive: true,
          ...(filters.category ? { category: { slug: filters.category } } : {}),
          ...(filters.brand ? { brand: { slug: filters.brand } } : {}),
          ...(filters.tier ? { performanceTier: filters.tier as "ENTRY" | "MID" | "HIGH" } : {}),
          ...(filters.q
            ? {
                OR: [
                  { name: { contains: filters.q } },
                  { description: { contains: filters.q } },
                  { sku: { contains: filters.q } },
                ],
              }
            : {}),
        },
        include: {
          images: { orderBy: { sortOrder: "asc" }, take: 1 },
          category: true,
          brand: true,
        },
        orderBy: { updatedAt: "desc" },
        take: 60,
      }),
    ]);

    return { categories, brands, products, usingFallback: false };
  } catch (error) {
    if (!isDatabaseUnavailableError(error)) throw error;

    const needle = filters.q?.trim().toLowerCase();
    const products = demoProducts.filter((item) => {
      if (!item.isActive) return false;
      if (filters.category && item.category.slug !== filters.category) return false;
      if (filters.brand && item.brand.slug !== filters.brand) return false;
      if (filters.tier && item.performanceTier !== filters.tier) return false;
      if (needle) {
        const haystack = `${item.name} ${item.description} ${item.sku}`.toLowerCase();
        if (!haystack.includes(needle)) return false;
      }
      return true;
    });

    return {
      categories: demoCategories,
      brands: demoBrands,
      products,
      usingFallback: true,
    };
  }
}

export async function getStorefrontProductBySlug(slug: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        category: true,
        brand: true,
      },
    });

    return { product, usingFallback: false };
  } catch (error) {
    if (!isDatabaseUnavailableError(error)) throw error;
    return {
      product: demoProducts.find((item) => item.slug === slug) ?? null,
      usingFallback: true,
    };
  }
}
