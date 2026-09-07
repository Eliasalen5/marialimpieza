"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { leerProducto } from "@/lib/products";
import type { Producto } from "@/lib/types";
import FormProducto from "@/components/FormProducto";

export default function EditarProducto({ id }: { id: string }) {
  const [producto, setProducto] = useState<Producto | null>(null);
  const [cargando, setCargando] = useState(true);
  const [noEncontrado, setNoEncontrado] = useState(false);

  useEffect(() => {
    let activo = true;
    leerProducto(id).then((p) => {
      if (!activo) return;
      if (!p) {
        setNoEncontrado(true);
      } else {
        setProducto(p);
      }
      setCargando(false);
    });
    return () => {
      activo = false;
    };
  }, [id]);

  if (cargando) {
    return <div className="cargando">Cargando producto…</div>;
  }

  if (noEncontrado || !producto) {
    return (
      <div className="contenedor">
        <div className="sin-productos">
          <p>El producto no existe o fue eliminado.</p>
          <p>
            <Link href="/admin" className="boton boton-primario">
              Volver al panel
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="contenedor">
      <div style={{ maxWidth: 560 }}>
        <div className="pagina-titulo">
          <div>
            <h1>Editar producto</h1>
            <p className="subtitulo">{producto.nombre}</p>
          </div>
        </div>
        <div className="tarjeta">
          <FormProducto producto={producto} />
        </div>
      </div>
    </div>
  );
}