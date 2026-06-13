export function normalizeWhatsAppNumber(input: string) {
  const trimmed = input.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("+")) return trimmed.slice(1);
  return trimmed.replaceAll(/\s+/g, "");
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
  lines.push(`Hola! Quiero confirmar una compra en ${args.storeName}.`);
  lines.push(`Orden: ${args.orderId}`);
  lines.push("");
  lines.push(`Nombre: ${args.customer.customerName}`);
  lines.push(`Email: ${args.customer.email}`);
  if (args.customer.phone) lines.push(`Tel: ${args.customer.phone}`);
  if (args.customer.address) lines.push(`Dirección: ${args.customer.address}`);
  lines.push("");
  lines.push("Items:");
  for (const item of args.items) {
    lines.push(`- ${item.name} x${item.quantity} (${args.formatMoney(item.unitPriceCents)})`);
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
