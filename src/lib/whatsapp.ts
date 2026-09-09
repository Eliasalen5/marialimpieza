import type { Combo, ItemCarrito, ItemComboDetalle, Producto } from "@/lib/types";
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

function incluyeProductos(miembros: ItemComboDetalle[]): string {
  return miembros
    .map((m) => {
      const ref = referenciaProducto(m.codigo, undefined);
      const sufijo = ref ? ` (Código: ${ref})` : "";
      const importe =
        typeof m.precio === "number"
          ? ` - ${formatearPrecio(m.cantidad * m.precio)}`
          : "";
      return `   • ${m.cantidad}x ${m.nombre}${sufijo}${importe}`;
    })
    .join("\n");
}

export function mensajePedido(items: ItemCarrito[], total: number): string {
  const lineas = items.map((i) =>
    i.esCombo && i.miembros && i.miembros.length > 0
      ? `${lineaProducto(
          i.nombre,
          i.codigo,
          i.id,
          i.cantidad,
          formatearPrecio(i.precio * i.cantidad)
        )}\n${incluyeProductos(i.miembros)}`
      : lineaProducto(
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

export function mensajeComboDirecto(
  combo: Combo,
  miembros?: ItemComboDetalle[]
): string {
  const ref = referenciaProducto(combo.codigo, combo.id);
  const sufijo = ref ? ` (Código: ${ref})` : "";
  const desglose =
    miembros && miembros.length > 0 ? `\n${incluyeProductos(miembros)}` : "";
  return `${saludo}:\n• 1x ${combo.nombre}${sufijo} - ${formatearPrecio(
    combo.precio
  )}${desglose}`;
}