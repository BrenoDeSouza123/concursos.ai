import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { NextAuthProvider } from "@/components/NextAuthProvider";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Concursos.ai - O Seu Parceiro de Aprovação",
  description: "A IA que monta simulados inéditos e turbina sua aprovação.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${montserrat.variable} font-sans h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <NextAuthProvider>
          {children}
        </NextAuthProvider>
      </body>
    </html>
  );
}
