"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function entrar(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setCargando(true);
    try {
      if (!auth) throw new Error("auth-no-disponible");
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.push("/admin");
    } catch (err) {
      const codigo = (err as { code?: string }).code;
      if (codigo === "auth/invalid-credential") {
        setError("Email o contraseña incorrectos.");
      } else if (codigo === "auth/invalid-email") {
        setError("Ingresa un email válido.");
      } else if (codigo === "auth/too-many-requests") {
        setError("Demasiados intentos. Intenta más tarde.");
      } else {
        setError("Ocurrió un error al iniciar sesión.");
      }
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="contenedor login-wrap">
      <div className="tarjeta">
        <h1>Acceso de administrador</h1>
        <p className="subtitulo">Ingresa tus credenciales</p>

        {error && <div className="aviso aviso-error">{error}</div>}

        <form onSubmit={entrar}>
          <div className="campo">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="campo">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="boton boton-primario"
            style={{ width: "100%" }}
            disabled={cargando}
          >
            {cargando ? "Ingresando…" : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}