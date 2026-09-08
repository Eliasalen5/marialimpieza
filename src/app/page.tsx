"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { suscribirProductos } from "@/lib/products";
import type { Producto } from "@/lib/types";
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
  const [cargando, setCargando] = useState(true);
  const { agregar } = useCarrito();

  useEffect(() => {
    const desuscribir = suscribirProductos(true, (lista) => {
      setProductos(lista);
      setCargando(false);
    });
    return desuscribir;
  }, []);

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

      {productos.length === 0 ? (
        <div className="sin-productos">
          Todavía no hay productos publicados. Vuelve pronto.
        </div>
      ) : (
        <div className="rejilla-productos">
          {productos.map((p) => (
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