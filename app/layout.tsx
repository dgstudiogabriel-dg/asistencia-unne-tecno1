import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Asistencia QR - Tecno 1",
  description: "Sistema de control de asistencia para TEC GRÁFICA 1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <div className="min-h-screen py-10 px-4">
          {children}
        </div>
      </body>
    </html>
  );
}
