"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Combo, ItemCarrito, ItemComboDetalle, Producto } from "@/lib/types";
import { formatearPrecio } from "@/lib/formato";
import { useCarrito } from "@/context/CartContext";
import {
  urlWhatsApp,
  mensajeComboDirecto,
  hayNumeroWhatsApp,
} from "@/lib/whatsapp";

interface Props {
  combos: Combo[];
  productos: Producto[];
}

interface ComboPreparado {
  combo: Combo;
  visibles: boolean;
  agotado: boolean;
  maxCantidad: number;
  precioNormal: number;
  miembros: { producto: Producto; cantidad: number }[];
  imagen: string;
}

export default function ComboSection({ combos, productos }: Props) {
  const { agregarCombo, abrir } = useCarrito();
  const carruselRef = useRef<HTMLDivElement>(null);
  const [puedeIzquierda, setPuedeIzquierda] = useState(false);
  const [puedeDerecha, setPuedeDerecha] = useState(false);

  const preparados: ComboPreparado[] = combos.map((combo) => {
    const miembros = combo.items
      .map((item) => {
        const producto = productos.find((p) => p.id === item.productoId);
        return producto ? { producto, cantidad: item.cantidad } : null;
      })
      .filter((m): m is { producto: Producto; cantidad: number } => m !== null);

    const visibles = miembros.length === combo.items.length;
    const preciosNormales = miembros.map((m) => m.producto.precio * m.cantidad);
    const precioNormal = preciosNormales.reduce((a, b) => a + b, 0);
    const maxCantidad = visibles
      ? Math.max(
          0,
          Math.min(...miembros.map((m) => Math.floor(m.producto.stock / m.cantidad)))
        )
      : 0;
    const agotado = !visibles || maxCantidad === 0;

    return {
      combo,
      visibles,
      agotado,
      maxCantidad: Math.max(maxCantidad, 0),
      precioNormal,
      miembros,
      imagen: miembros[0]?.producto.imagenUrl ?? "",
    };
  });

  const actualizarFlechas = useCallback(() => {
    const el = carruselRef.current;
    if (!el) return;
    setPuedeIzquierda(el.scrollLeft > 4);
    setPuedeDerecha(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    actualizarFlechas();
  }, [combos, productos, actualizarFlechas]);

  if (preparados.length === 0) return null;

  function mover(direccion: 1 | -1) {
    const el = carruselRef.current;
    if (!el) return;
    el.scrollBy({ left: direccion * Math.round(el.clientWidth * 0.8), behavior: "smooth" });
  }

  function agregar(preparado: ComboPreparado) {
    const miembros: ItemComboDetalle[] = preparado.miembros.map((m) => ({
      nombre: m.producto.nombre,
      codigo: m.producto.codigo,
      cantidad: m.cantidad,
      imagenUrl: m.producto.imagenUrl,
    }));
    const item: ItemCarrito = {
      id: preparado.combo.id,
      codigo: preparado.combo.codigo,
      nombre: preparado.combo.nombre,
      esCombo: true,
      precio: preparado.combo.precio,
      imagenUrl: preparado.imagen,
      cantidad: 1,
      stock: preparado.maxCantidad,
      miembros,
    };
    agregarCombo(item);
    abrir();
  }

  return (
    <section className="combos" aria-label="Ofertas y combos">
      <div className="combos-cabecera">
        <div>
          <h2>Combos y ofertas</h2>
          <p className="subtitulo">Productos combinados a precio especial</p>
        </div>
        <div className="combos-flechas">
          <button
            type="button"
            className="boton-flecha"
            onClick={() => mover(-1)}
            disabled={!puedeIzquierda}
            aria-label="Ver combos anteriores"
          >
            ‹
          </button>
          <button
            type="button"
            className="boton-flecha"
            onClick={() => mover(1)}
            disabled={!puedeDerecha}
            aria-label="Ver más combos"
          >
            ›
          </button>
        </div>
      </div>

      <div
        className="combos-carrusel"
        ref={carruselRef}
        onScroll={actualizarFlechas}
      >
        {preparados.map((preparado) => {
          const { combo } = preparado;
          const miembros = preparado.miembros;
          return (
            <article className="tarjeta-combo" key={combo.id}>
              <div className="combo-imagenes">
                {miembros.slice(0, 2).map((m, idx) =>
                  m.producto.imagenUrl ? (
                    <Image
                      key={m.producto.id}
                      className="combo-foto"
                      src={m.producto.imagenUrl}
                      alt={m.producto.nombre}
                      width={120}
                      height={120}
                      style={idx === 1 ? { marginLeft: -30 } : undefined}
                    />
                  ) : (
                    <div
                      key={m.producto.id}
                      className="combo-foto"
                      style={{ background: "var(--fondo)" }}
                    />
                  )
                )}
              </div>

              <div className="combo-info">
                <h3>{combo.nombre}</h3>
                {combo.codigo && (
                  <span className="producto-codigo">Código: {combo.codigo}</span>
                )}
                {combo.descripcion && <p>{combo.descripcion}</p>}
                <div className="combo-miembros">
                  {miembros.map((m) => (
                    <span key={m.producto.id} className="combo-miembro">
                      {m.cantidad}x {m.producto.nombre}
                    </span>
                  ))}
                </div>
              </div>

              <div className="combo-precios">
                <span className="precio-normal">
                  {formatearPrecio(preparado.precioNormal)}
                </span>
                <span className="precio-oferta">
                  {formatearPrecio(combo.precio)}
                </span>
                {preparado.agotado ? (
                  <span className="etiqueta-stock agotado">Agotado</span>
                ) : (
                  <span className="etiqueta-stock disponible">En stock</span>
                )}
              </div>

              <div className="card-acciones">
                <button
                  className="boton boton-primario"
                  onClick={() => agregar(preparado)}
                  disabled={preparado.agotado}
                >
                  {preparado.agotado ? "Agotado" : "Agregar al carrito"}
                </button>
                {hayNumeroWhatsApp && !preparado.agotado && (
                  <a
                    className="boton boton-secundario"
                    target="_blank"
                    rel="noopener noreferrer"
                    href={urlWhatsApp(
                      mensajeComboDirecto(
                        combo,
                        preparado.miembros.map((m) => ({
                          nombre: m.producto.nombre,
                          codigo: m.producto.codigo,
                          cantidad: m.cantidad,
                        }))
                      )
                    )}
                  >
                    Encargar
                  </a>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}