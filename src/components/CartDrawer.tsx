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
                  {item.imagenUrl ? (
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