# BatyTech

Tienda online de componentes de PC con:

- catalogo publico
- carrito y checkout por WhatsApp
- panel privado de administracion
- carga de imagenes via Cloudinary
- base de datos con Prisma + PostgreSQL

## Stack

- Next.js 16
- React 19
- Tailwind CSS 4
- Prisma 7
- PostgreSQL

## Desarrollo local

1. Copia `.env.example` a `.env`
2. Configura una base PostgreSQL
3. Instala dependencias
4. Aplica migraciones
5. Ejecuta seed
6. Levanta el proyecto

```bash
npm install
npm run db:deploy
npm run db:seed
npm run dev
```

## Variables de entorno

Estas variables son necesarias:

```env
DATABASE_URL=
AUTH_SECRET=
NEXT_PUBLIC_WHATSAPP_NUMBER=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=
NEXT_PUBLIC_CLOUDINARY_FOLDER=
ADMIN_EMAIL=
ADMIN_PASSWORD=
```

## Deploy en Vercel

En la pantalla de importacion del proyecto:

- `Framework Preset`: `Next.js`
- `Root Directory`: `batytech`
- `Build Command`: dejar por defecto
- `Install Command`: dejar por defecto

Antes de hacer el primer deploy:

1. Crea una base PostgreSQL
2. Carga `DATABASE_URL` en Vercel
3. Carga `AUTH_SECRET`
4. Carga variables de Cloudinary
5. Carga `ADMIN_EMAIL` y `ADMIN_PASSWORD`

Luego del primer deploy, corre:

```bash
npm run db:deploy
npm run db:seed
```

Si usas Vercel + Neon:

- usa la URL de PostgreSQL en `DATABASE_URL`
- para este proyecto no hace falta una infra grande
- con trafico bajo o moderado funciona bien

## Acceso admin

- Login privado: `/ingreso-batytech`
- Panel admin: `/gestion-batytech`

## Comandos utiles

```bash
npm run dev
npm run lint
npm run build
npm run db:generate
npm run db:deploy
npm run db:migrate
npm run db:seed
npm run db:studio
```
