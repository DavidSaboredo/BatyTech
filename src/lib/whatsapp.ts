// wa.me necesita solo dígitos: se quitan "+", espacios y guiones (ej: "+54 9 11 1234-5678").
export function normalizeWhatsAppNumber(input: string) {
  return input.replace(/\D/g, "");
}

export function buildWhatsAppMessage(args: {
  storeName: string;
  orderId: string;
  customer: { customerName: string; email: string; phone?: string; address?: string };
  items: { name: string; quantity: number; unitPriceCents: number }[];
  totalCents: number;
  formatMoney: (cents: number) => string;
}) {
  const lines: string[] = [];
  lines.push(`¡Hola ${args.storeName}! Quiero confirmar este pedido.`);
  lines.push(`Pedido: ${args.orderId}`);
  lines.push("");
  lines.push(`Nombre: ${args.customer.customerName}`);
  lines.push(`Email: ${args.customer.email}`);
  if (args.customer.phone) lines.push(`Teléfono: ${args.customer.phone}`);
  if (args.customer.address) lines.push(`Dirección: ${args.customer.address}`);
  lines.push("");
  lines.push("Productos:");
  for (const item of args.items) {
    lines.push(`- ${item.quantity} x ${item.name} (${args.formatMoney(item.unitPriceCents)} c/u)`);
  }
  lines.push("");
  lines.push(`Total: ${args.formatMoney(args.totalCents)}`);
  return lines.join("\n");
}

export function buildWhatsAppLink(args: { number: string; message: string }) {
  const number = normalizeWhatsAppNumber(args.number);
  const text = encodeURIComponent(args.message);
  if (!number) return "";
  return `https://wa.me/${number}?text=${text}`;
}
