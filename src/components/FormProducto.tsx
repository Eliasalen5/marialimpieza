"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { crearProducto, actualizarProducto, subirImagen, nuevoProductoDatos } from "@/lib/products";
import type { Producto } from "@/lib/types";

interface Props {
  producto?: Producto;
}

export default function FormProducto({ producto }: Props) {
  const router = useRouter();
  const editando = Boolean(producto);

  const [nombre, setNombre] = useState(producto?.nombre ?? "");
  const [descripcion, setDescripcion] = useState(producto?.descripcion ?? "");
  const [precio, setPrecio] = useState(producto?.precio.toString() ?? "");
  const [stock, setStock] = useState(producto?.stock.toString() ?? "0");
  const [activo, setActivo] = useState(producto?.activo ?? true);
  const [archivo, setArchivo] = useState<File | null>(null);
  const [imagenUrl, setImagenUrl] = useState(producto?.imagenUrl ?? "");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  async function guardar(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setCargando(true);

    try {
      const precioNumero = Number(precio);
      const stockNumero = Number(stock);
      if (!nombre.trim()) throw new Error("El nombre es obligatorio.");
      if (Number.isNaN(precioNumero) || precioNumero < 0)
        throw new Error("El precio no es válido.");
      if (Number.isNaN(stockNumero) || stockNumero < 0)
        throw new Error("El stock no es válido.");

      let urlFinal = imagenUrl;
      if (archivo) {
        urlFinal = await subirImagen(archivo);
      }

      const datos = {
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        precio: precioNumero,
        stock: stockNumero,
        imagenUrl: urlFinal,
        activo,
      };

      if (editando && producto) {
        await actualizarProducto(producto.id, datos);
      } else {
        await crearProducto(nuevoProductoDatos(datos));
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ocurrió un error al guardar."
      );
    } finally {
      setCargando(false);
    }
  }

  function alElegirImagen(file: File) {
    setArchivo(file);
    const previa = URL.createObjectURL(file);
    setImagenUrl(previa);
  }

  return (
    <form onSubmit={guardar}>
      {error && <div className="aviso aviso-error">{error}</div>}

      <div className="campo">
        <label htmlFor="nombre">Nombre del producto</label>
        <input
          id="nombre"
          type="text"
          required
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
      </div>

      <div className="campo">
        <label htmlFor="descripcion">Descripción</label>
        <textarea
          id="descripcion"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
      </div>

      <div className="campo">
        <label htmlFor="precio">Precio</label>
        <input
          id="precio"
          type="number"
          min={0}
          step="0.01"
          required
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
        />
      </div>

      <div className="campo">
        <label htmlFor="stock">Stock inicial</label>
        <input
          id="stock"
          type="number"
          min={0}
          step={1}
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />
      </div>

      <div className="campo">
        <label htmlFor="imagen">Imagen del producto</label>
        <input
          id="imagen"
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) alElegirImagen(file);
          }}
        />
      </div>

      {(imagenUrl || archivo) && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className="preview-imagen"
          src={imagenUrl}
          alt="Vista previa del producto"
          width={160}
          height={160}
        />
      )}

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
        {cargando
          ? "Guardando…"
          : editando
            ? "Guardar cambios"
            : "Crear producto"}
      </button>
    </form>
  );
}