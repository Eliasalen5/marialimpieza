import type { ItemCarrito, Producto } from "@/lib/types";
import { formatearPrecio } from "@/lib/formato";

const numeroWhatsApp = (process.env.NEXT_PUBLIC_WHATSAPP || "").replace(
  /\D/g,
  ""
);

const saludo = "Hola Maria, quiero encargarte";

export const hayNumeroWhatsApp = numeroWhatsApp.length > 0;

export function referenciaProducto(codigo?: string, id?: string): string {
  return codigo || id || "";
}

export function urlWhatsApp(texto: string): string {
  const base =
    numeroWhatsApp.length > 0
      ? `https://wa.me/${numeroWhatsApp}`
      : "https://wa.me/";
  return `${base}?text=${encodeURIComponent(texto)}`;
}

function lineaProducto(
  nombre: string,
  codigo: string | undefined,
  id: string,
  cantidad: number,
  importe: string
): string {
  const ref = referenciaProducto(codigo, id);
  const sufijo = ref ? ` (Código: ${ref})` : "";
  return `• ${cantidad}x ${nombre}${sufijo} - ${importe}`;
}

export function mensajePedido(items: ItemCarrito[], total: number): string {
  const lineas = items.map((i) =>
    lineaProducto(
      i.nombre,
      i.codigo,
      i.id,
      i.cantidad,
      formatearPrecio(i.precio * i.cantidad)
    )
  );
  return `${saludo}:\n${lineas.join("\n")}\n\nTOTAL: ${formatearPrecio(total)}`;
}

export function mensajeProductoDirecto(producto: Producto): string {
  const ref = referenciaProducto(producto.codigo, producto.id);
  const sufijo = ref ? ` (Código: ${ref})` : "";
  return `${saludo}:\n• 1x ${producto.nombre}${sufijo} - ${formatearPrecio(
    producto.precio
  )}`;
}