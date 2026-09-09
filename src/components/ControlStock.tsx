"use client";

import { useState } from "react";
import { actualizarProducto } from "@/lib/products";

interface Props {
  productoId: string;
  stock: number;
}

export default function ControlStock({ productoId, stock }: Props) {
  const [valor, setValor] = useState(stock);
  const [stockAnterior, setStockAnterior] = useState(stock);
  const [guardando, setGuardando] = useState(false);

  if (stockAnterior !== stock) {
    setStockAnterior(stock);
    setValor(stock);
  }

  async function guardar(nuevo: number) {
    const cantidad = Math.max(0, Math.round(Number.isFinite(nuevo) ? nuevo : 0));
    setValor(cantidad);
    setGuardando(true);
    try {
      await actualizarProducto(productoId, { stock: cantidad });
    } catch {
      setValor(stock);
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="control-stock">
      <button
        type="button"
        className="boton-icono"
        onClick={() => guardar(valor - 1)}
        disabled={guardando}
        aria-label="Restar stock"
      >
        −
      </button>
      <input
        className="numero"
        type="number"
        min={0}
        value={valor}
        onChange={(e) => setValor(Number(e.target.value))}
        onBlur={(e) => guardar(Number(e.target.value))}
        aria-label="Cantidad en stock"
      />
      <button
        type="button"
        className="boton-icono"
        onClick={() => guardar(valor + 1)}
        disabled={guardando}
        aria-label="Sumar stock"
      >
        +
      </button>
    </div>
  );
}