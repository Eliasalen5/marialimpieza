import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Categoria, CategoriaDatos } from "@/lib/types";

const COLECCION = "categorias";

const baseDeDatos = () => {
  if (!db) throw new Error("Firestore no está disponible.");
  return db;
};

export function suscribirCategorias(
  callback: (categorias: Categoria[]) => void
): () => void {
  const ref = collection(baseDeDatos(), COLECCION);

  return onSnapshot(
    ref,
    (snap) => {
      const lista = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Categoria, "id">),
      }));
      lista.sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
      callback(lista);
    },
    (error) => console.error("Error leyendo categorías:", error)
  );
}

export async function crearCategoria(nombre: string): Promise<void> {
  const datos: CategoriaDatos = { nombre: nombre.trim(), creadoEn: Timestamp.now() };
  await addDoc(collection(baseDeDatos(), COLECCION), datos);
}

export async function renombrarCategoria(id: string, nombre: string): Promise<void> {
  await updateDoc(doc(baseDeDatos(), COLECCION, id), { nombre: nombre.trim() });
}

export async function eliminarCategoria(id: string): Promise<void> {
  await deleteDoc(doc(baseDeDatos(), COLECCION, id));
}