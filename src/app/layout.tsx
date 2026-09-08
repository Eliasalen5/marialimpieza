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

const nombreTienda = process.env.NEXT_PUBLIC_NOMBRE_TIENDA || "Tienda Limpieza";

const urlSitio =
  process.env.NEXT_PUBLIC_SITIO_URL || "https://marialimpieza.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(urlSitio),
  title: nombreTienda,
  description: "Catálogo de productos de limpieza",
  openGraph: {
    title: nombreTienda,
    description: "Catálogo de productos de limpieza",
    url: urlSitio,
    siteName: nombreTienda,
    locale: "es_AR",
    type: "website",
    images: [
      {
        url: "/img/og.jpg",
        width: 1200,
        height: 630,
        alt: nombreTienda,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: nombreTienda,
    description: "Catálogo de productos de limpieza",
    images: ["/img/og.jpg"],
  },
};

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
            </div>
          </nav>
        </header>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}