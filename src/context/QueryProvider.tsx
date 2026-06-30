"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
// Este componente é o provedor de consultas (QueryProvider) que envolve os componentes filhos e fornece o contexto de consultas para eles. Ele utiliza o QueryClient do pacote "@tanstack/react-query" para gerenciar as consultas do aplicativo, permitindo que os componentes filhos acessem as informações relacionadas às consultas e possam realizar operações de consulta de forma consistente em todo o aplicativo.
export default function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
