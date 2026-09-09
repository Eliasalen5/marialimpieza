"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { leerCombo } from "@/lib/combos";
import type { Combo } from "@/lib/types";
import FormCombo from "@/components/FormCombo";

export default function EditarCombo({ id }: { id: string }) {
  const [combo, setCombo] = useState<Combo | null>(null);
  const [cargando, setCargando] = useState(true);
  const [noEncontrado, setNoEncontrado] = useState(false);

  useEffect(() => {
    let activo = true;
    leerCombo(id).then((c) => {
      if (!activo) return;
      if (!c) {
        setNoEncontrado(true);
      } else {
        setCombo(c);
      }
      setCargando(false);
    });
    return () => {
      activo = false;
    };
  }, [id]);

  if (cargando) {
    return <div className="cargando">Cargando combo…</div>;
  }

  if (noEncontrado || !combo) {
    return (
      <div className="contenedor">
        <div className="sin-productos">
          <p>El combo no existe o fue eliminado.</p>
          <p>
            <Link href="/admin/combos" className="boton boton-primario">
              Volver a combos
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
            <h1>Editar combo</h1>
            <p className="subtitulo">{combo.nombre}</p>
          </div>
        </div>
        <div className="tarjeta">
          <FormCombo combo={combo} />
        </div>
      </div>
    </div>
  );
}