"use client";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";
// Este componente é o provedor de tema (ThemeProvider) que envolve os componentes filhos e fornece o contexto de tema para eles. Ele utiliza o componente ThemeProvider do pacote "next-themes" para gerenciar o tema do aplicativo, permitindo que os componentes filhos acessem as informações relacionadas ao tema e possam alterar o tema de forma consistente em todo o aplicativo. O ThemeProvider é responsável por fornecer a funcionalidade de gerenciamento de temas para os componentes filhos, garantindo que eles possam acessar e alterar o tema de forma segura e eficiente.
export default function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}