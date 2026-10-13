import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Carrito",
  description: "Revisá los productos que elegiste en BatysTech antes de confirmar tu pedido.",
  path: "/cart",
  noindex: true,
});

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
