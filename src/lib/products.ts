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
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import type { Producto, ProductoDatos } from "@/lib/types";

const COLECCION = "productos";

const baseDeDatos = () => {
  if (!db) throw new Error("Firestore no está disponible.");
  return db;
};

const almacen = () => {
  if (!storage) throw new Error("Storage no está disponible.");
  return storage;
};

export function suscribirProductos(
  soloActivos: boolean,
  callback: (productos: Producto[]) => void
): () => void {
  const ref = soloActivos
    ? query(collection(baseDeDatos(), COLECCION), where("activo", "==", true))
    : collection(baseDeDatos(), COLECCION);

  return onSnapshot(
    ref,
    (snap) => {
      const lista = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Producto, "id">),
      }));
      lista.sort((a, b) => {
        const ta = a.creadoEn?.toMillis?.() ?? 0;
        const tb = b.creadoEn?.toMillis?.() ?? 0;
        return tb - ta;
      });
      callback(lista);
    },
    (error) => console.error("Error leyendo productos:", error)
  );
}

export async function crearProducto(datos: ProductoDatos): Promise<string> {
  const ref = await addDoc(collection(baseDeDatos(), COLECCION), datos);
  return ref.id;
}

export async function actualizarProducto(
  id: string,
  datos: Partial<ProductoDatos>
): Promise<void> {
  await updateDoc(doc(baseDeDatos(), COLECCION, id), datos);
}

export async function eliminarProducto(id: string, imagenUrl?: string): Promise<void> {
  await deleteDoc(doc(baseDeDatos(), COLECCION, id));
  if (imagenUrl) {
    try {
      const ruta = decodeURIComponent(imagenUrl.split("/o/")[1]?.split("?")[0] ?? "");
      if (ruta) await deleteObject(storageRef(almacen(), ruta));
    } catch {
      // La imagen pudo no existir; se ignora.
    }
  }
}

export async function subirImagen(file: File): Promise<string> {
  const ruta = `productos/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
  const ref = storageRef(almacen(), ruta);
  await uploadBytes(ref, file);
  return getDownloadURL(ref);
}

export function nuevoProductoDatos(
  datos: Omit<ProductoDatos, "creadoEn">
): ProductoDatos {
  return { ...datos, creadoEn: Timestamp.now() };
}

export async function leerProducto(id: string): Promise<Producto | null> {
  const ref = doc(baseDeDatos(), COLECCION, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as Omit<Producto, "id">) };
}