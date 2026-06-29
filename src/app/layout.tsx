import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./styles.css";
import { cn } from "@/lib/utils";
import AppProvider from "@/context/AppProvider";
import AuthProvider from "@/context/AuthProvider";
import ThemeProvider from "@/context/ThemeProvider";
import QueryProvider from "@/context/QueryProvider";

const inter = Inter({ subsets: ["latin"] });
// O arquivo layout.tsx define a estrutura de layout principal do aplicativo, incluindo a configuração de fontes, provedores de contexto e temas. Ele envolve o conteúdo da aplicação com provedores que gerenciam estado global, autenticação, tema e consultas de dados, garantindo que esses recursos estejam disponíveis em toda a aplicação.
export const metadata: Metadata = {
  title: "Investify - Sistema de Investimentos",
  description: "Gerencie seus investimentos de forma simples e eficiente com o Investify, seu sistema completo para controle financeiro e análise de portfólio.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={cn(
          "min-w-screen min-h-screen bg-background font-sans antialiased",
          inter.className,
        )}
      >
        <QueryProvider>
          <AppProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem={false}
            >
              <AuthProvider>{children}</AuthProvider>
            </ThemeProvider>
          </AppProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
