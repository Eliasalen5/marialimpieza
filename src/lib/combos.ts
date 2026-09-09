import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Combo, ComboDatos, ItemCombo } from "@/lib/types";

const COLECCION = "combos";

const baseDeDatos = () => {
  if (!db) throw new Error("Firestore no está disponible.");
  return db;
};

export function suscribirCombos(
  soloActivos: boolean,
  callback: (combos: Combo[]) => void
): () => void {
  const ref = soloActivos
    ? query(collection(baseDeDatos(), COLECCION), where("activo", "==", true))
    : collection(baseDeDatos(), COLECCION);

  return onSnapshot(
    ref,
    (snap) => {
      const lista = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Combo, "id">),
      }));
      lista.sort((a, b) => {
        const ta = a.creadoEn?.toMillis?.() ?? 0;
        const tb = b.creadoEn?.toMillis?.() ?? 0;
        return tb - ta;
      });
      callback(lista);
    },
    (error) => console.error("Error leyendo combos:", error)
  );
}

export async function crearCombo(datos: ComboDatos): Promise<string> {
  const ref = await addDoc(collection(baseDeDatos(), COLECCION), datos);
  return ref.id;
}

export async function actualizarCombo(
  id: string,
  datos: Partial<ComboDatos>
): Promise<void> {
  await updateDoc(doc(baseDeDatos(), COLECCION, id), datos);
}

export async function eliminarCombo(id: string): Promise<void> {
  await deleteDoc(doc(baseDeDatos(), COLECCION, id));
}

export async function leerCombo(id: string): Promise<Combo | null> {
  const ref = doc(baseDeDatos(), COLECCION, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as Omit<Combo, "id">) };
}

export function nuevoComboDatos(
  datos: Omit<ComboDatos, "creadoEn">
): ComboDatos {
  return { ...datos, creadoEn: Timestamp.now() };
}

export function esComboDatosValido(
  nombre: string,
  precio: number,
  items: ItemCombo[]
): string | null {
  if (!nombre.trim()) return "El nombre del combo es obligatorio.";
  if (Number.isNaN(precio) || precio < 0)
    return "El precio del combo no es válido.";
  const limpios = items.filter(
    (i) => i.productoId && Number.isFinite(i.cantidad) && i.cantidad > 0
  );
  if (limpios.length < 2) return "Elegí al menos 2 productos para el combo.";
  return null;
}