import type { Timestamp } from "firebase/firestore";

export interface Producto {
  id: string;
  codigo?: string;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagenUrl: string;
  activo: boolean;
  creadoEn: Timestamp;
}

export interface ProductoDatos {
  codigo?: string;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagenUrl: string;
  activo: boolean;
  creadoEn: Timestamp;
}

export interface ItemCarrito {
  id: string;
  codigo?: string;
  nombre: string;
  precio: number;
  imagenUrl: string;
  cantidad: number;
  stock: number;
}