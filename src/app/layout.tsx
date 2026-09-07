import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tienda Limpieza",
  description: "Catálogo de productos de limpieza",
};

const nombreTienda = process.env.NEXT_PUBLIC_NOMBRE_TIENDA || "Tienda Limpieza";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <header className="cabecera">
          <nav>
            <Link className="marca" href="/">
              {nombreTienda}
            </Link>
            <div className="enlaces">
              <Link href="/">Catálogo</Link>
              <Link href="/admin">Admin</Link>
            </div>
          </nav>
        </header>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}