"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, cargando } = useAuth();
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

  return <>{children}</>;
}