"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { suscribirProductos, eliminarProducto, actualizarProducto } from "@/lib/products";
import { suscribirCategorias } from "@/lib/categories";
import type { Categoria, Producto } from "@/lib/types";
import { formatearPrecio } from "@/lib/formato";
import ControlStock from "@/components/ControlStock";

export default function PanelAdmin() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const desuscribirProductos = suscribirProductos(false, (lista) => {
      setProductos(lista);
      setCargando(false);
    });
    const desuscribirCategorias = suscribirCategorias(setCategorias);
    return () => {
      desuscribirProductos();
      desuscribirCategorias();
    };
  }, []);

  const nombreCategoria = (id?: string) =>
    categorias.find((c) => c.id === id)?.nombre;

  async function borrar(p: Producto) {
    if (!window.confirm(`¿Eliminar el producto "${p.nombre}"?`)) return;
    try {
      await eliminarProducto(p.id, p.imagenUrl);
    } catch (error) {
      console.error(error);
      window.alert("No se pudo eliminar el producto.");
    }
  }

  async function alternarActivo(p: Producto) {
    await actualizarProducto(p.id, { activo: !p.activo });
  }

  if (cargando) {
    return <div className="cargando">Cargando productos…</div>;
  }

  return (
    <div className="contenedor">
      <div className="pagina-titulo">
        <div>
          <h1>Panel de administración</h1>
          <p className="subtitulo">
            Gestiona productos y control de stock
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link
            href="/admin/categorias"
            className="boton boton-secundario"
          >
            + Categorías
          </Link>
          <Link href="/admin/combos" className="boton boton-secundario">
            + Combos
          </Link>
          <Link href="/admin/productos/nuevo" className="boton boton-primario">
            + Agregar producto
          </Link>
        </div>
      </div>

      {productos.length === 0 ? (
        <div className="sin-productos">
          No hay productos todavía. Agrega el primero con el botón de arriba.
        </div>
      ) : (
        <div className="tarjeta" style={{ padding: "12px 16px" }}>
          <table className="tabla">
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Producto</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Catálogo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((p) => (
                <tr key={p.id}>
                  <td data-etiqueta="Imagen">
                    {p.imagenUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        className="imagen-miniatura"
                        src={p.imagenUrl}
                        alt={p.nombre}
                      />
                    ) : (
                      <span className="imagen-miniatura" style={{ display: "block", background: "var(--fondo)" }} />
                    )}
                  </td>
                  <td data-etiqueta="Producto">
                    <Link href={`/admin/productos/${p.id}`} style={{ fontWeight: 600 }}>
                      {p.nombre}
                    </Link>
                    <br />
                    <span style={{ color: "var(--texto-suave)", fontSize: 13 }}>
                      {p.codigo ? `${p.codigo} · ` : ""}
                      {nombreCategoria(p.categoriaId) ? `${nombreCategoria(p.categoriaId)} · ` : ""}
                      {p.stock === 0 ? "Sin stock" : `${p.stock} disponibles`}
                    </span>
                  </td>
                  <td data-etiqueta="Precio">{formatearPrecio(p.precio)}</td>
                  <td data-etiqueta="Stock">
                    <ControlStock productoId={p.id} stock={p.stock} />
                  </td>
                  <td data-etiqueta="Catálogo">
                    <input
                      type="checkbox"
                      checked={p.activo}
                      onChange={() => alternarActivo(p)}
                      aria-label={`Mostrar en catálogo ${p.nombre}`}
                    />
                  </td>
                  <td data-etiqueta="Acciones">
                    <div className="acciones">
                      <Link
                        className="boton-icono"
                        href={`/admin/productos/${p.id}`}
                      >
                        Editar
                      </Link>
                      <button
                        className="boton-icono peligro"
                        onClick={() => borrar(p)}
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