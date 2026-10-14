// Reemplaza las ilustraciones de ejemplo (/demo/*.svg) de los productos de la semilla
// por las fotos reales de public/productos. Nunca toca fotos subidas desde el panel.
//
// Uso:
//   npm run db:fotos-demo -- --simular                 muestra los cambios sin escribir nada
//   npm run db:fotos-demo                              aplica los cambios
//   npm run db:fotos-demo -- --env .env.production.local --simular
//                                                      usa otro archivo de variables
import { config } from "dotenv";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../prisma/generated/prisma/client";
import { fotosProductos } from "../prisma/fotos-productos";

const args = process.argv.slice(2);
const simular = args.includes("--simular");
const envIndex = args.indexOf("--env");
const envPath = envIndex >= 0 ? args[envIndex + 1] : undefined;

if (envIndex >= 0 && !envPath) {
  console.error("Falta el archivo después de --env (por ejemplo: --env .env.production.local)");
  process.exit(1);
}

config(envPath ? { path: envPath, quiet: true } : { quiet: true });

const connectionString =
  process.env.POSTGRES_PRISMA_URL ||
  process.env.DATABASE_URL ||
  process.env.DATABASE_URL_UNPOOLED ||
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.POSTGRES_URL;

if (!connectionString) {
  console.error("DATABASE_URL no está configurada");
  process.exit(1);
}

// Muestra a qué base se conecta (solo servidor y nombre, nunca usuario ni contraseña).
function describirBase(url: string) {
  try {
    const u = new URL(url);
    return `${u.hostname}${u.port ? `:${u.port}` : ""}${u.pathname}`;
  } catch {
    return "(no se pudo leer la dirección)";
  }
}

const esFotoDeEjemplo = (url: string) => url.startsWith("/demo/");

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

async function main() {
  console.log(`Base: ${describirBase(connectionString!)}`);
  console.log(simular ? "Modo simular: no se escribe nada.\n" : "Modo real: se aplican los cambios.\n");

  let reemplazadas = 0;
  let borradas = 0;

  for (const [sku, foto] of Object.entries(fotosProductos)) {
    const producto = await prisma.product.findUnique({
      where: { sku },
      select: {
        id: true,
        name: true,
        images: { orderBy: { sortOrder: "asc" }, select: { id: true, url: true, sortOrder: true } },
      },
    });

    if (!producto) {
      console.log(`- ${sku}: no existe en la base, se saltea.`);
      continue;
    }

    const deEjemplo = producto.images.filter((img) => esFotoDeEjemplo(img.url));
    const propias = producto.images.length - deEjemplo.length;

    if (deEjemplo.length === 0) {
      console.log(`- ${producto.name}: sin ilustraciones de ejemplo, no se toca (${propias} foto(s) propias).`);
      continue;
    }

    const [primera, ...sobrantes] = deEjemplo;
    console.log(`* ${producto.name}: ${primera!.url} -> ${foto.url}`);
    for (const img of sobrantes) console.log(`    quita ilustración repetida ${img.url}`);
    if (propias > 0) console.log(`    conserva ${propias} foto(s) subida(s) desde el panel`);

    reemplazadas += 1;
    borradas += sobrantes.length;

    if (simular) continue;

    // Solo se modifican filas cuya url empieza con /demo/: las fotos del panel quedan intactas.
    await prisma.$transaction([
      prisma.productImage.updateMany({
        where: { id: primera!.id, url: { startsWith: "/demo/" } },
        data: { url: foto.url, alt: foto.alt },
      }),
      prisma.productImage.deleteMany({
        where: { id: { in: sobrantes.map((img) => img.id) }, url: { startsWith: "/demo/" } },
      }),
    ]);
  }

  // Aviso de productos cargados a mano que todavía usan una ilustración de ejemplo.
  const otras = await prisma.productImage.findMany({
    where: { url: { startsWith: "/demo/" }, product: { sku: { notIn: Object.keys(fotosProductos) } } },
    select: { url: true, product: { select: { name: true, sku: true } } },
  });
  for (const img of otras) {
    console.log(`! ${img.product.name} (${img.product.sku}) sigue con ${img.url}: no es de la semilla, revisalo desde el panel.`);
  }

  const verbo = simular ? "se reemplazarían" : "se reemplazaron";
  const quitadas = borradas ? ` y ${simular ? "se quitarían" : "se quitaron"} ${borradas} repetida(s)` : "";
  console.log(`\nListo: ${verbo} ${reemplazadas} ilustración(es)${quitadas}.`);
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
