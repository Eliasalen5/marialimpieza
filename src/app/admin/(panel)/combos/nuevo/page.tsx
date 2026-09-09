import type { Metadata } from "next";
import FormCombo from "@/components/FormCombo";

export const metadata: Metadata = {
  title: "Nuevo combo | Tienda Limpieza",
};

export default function NuevoCombo() {
  return (
    <div className="contenedor">
      <div style={{ maxWidth: 560 }}>
        <div className="pagina-titulo">
          <div>
            <h1>Nuevo combo</h1>
            <p className="subtitulo">
              Elegí al menos 2 productos y fijá el precio de oferta
            </p>
          </div>
        </div>
        <div className="tarjeta">
          <FormCombo />
        </div>
      </div>
    </div>
  );
}