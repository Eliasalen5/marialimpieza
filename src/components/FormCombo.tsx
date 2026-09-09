"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { suscribirProductos } from "@/lib/products";
import {
  crearCombo,
  actualizarCombo,
  nuevoComboDatos,
  esComboDatosValido,
} from "@/lib/combos";
import type { Combo, ItemCombo, Producto } from "@/lib/types";
import { formatearPrecio } from "@/lib/formato";

interface Props {
  combo?: Combo;
}

export default function FormCombo({ combo }: Props) {
  const router = useRouter();
  const editando = Boolean(combo);

  const [productos, setProductos] = useState<Producto[]>([]);
  const [nombre, setNombre] = useState(combo?.nombre ?? "");
  const [descripcion, setDescripcion] = useState(combo?.descripcion ?? "");
  const [precio, setPrecio] = useState(combo?.precio.toString() ?? "");
  const [items, setItems] = useState<ItemCombo[]>(
    combo?.items ?? [{ productoId: "", cantidad: 1 }]
  );
  const [activo, setActivo] = useState(combo?.activo ?? true);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const desuscribir = suscribirProductos(true, setProductos);
    return desuscribir;
  }, []);

  const normales = items.reduce((acc, item) => {
    const p = productos.find((x) => x.id === item.productoId);
    return acc + (p ? p.precio * item.cantidad : 0);
  }, 0);

  function seleccionados() {
    return items
      .map((i) => i.productoId)
      .filter((id) => id && id.trim() !== "");
  }

  function cambiarItem(indice: number, clave: keyof ItemCombo, valor: string | number) {
    setItems((prev) =>
      prev.map((i, idx) => (idx === indice ? { ...i, [clave]: valor } : i))
    );
  }

  function quitarItem(indice: number) {
    setItems((prev) =>
      prev.length > 1 ? prev.filter((_, idx) => idx !== indice) : prev
    );
  }

  function agregarItem() {
    setItems((prev) => [...prev, { productoId: "", cantidad: 1 }]);
  }

  async function guardar(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setCargando(true);

    try {
      const precioNumero = Number(precio);
      const itemsLimpios = items.filter(
        (i) => i.productoId && Number(i.cantidad) > 0
      );
      const invalido = esComboDatosValido(nombre, precioNumero, itemsLimpios);
      if (invalido) throw new Error(invalido);

      for (const item of itemsLimpios) {
        const p = productos.find((x) => x.id === item.productoId);
        if (!p || p.stock < item.cantidad)
          throw new Error(
            `No hay stock suficiente para "${p?.nombre ?? "un producto"}" del combo.`
          );
      }

      const datos = {
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        precio: precioNumero,
        items: itemsLimpios,
        activo,
      };

      if (editando && combo) {
        await actualizarCombo(combo.id, datos);
      } else {
        await crearCombo(nuevoComboDatos(datos));
      }

      router.push("/admin/combos");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ocurrió un error al guardar."
      );
    } finally {
      setCargando(false);
    }
  }

  return (
    <form onSubmit={guardar}>
      {error && <div className="aviso aviso-error">{error}</div>}

      <div className="campo">
        <label htmlFor="nombre">Nombre del combo</label>
        <input
          id="nombre"
          type="text"
          required
          placeholder="Ej. Combo Limpieza Total"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
      </div>

      <div className="campo">
        <label htmlFor="descripcion">Descripción</label>
        <textarea
          id="descripcion"
          placeholder="Ej. Detergente + lavandina para un baño completo"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
      </div>

      <div className="campo">
        <span className="campo-label-bloque">Productos incluidos</span>
        {items.map((item, indice) => {
          const usados = seleccionados().filter(
            (id) => id !== item.productoId && id !== ""
          );
          return (
            <div className="combo-item" key={indice}>
              <select
                value={item.productoId}
                onChange={(e) =>
                  cambiarItem(indice, "productoId", e.target.value)
                }
              >
                <option value="">Elegí un producto…</option>
                {productos
                  .filter((p) => !usados.includes(p.id))
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre}
                    </option>
                  ))}
              </select>
              <div className="combo-cantidad">
                <input
                  type="number"
                  min={1}
                  step={1}
                  value={item.cantidad}
                  onChange={(e) =>
                    cambiarItem(indice, "cantidad", Number(e.target.value))
                  }
                />
              </div>
              <button
                type="button"
                className="boton-icono peligro"
                onClick={() => quitarItem(indice)}
                disabled={items.length <= 1}
              >
                Quitar
              </button>
            </div>
          );
        })}
        <button
          type="button"
          className="boton-icono"
          onClick={agregarItem}
          style={{ marginTop: 8 }}
        >
          + Agregar producto
        </button>
        <p className="subtitulo" style={{ marginTop: 8 }}>
          Precio normal del conjunto:{" "}
          <strong style={{ color: "var(--texto)" }}>
            {formatearPrecio(normales)}
          </strong>
        </p>
      </div>

      <div className="campo">
        <label htmlFor="precio">Precio del combo (oferta)</label>
        <input
          id="precio"
          type="number"
          min={0}
          step="0.01"
          required
          placeholder="Menor al precio normal para que sea oferta"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
        />
      </div>

      <div className="campo campo-checkbox">
        <input
          id="activo"
          type="checkbox"
          checked={activo}
          onChange={(e) => setActivo(e.target.checked)}
        />
        <label htmlFor="activo">Visible en el catálogo</label>
      </div>

      <button
        type="submit"
        className="boton boton-primario"
        disabled={cargando}
      >
        {cargando ? "Guardando…" : editando ? "Guardar cambios" : "Crear combo"}
      </button>
    </form>
  );
}