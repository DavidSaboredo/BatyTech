import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BatysTech",
  description: "Tienda de componentes de PC",
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
