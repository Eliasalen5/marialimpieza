const localizacion = process.env.NEXT_PUBLIC_LOCALIZACION || "es-AR";
const moneda = process.env.NEXT_PUBLIC_MONEDA || "ARS";

export function formatearPrecio(precio: number): string {
  return new Intl.NumberFormat(localizacion, {
    style: "currency",
    currency: moneda,
  }).format(precio);
}