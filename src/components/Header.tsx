"use client";

import Link from "next/link";
import { useCarrito } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";

export default function Header({ marca }: { marca: string }) {
  const { unidades, abrir } = useCarrito();

  return (
    <>
      <header className="cabecera">
        <nav>
          <Link className="marca" href="/">
            {marca}
          </Link>
          <div className="enlaces">
            <button className="boton-carrito" onClick={abrir}>
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              Carrito
              {unidades > 0 && <span className="badge-carrito">{unidades}</span>}
            </button>
          </div>
        </nav>
      </header>
      <CartDrawer />
    </>
  );
}