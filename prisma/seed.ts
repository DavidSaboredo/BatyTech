import crypto from "node:crypto";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client";

function encodeBase64Url(buf: Buffer) {
  return buf
    .toString("base64")
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

function hashPassword(password: string) {
  const salt = crypto.randomBytes(16);
  const N = 16384;
  const r = 8;
  const p = 1;
  const hash = crypto.scryptSync(password, salt, 32, { N, r, p });
  return `scrypt$${N}$${r}$${p}$${encodeBase64Url(salt)}$${encodeBase64Url(hash)}`;
}

function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const connectionString =
  process.env.POSTGRES_PRISMA_URL ||
  process.env.DATABASE_URL ||
  process.env.DATABASE_URL_UNPOOLED ||
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.POSTGRES_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL no esta configurada");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@batytech.local";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin1234";

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: "ADMIN" },
    create: {
      email: adminEmail,
      passwordHash: hashPassword(adminPassword),
      role: "ADMIN",
    },
  });

  const categoryNames = [
    "Procesadores",
    "Placas de video",
    "Motherboards",
    "Memorias RAM",
    "Almacenamiento",
    "Fuentes",
    "Gabinetes",
    "Refrigeración",
  ];

  const brandNames = [
    "AMD",
    "Intel",
    "NVIDIA",
    "ASUS",
    "MSI",
    "Gigabyte",
    "Corsair",
    "Kingston",
    "Samsung",
    "Cooler Master",
  ];

  const categories: Record<string, { id: string }> = {};
  for (const name of categoryNames) {
    const slug = slugify(name);
    categories[slug] = await prisma.category.upsert({
      where: { slug },
      update: { name },
      create: { name, slug },
      select: { id: true },
    });
  }

  const brands: Record<string, { id: string }> = {};
  for (const name of brandNames) {
    const slug = slugify(name);
    brands[slug] = await prisma.brand.upsert({
      where: { slug },
      update: { name },
      create: { name, slug },
      select: { id: true },
    });
  }

  const products = [
    {
      name: "AMD Ryzen 5 5600",
      sku: "CPU-RYZEN5-5600",
      priceCents: 189999,
      stock: 20,
      category: "procesadores",
      brand: "amd",
      featured: true,
      description:
        "Procesador 6 núcleos / 12 hilos ideal para gaming y productividad. Excelente relación precio/rendimiento.",
      images: [{ url: "/window.svg", alt: "AMD Ryzen 5 5600" }],
    },
    {
      name: "Intel Core i5 12400F",
      sku: "CPU-I5-12400F",
      priceCents: 209999,
      stock: 15,
      category: "procesadores",
      brand: "intel",
      featured: true,
      description:
        "6 núcleos / 12 hilos con gran desempeño en juegos. Requiere GPU dedicada.",
      images: [{ url: "/window.svg", alt: "Intel Core i5 12400F" }],
    },
    {
      name: "NVIDIA GeForce RTX 4060 8GB",
      sku: "GPU-RTX-4060-8G",
      priceCents: 479999,
      stock: 10,
      category: "placas-de-video",
      brand: "nvidia",
      featured: true,
      description:
        "GPU eficiente para 1080p/1440p, con soporte para tecnologías modernas de renderizado.",
      images: [{ url: "/globe.svg", alt: "RTX 4060" }],
    },
    {
      name: "MSI B550M PRO-VDH WiFi",
      sku: "MB-B550M-PROVDH",
      priceCents: 159999,
      stock: 12,
      category: "motherboards",
      brand: "msi",
      featured: false,
      description:
        "Motherboard AM4 con buen VRM, conectividad WiFi y compatibilidad con Ryzen 3000/5000.",
      images: [{ url: "/file.svg", alt: "MSI B550M" }],
    },
    {
      name: "ASUS PRIME B760M-A",
      sku: "MB-B760M-ASUS-PRIME",
      priceCents: 189999,
      stock: 9,
      category: "motherboards",
      brand: "asus",
      featured: false,
      description:
        "Motherboard LGA1700 para Intel 12/13/14th gen, ideal para armado equilibrado.",
      images: [{ url: "/file.svg", alt: "ASUS PRIME B760M-A" }],
    },
    {
      name: "Kingston Fury 16GB (2x8) DDR4 3200",
      sku: "RAM-KINGSTON-16G-3200",
      priceCents: 69999,
      stock: 40,
      category: "memorias-ram",
      brand: "kingston",
      featured: true,
      description: "Kit dual channel DDR4 3200MHz para gaming y multitarea.",
      images: [{ url: "/next.svg", alt: "Kingston Fury DDR4" }],
    },
    {
      name: "Corsair Vengeance 32GB (2x16) DDR5 6000",
      sku: "RAM-CORSAIR-32G-6000",
      priceCents: 189999,
      stock: 18,
      category: "memorias-ram",
      brand: "corsair",
      featured: false,
      description:
        "DDR5 de alto rendimiento para plataformas modernas. Excelente para productividad y juegos.",
      images: [{ url: "/next.svg", alt: "Corsair Vengeance DDR5" }],
    },
    {
      name: "Samsung 990 EVO 1TB NVMe",
      sku: "SSD-SAMSUNG-990EVO-1T",
      priceCents: 149999,
      stock: 22,
      category: "almacenamiento",
      brand: "samsung",
      featured: true,
      description:
        "SSD NVMe 1TB rápido para sistema y juegos. Mejora los tiempos de carga.",
      images: [{ url: "/vercel.svg", alt: "Samsung 990 EVO" }],
    },
    {
      name: "Cooler Master MWE 650W 80+ Bronze",
      sku: "PSU-CM-650W-BRONZE",
      priceCents: 99999,
      stock: 25,
      category: "fuentes",
      brand: "cooler-master",
      featured: false,
      description:
        "Fuente 650W 80+ Bronze para builds de gama media, con buena eficiencia.",
      images: [{ url: "/vercel.svg", alt: "Cooler Master 650W" }],
    },
    {
      name: "Gabinete Mid Tower con vidrio templado",
      sku: "CASE-MIDTOWER-TG-01",
      priceCents: 79999,
      stock: 14,
      category: "gabinetes",
      brand: "cooler-master",
      featured: false,
      description:
        "Gabinete con buen airflow y panel lateral de vidrio templado para tu setup.",
      images: [{ url: "/window.svg", alt: "Gabinete Mid Tower" }],
    },
    {
      name: "Cooler CPU Torre 120mm",
      sku: "COOLER-TOWER-120-01",
      priceCents: 39999,
      stock: 30,
      category: "refrigeracion",
      brand: "cooler-master",
      featured: false,
      description:
        "Disipador tipo torre 120mm para mantener bajas temperaturas en CPUs populares.",
      images: [{ url: "/globe.svg", alt: "Cooler CPU Torre" }],
    },
  ];

  for (const p of products) {
    const slug = slugify(p.name);
    const category = categories[p.category]!;
    const brand = brands[p.brand]!;

    const product = await prisma.product.upsert({
      where: { sku: p.sku },
      update: {
        name: p.name,
        slug,
        description: p.description,
        priceCents: p.priceCents,
        stock: p.stock,
        categoryId: category.id,
        brandId: brand.id,
        featured: p.featured,
        isActive: true,
      },
      create: {
        name: p.name,
        slug,
        description: p.description,
        sku: p.sku,
        priceCents: p.priceCents,
        stock: p.stock,
        categoryId: category.id,
        brandId: brand.id,
        featured: p.featured,
        isActive: true,
      },
      select: { id: true },
    });

    await prisma.productImage.deleteMany({ where: { productId: product.id } });
    await prisma.productImage.createMany({
      data: p.images.map((img, idx) => ({
        productId: product.id,
        url: img.url,
        alt: img.alt,
        sortOrder: idx,
      })),
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
