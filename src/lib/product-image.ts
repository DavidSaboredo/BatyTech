export const productImagePlaceholder = "/brand/sin-foto.svg";

// Productos sin foto (o con la imagen genérica de la plantilla) muestran un reemplazo prolijo.
export function productImageUrl(url?: string | null) {
  const value = url?.trim();
  if (!value || value === "/window.svg") return productImagePlaceholder;
  return value;
}
