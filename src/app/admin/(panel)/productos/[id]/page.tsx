import type { Metadata } from "next";
import EditarProducto from "./EditarProducto";

export const metadata: Metadata = {
  title: "Editar producto | Tienda Limpieza",
};

export default async function PaginaEditar({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditarProducto id={id} />;
}