"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  suscribirCategorias,
  crearCategoria,
  renombrarCategoria,
  eliminarCategoria,
} from "@/lib/categories";
import type { Categoria } from "@/lib/types";

export default function Categorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cargando, setCargando] = useState(true);
  const [nueva, setNueva] = useState("");
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    const desuscribir = suscribirCategorias((lista) => {
      setCategorias(lista);
      setCargando(false);
    });
    return desuscribir;
  }, []);

  async function agregar(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setExito("");
    setGuardando(true);
    try {
      if (!nueva.trim()) throw new Error("Escribí un nombre para la categoría.");
      await crearCategoria(nueva);
      setNueva("");
      setExito("Categoría agregada.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo agregar.");
    } finally {
      setGuardando(false);
    }
  }

  async function guardarRenombre(categoria: Categoria) {
    setError("");
    setExito("");
    try {
      if (!categoria.nombre.trim())
        throw new Error("El nombre no puede quedar vacío.");
      await renombrarCategoria(categoria.id, categoria.nombre);
      setExito("Categoría actualizada.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo actualizar.");
    }
  }

  async function borrar(categoria: Categoria) {
    if (
      !window.confirm(
        `¿Eliminar la categoría "${categoria.nombre}"? Los productos que la usan quedarán sin categoría.`
      )
    )
      return;
    setError("");
    setExito("");
    try {
      await eliminarCategoria(categoria.id);
      setExito("Categoría eliminada.");
    } catch {
      setError("No se pudo eliminar la categoría.");
    }
  }

  return (
    <div className="contenedor">
      <div style={{ maxWidth: 560 }}>
        <div className="pagina-titulo">
          <div>
            <h1>Categorías</h1>
            <p className="subtitulo">
              Organizá los productos por categoría para el catálogo
            </p>
          </div>
        </div>

        {error && <div className="aviso aviso-error">{error}</div>}
        {exito && <div className="aviso aviso-exito">{exito}</div>}

        <div className="tarjeta">
          <form onSubmit={agregar} style={{ display: "flex", gap: 10 }}>
            <input
              type="text"
              placeholder="Nueva categoría (ej. Cercos)"
              value={nueva}
              onChange={(e) => setNueva(e.target.value)}
              style={{ flex: 1 }}
            />
            <button
              type="submit"
              className="boton boton-primario"
              disabled={guardando}
            >
              Agregar
            </button>
          </form>

          {cargando ? (
            <div className="cargando">Cargando categorías…</div>
          ) : categorias.length === 0 ? (
            <p className="sin-productos" style={{ marginTop: 16 }}>
              Todavía no hay categorías. Creá la primera con el formulario de
              arriba.
            </p>
          ) : (
            <ul style={{ listStyle: "none", margin: 0, padding: 0, marginTop: 16 }}>
              {categorias.map((categoria) => (
                <li
                  key={categoria.id}
                  style={{
                    display: "flex",
                    gap: 10,
                    alignItems: "center",
                    padding: "10px 0",
                    borderBottom: "1px solid var(--borde)",
                  }}
                >
                  <input
                    type="text"
                    value={categoria.nombre}
                    onChange={(e) => {
                      setCategorias((prev) =>
                        prev.map((c) =>
                          c.id === categoria.id
                            ? { ...c, nombre: e.target.value }
                            : c
                        )
                      );
                    }}
                    style={{ flex: 1 }}
                  />
                  <button
                    className="boton-icono"
                    onClick={() => guardarRenombre(categoria)}
                  >
                    Guardar
                  </button>
                  <button
                    className="boton-icono peligro"
                    onClick={() => borrar(categoria)}
                  >
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <p style={{ marginTop: 16 }}>
          <Link href="/admin" className="boton boton-secundario">
            Volver al panel
          </Link>
        </p>
      </div>
    </div>
  );
}