import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Finalizar compra",
  description: "Completá tus datos y confirmá tu pedido de BatysTech por WhatsApp.",
  path: "/checkout",
  noindex: true,
});

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
