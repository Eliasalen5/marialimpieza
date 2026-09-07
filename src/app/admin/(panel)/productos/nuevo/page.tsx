import type { Metadata } from "next";
import FormProducto from "@/components/FormProducto";

export const metadata: Metadata = {
  title: "Nuevo producto | Tienda Limpieza",
};

export default function NuevoProducto() {
  return (
    <div className="contenedor">
      <div style={{ maxWidth: 560 }}>
        <div className="pagina-titulo">
          <div>
            <h1>Nuevo producto</h1>
            <p className="subtitulo">
              Completa los datos para publicar el producto
            </p>
          </div>
        </div>
        <div className="tarjeta">
          <FormProducto />
        </div>
      </div>
    </div>
  );
}