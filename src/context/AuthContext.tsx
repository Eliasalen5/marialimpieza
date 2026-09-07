"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";

interface AuthContextValue {
  user: User | null;
  cargando: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  cargando: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!auth) return;
    const desuscribir = onAuthStateChanged(auth, (usuario) => {
      setUser(usuario);
      setCargando(false);
    });
    return desuscribir;
  }, []);

  return (
    <AuthContext.Provider value={{ user, cargando }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}