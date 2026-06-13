export const orderStatusOptions = [
  { value: "PENDING", label: "Pendiente" },
  { value: "PAID", label: "Pagado" },
  { value: "SHIPPED", label: "Enviado" },
  { value: "CANCELLED", label: "Cancelado" },
] as const;

export function getOrderStatusLabel(value: string) {
  return orderStatusOptions.find((option) => option.value === value)?.label ?? value;
}
