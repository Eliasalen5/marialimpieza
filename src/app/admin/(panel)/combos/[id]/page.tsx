import type { Metadata } from "next";
import EditarCombo from "./EditarCombo";

export const metadata: Metadata = {
  title: "Editar combo | Tienda Limpieza",
};

export default async function PaginaEditarCombo({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditarCombo id={id} />;
}