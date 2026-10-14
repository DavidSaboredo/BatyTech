export const productImagePlaceholder = "/brand/sin-foto.svg";

// Productos sin foto (o con la imagen genérica de la plantilla) muestran un reemplazo prolijo.
export function productImageUrl(url?: string | null) {
  const value = url?.trim();
  if (!value || value === "/window.svg") return productImagePlaceholder;
  return value;
}

// Las fotos de ejemplo (public/productos) son cuadradas y de fondo oscuro: se muestran
// sin margen sobre fondo oscuro. Las fotos subidas desde el panel mantienen el fondo claro.
export function isDemoPhoto(url?: string | null) {
  return Boolean(url?.trim().startsWith("/productos/"));
}
