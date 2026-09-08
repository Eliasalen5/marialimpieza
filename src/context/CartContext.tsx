"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { ItemCarrito, Producto } from "@/lib/types";

interface CarritoContextValue {
  items: ItemCarrito[];
  unidades: number;
  total: number;
  abierto: boolean;
  agregar: (producto: Producto) => void;
  quitar: (id: string) => void;
  cambiarCantidad: (id: string, cantidad: number) => void;
  vaciar: () => void;
  abrir: () => void;
  cerrar: () => void;
}

const CarritoContext = createContext<CarritoContextValue | null>(null);

const CLAVE = "carrito";

function leerGuardado(): ItemCarrito[] {
  try {
    const guardado = localStorage.getItem(CLAVE);
    if (!guardado) return [];
    const datos = JSON.parse(guardado) as ItemCarrito[];
    if (!Array.isArray(datos)) return [];
    return datos.map((i) => ({
      id: i.id,
      codigo: i.codigo,
      nombre: i.nombre,
      precio: i.precio,
      imagenUrl: i.imagenUrl,
      cantidad: Math.max(1, i.cantidad),
      stock: Math.max(i.stock, i.cantidad),
    }));
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ItemCarrito[]>([]);
  const [abierto, setAbierto] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(leerGuardado());
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(items));
    } catch {
      // Sin almacenamiento disponible; se ignora.
    }
  }, [items]);

  function agregar(producto: Producto) {
    setItems((prev) => {
      const existente = prev.find((i) => i.id === producto.id);
      if (existente) {
        return prev.map((i) =>
          i.id === producto.id
            ? { ...i, cantidad: Math.min(i.cantidad + 1, producto.stock) }
            : i
        );
      }
      return [
        ...prev,
        {
          id: producto.id,
          codigo: producto.codigo,
          nombre: producto.nombre,
          precio: producto.precio,
          imagenUrl: producto.imagenUrl,
          cantidad: 1,
          stock: producto.stock,
        },
      ];
    });
  }

  function quitar(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function cambiarCantidad(id: string, cantidad: number) {
    setItems((prev) => {
      if (cantidad < 1) return prev.filter((i) => i.id !== id);
      return prev.map((i) =>
        i.id === id ? { ...i, cantidad: Math.min(cantidad, i.stock) } : i
      );
    });
  }

  function vaciar() {
    setItems([]);
  }

  const unidades = items.reduce((acc, i) => acc + i.cantidad, 0);
  const total = items.reduce((acc, i) => acc + i.precio * i.cantidad, 0);

  return (
    <CarritoContext.Provider
      value={{
        items,
        unidades,
        total,
        abierto,
        agregar,
        quitar,
        cambiarCantidad,
        vaciar,
        abrir: () => setAbierto(true),
        cerrar: () => setAbierto(false),
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
}

export function useCarrito(): CarritoContextValue {
  const ctx = useContext(CarritoContext);
  if (!ctx) throw new Error("useCarrito debe usarse dentro de CartProvider");
  return ctx;
}