"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  suscribirCombos,
  eliminarCombo,
  actualizarCombo,
} from "@/lib/combos";
import { suscribirProductos } from "@/lib/products";
import type { Combo, Producto } from "@/lib/types";
import { formatearPrecio } from "@/lib/formato";

export default function CombosAdmin() {
  const [combos, setCombos] = useState<Combo[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const desuscribirCombos = suscribirCombos(false, (lista) => {
      setCombos(lista);
      setCargando(false);
    });
    const desuscribirProductos = suscribirProductos(true, setProductos);
    return () => {
      desuscribirCombos();
      desuscribirProductos();
    };
  }, []);

  const importeNormal = (combo: Combo) =>
    combo.items.reduce((acc, item) => {
      const p = productos.find((x) => x.id === item.productoId);
      return acc + (p ? p.precio * item.cantidad : 0);
    }, 0);

  const nombreProductos = (combo: Combo) =>
    combo.items
      .map((item) => {
        const p = productos.find((x) => x.id === item.productoId);
        return p
          ? `${item.cantidad}x ${p.nombre}`
          : `${item.cantidad}x (producto eliminado)`;
      })
      .join(" + ");

  async function borrar(combo: Combo) {
    if (!window.confirm(`¿Eliminar el combo "${combo.nombre}"?`)) return;
    try {
      await eliminarCombo(combo.id);
    } catch {
      window.alert("No se pudo eliminar el combo.");
    }
  }

  async function alternarActivo(combo: Combo) {
    await actualizarCombo(combo.id, { activo: !combo.activo });
  }

  if (cargando) {
    return <div className="cargando">Cargando combos…</div>;
  }

  return (
    <div className="contenedor">
      <div className="pagina-titulo">
        <div>
          <h1>Combos</h1>
          <p className="subtitulo">
            Combina productos con un precio de oferta para el catálogo
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link href="/admin" className="boton boton-secundario">
            Volver
          </Link>
          <Link href="/admin/combos/nuevo" className="boton boton-primario">
            + Agregar combo
          </Link>
        </div>
      </div>

      {combos.length === 0 ? (
        <div className="sin-productos">
          No hay combos todavía. Crea el primero con el botón de arriba.
        </div>
      ) : (
        <div className="tarjeta" style={{ padding: "12px 16px" }}>
          <table className="tabla">
            <thead>
              <tr>
                <th>Combo</th>
                <th>Incluye</th>
                <th>Precio normal</th>
                <th>Precio combo</th>
                <th>Catálogo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {combos.map((combo) => (
                <tr key={combo.id}>
                  <td data-etiqueta="Combo">
                    <Link
                      href={`/admin/combos/${combo.id}`}
                      style={{ fontWeight: 600 }}
                    >
                      {combo.nombre}
                    </Link>
                    {combo.codigo && (
                      <>
                        <br />
                        <span style={{ color: "var(--texto-suave)", fontSize: 13 }}>
                          {combo.codigo}
                        </span>
                      </>
                    )}
                  </td>
                  <td data-etiqueta="Incluye">{nombreProductos(combo)}</td>
                  <td data-etiqueta="Precio normal">
                    {formatearPrecio(importeNormal(combo))}
                  </td>
                  <td data-etiqueta="Precio combo">
                    {formatearPrecio(combo.precio)}
                  </td>
                  <td data-etiqueta="Catálogo">
                    <input
                      type="checkbox"
                      checked={combo.activo}
                      onChange={() => alternarActivo(combo)}
                      aria-label={`Mostrar en catálogo ${combo.nombre}`}
                    />
                  </td>
                  <td data-etiqueta="Acciones">
                    <div className="acciones">
                      <Link
                        className="boton-icono"
                        href={`/admin/combos/${combo.id}`}
                      >
                        Editar
                      </Link>
                      <button
                        className="boton-icono peligro"
                        onClick={() => borrar(combo)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}