"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
// Este componente é o provedor de consultas (QueryProvider) que envolve os componentes filhos e fornece o contexto de consultas para eles. Ele utiliza o QueryClient do pacote "@tanstack/react-query" para gerenciar as consultas do aplicativo, permitindo que os componentes filhos acessem as informações relacionadas às consultas e possam realizar operações de consulta de forma consistente em todo o aplicativo. O QueryProvider é responsável por fornecer a funcionalidade de gerenciamento de consultas para os componentes filhos, garantindo que eles possam acessar e realizar consultas de forma segura e eficiente. Ele utiliza o hook useState para criar uma instância do QueryClient, que é passada como prop para o QueryClientProvider, permitindo que os componentes filhos acessem o contexto de consultas e possam realizar operações de consulta de forma consistente em todo o aplicativo. O QueryProvider é essencial para garantir que as consultas sejam gerenciadas de forma eficiente e que os componentes filhos possam acessar os dados de consulta de maneira segura e consistente em todo o aplicativo.
export default function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
