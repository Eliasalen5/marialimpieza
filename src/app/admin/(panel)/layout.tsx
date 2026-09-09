"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, cargando, cerrarSesion } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!cargando && !user) {
      router.replace("/admin/login");
    }
  }, [cargando, user, router]);

  if (cargando) {
    return <div className="cargando">Cargando…</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <header className="admin-header">
        <span className="admin-marca">Panel de administración</span>
        <button
          type="button"
          className="boton-icono"
          onClick={async () => {
            await cerrarSesion();
            router.replace("/admin/login");
          }}
        >
          Salir
        </button>
      </header>
      {children}
    </>
  );
}