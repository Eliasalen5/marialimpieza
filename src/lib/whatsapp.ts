import type { ItemCarrito, Producto } from "@/lib/types";
import { formatearPrecio } from "@/lib/formato";

const numeroWhatsApp = (process.env.NEXT_PUBLIC_WHATSAPP || "").replace(
  /\D/g,
  ""
);

export const hayNumeroWhatsApp = numeroWhatsApp.length > 0;

export function urlWhatsApp(texto: string): string {
  const base =
    numeroWhatsApp.length > 0
      ? `https://wa.me/${numeroWhatsApp}`
      : "https://wa.me/";
  return `${base}?text=${encodeURIComponent(texto)}`;
}

export function mensajePedido(items: ItemCarrito[], total: number): string {
  const lineas = items.map(
    (i) =>
      `• ${i.cantidad}x ${i.nombre} - ${formatearPrecio(i.precio * i.cantidad)}`
  );
  return `Hola, quiero encargar:\n${lineas.join("\n")}\n\nTOTAL: ${formatearPrecio(
    total
  )}`;
}

export function mensajeProductoDirecto(producto: Producto): string {
  return `Hola, quiero encargar:\n• 1x ${producto.nombre} - ${formatearPrecio(
    producto.precio
  )}`;
}