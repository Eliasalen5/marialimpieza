"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { suscribirProductos } from "@/lib/products";
import { suscribirCategorias } from "@/lib/categories";
import type { Categoria, Producto } from "@/lib/types";
import { formatearPrecio } from "@/lib/formato";
import { useCarrito } from "@/context/CartContext";
import {
  urlWhatsApp,
  mensajeProductoDirecto,
  hayNumeroWhatsApp,
  referenciaProducto,
} from "@/lib/whatsapp";

export default function Catalogo() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaActiva, setCategoriaActiva] = useState<string | null>(null);
  const [productosCargados, setProductosCargados] = useState(false);
  const [categoriasCargadas, setCategoriasCargadas] = useState(false);
  const { agregar } = useCarrito();

  useEffect(() => {
    const desuscribirProductos = suscribirProductos(true, (lista) => {
      setProductos(lista);
      setProductosCargados(true);
    });
    const desuscribirCategorias = suscribirCategorias((lista) => {
      setCategorias(lista);
      setCategoriasCargadas(true);
    });
    return () => {
      desuscribirProductos();
      desuscribirCategorias();
    };
  }, []);

  const cargando = !productosCargados;
  const visibles = categoriaActiva
    ? productos.filter((p) => p.categoriaId === categoriaActiva)
    : productos;

  if (cargando) {
    return <div className="cargando">Cargando catálogo…</div>;
  }

  return (
    <div className="contenedor">
      <div className="pagina-titulo">
        <div>
          <h1>Catálogo</h1>
          <p className="subtitulo">Productos disponibles</p>
        </div>
      </div>

      {categoriasCargadas && categorias.length > 0 && (
        <div className="categorias" role="tablist" aria-label="Filtrar por categoría">
          <button
            type="button"
            className={`chip-categoria${categoriaActiva === null ? " activo" : ""}`}
            onClick={() => setCategoriaActiva(null)}
          >
            Todos
          </button>
          {categorias.map((c) => (
            <button
              type="button"
              key={c.id}
              className={`chip-categoria${categoriaActiva === c.id ? " activo" : ""}`}
              onClick={() => setCategoriaActiva(c.id)}
            >
              {c.nombre}
            </button>
          ))}
        </div>
      )}

      {productos.length === 0 ? (
        <div className="sin-productos">
          Todavía no hay productos publicados. Vuelve pronto.
        </div>
      ) : visibles.length === 0 ? (
        <div className="sin-productos">
          No hay productos en esta categoría todavía.
        </div>
      ) : (
        <div className="rejilla-productos">
          {visibles.map((p) => (
            <article className="tarjeta-producto" key={p.id}>
              {p.imagenUrl ? (
                <Image
                  className="imagen"
                  src={p.imagenUrl}
                  alt={p.nombre}
                  width={400}
                  height={400}
                />
              ) : (
                <div className="imagen" style={{ background: "var(--fondo)" }} />
              )}
              <div className="info">
                <h3>{p.nombre}</h3>
                {referenciaProducto(p.codigo, p.id) && (
                  <span className="producto-codigo">
                    Código: {referenciaProducto(p.codigo, p.id)}
                  </span>
                )}
                {p.descripcion && <p className="descripcion">{p.descripcion}</p>}
                <div className="precio">{formatearPrecio(p.precio)}</div>
                {p.stock > 0 ? (
                  <span className="etiqueta-stock disponible">
                    En stock ({p.stock})
                  </span>
                ) : (
                  <span className="etiqueta-stock agotado">Agotado</span>
                )}
                <div className="card-acciones">
                  <button
                    className="boton boton-primario"
                    onClick={() => agregar(p)}
                    disabled={p.stock === 0}
                  >
                    {p.stock === 0 ? "Agotado" : "Agregar al carrito"}
                  </button>
                  {hayNumeroWhatsApp && p.stock > 0 && (
                    <a
                      className="boton boton-secundario"
                      target="_blank"
                      rel="noopener noreferrer"
                      href={urlWhatsApp(mensajeProductoDirecto(p))}
                    >
                      Encargar
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}