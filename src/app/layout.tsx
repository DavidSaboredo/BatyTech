import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { defaultOgImage, getSiteUrl, siteDescription, siteName } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: `${siteName} · Componentes de PC y PCs armadas`,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  applicationName: siteName,
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName,
    url: "/",
    title: `${siteName} · Componentes de PC y PCs armadas`,
    description: siteDescription,
    images: [defaultOgImage],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} · Componentes de PC y PCs armadas`,
    description: siteDescription,
    images: [defaultOgImage.url],
  },
};

export const viewport: Viewport = {
  themeColor: "#09090b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col text-zinc-900">
        <CartProvider>
          <Header />
          <main className="metallic-bg w-full flex-1">
            <div className="mx-auto flex w-full max-w-6xl flex-col px-4 py-6 sm:py-8">
              {children}
            </div>
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
