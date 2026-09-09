"use client";

import { useCarrito } from "@/context/CartContext";
import { urlWhatsApp, mensajePedido, hayNumeroWhatsApp } from "@/lib/whatsapp";
import { formatearPrecio } from "@/lib/formato";

export default function CartDrawer() {
  const { items, total, abierto, cerrar, quitar, cambiarCantidad, vaciar } =
    useCarrito();

  return (
    <>
      {abierto && <div className="cortina" onClick={cerrar} />}
      <aside className={`carrito ${abierto ? "carrito-abierto" : ""}`} aria-hidden={!abierto}>
        <div className="carrito-cabecera">
          <h2>Tu carrito</h2>
          <button
            className="boton-icono"
            onClick={cerrar}
            aria-label="Cerrar carrito"
          >
            ×
          </button>
        </div>

        {items.length === 0 ? (
          <p className="carrito-vacio">Todavía no agregaste productos.</p>
        ) : (
          <>
            <ul className="carrito-lista">
              {items.map((item) => (
                <li className="carrito-item" key={item.id}>
                  {item.esCombo && item.miembros && item.miembros.length > 0 ? (
                    <div className="carrito-minis">
                      {item.miembros.slice(0, 3).map((m, idx) =>
                        m.imagenUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            key={`${item.id}-${idx}`}
                            className="carrito-mini"
                            src={m.imagenUrl}
                            alt={m.nombre}
                            style={
                              idx > 0 ? { marginLeft: -14 } : undefined
                            }
                          />
                        ) : (
                          <div
                            key={`${item.id}-${idx}`}
                            className="carrito-mini"
                            style={{
                              background: "var(--fondo)",
                              marginLeft: idx > 0 ? -14 : undefined,
                            }}
                          />
                        )
                      )}
                    </div>
                  ) : item.imagenUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      className="carrito-imagen"
                      src={item.imagenUrl}
                      alt={item.nombre}
                    />
                  ) : (
                    <div
                      className="carrito-imagen"
                      style={{ background: "var(--fondo)" }}
                    />
                  )}
                  <div className="carrito-item-info">
                    <strong>{item.nombre}</strong>
                    {item.codigo && (
                      <span className="carrito-codigo">
                        Código: {item.codigo}
                      </span>
                    )}
                    {item.esCombo && item.miembros && item.miembros.length > 0 && (
                      <ul className="carrito-desglose">
                        {item.miembros.map((m, idx) => {
                          const tienePrecio = typeof m.precio === "number";
                          return (
                            <li key={idx}>
                              {m.cantidad}x {m.nombre}
                              {m.codigo ? ` (${m.codigo})` : ""}
                              {tienePrecio && (
                                <span className="carrito-desglose-precio">
                                  {formatearPrecio(m.cantidad * (m.precio ?? 0))}
                                </span>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    )}
                    {item.esCombo &&
                      item.miembros &&
                      item.miembros.some((m) => typeof m.precio === "number") && (
                        <span className="carrito-normal">
                          Antes:{" "}
                          {formatearPrecio(
                            item.miembros.reduce(
                              (acc, m) => acc + (m.cantidad * (m.precio ?? 0)),
                              0
                            ) * item.cantidad
                          )}
                        </span>
                      )}
                    <span className="carrito-item-precio">
                      {formatearPrecio(item.precio * item.cantidad)}
                    </span>
                    <div className="control-stock">
                      <button
                        className="boton-icono"
                        onClick={() =>
                          cambiarCantidad(item.id, item.cantidad - 1)
                        }
                        aria-label="Restar cantidad"
                      >
                        −
                      </button>
                      <span className="carrito-cantidad">{item.cantidad}</span>
                      <button
                        className="boton-icono"
                        onClick={() =>
                          cambiarCantidad(item.id, item.cantidad + 1)
                        }
                        aria-label="Sumar cantidad"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    className="boton-icono peligro"
                    onClick={() => quitar(item.id)}
                  >
                    Quitar
                  </button>
                </li>
              ))}
            </ul>

            <div className="carrito-pie">
              <div className="carrito-total">
                <span>Total</span>
                <strong>{formatearPrecio(total)}</strong>
              </div>
              {hayNumeroWhatsApp ? (
                <a
                  className="boton boton-primario"
                  target="_blank"
                  rel="noopener noreferrer"
                  href={urlWhatsApp(mensajePedido(items, total))}
                >
                  Encargar por WhatsApp
                </a>
              ) : (
                <div className="aviso aviso-error">
                  El número de WhatsApp aún no está configurado.
                </div>
              )}
              <button
                className="boton boton-secundario"
                style={{ width: "100%" }}
                onClick={vaciar}
              >
                Vaciar carrito
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}