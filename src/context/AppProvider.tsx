"use client";
import { useState, createContext, useContext, useRef, useEffect } from "react";
// Esta interface define a estrutura do contexto do aplicativo (AppContextProps), que inclui o estado de carregamento (isLoading), a função para atualizar o estado de carregamento (setIsLoading), a mensagem de resultado (resultMessage), a função para atualizar a mensagem de resultado (setResultMessage), o resultado da operação (result) e a função para atualizar o resultado da operação (setResult). Ela é utilizada para garantir a consistência dos dados relacionados ao estado geral do aplicativo em todo o código, permitindo que os componentes que consomem esse contexto tenham acesso às informações necessárias sobre o estado de carregamento, mensagens de resultado e resultados de operações, e possam tomar decisões com base nessas informações de forma segura e eficiente.
type TResult = "success" | "error" | null;

interface AppContextProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  resultMessage: string;
  setResultMessage: (message: string) => void;
  result: TResult;
  setResult: (result: TResult) => void;
}

const AppContext = createContext<null | AppContextProps>(null);
// Este componente é o provedor do contexto do aplicativo (AppProvider), que envolve os componentes filhos e fornece o contexto do aplicativo para eles. Ele utiliza o hook useState para gerenciar o estado de carregamento, mensagens de resultado e resultados de operações, e o hook useEffect para implementar um reset automático do estado de resultado após 5 segundos, limpando as mensagens de feedback. O AppProvider é responsável por fornecer as informações relacionadas ao estado geral do aplicativo para os componentes filhos, permitindo que eles acessem essas informações e possam tomar decisões com base nelas de forma segura e eficiente. Ele também garante que as mensagens de feedback sejam limpas automaticamente após um período de tempo, melhorando a experiência do usuário e mantendo a interface limpa. O AppProvider é essencial para garantir que as informações relacionadas ao estado geral do aplicativo sejam gerenciadas de forma eficiente e que os componentes filhos possam acessar essas informações de maneira segura e consistente em todo o aplicativo.
export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [resultMessage, setResultMessage] = useState<string>("");
  const [result, setResult] = useState<TResult>(null);

  // Reset automático do estado de resultado após 5 segundos para limpar mensagens de feedback
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (result) {
      timeoutRef.current = setTimeout(() => {
        setResult(null);
        setResultMessage("");
      }, 5000);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [result, resultMessage]);

  return (
    <AppContext.Provider
      value={{
        isLoading,
        setIsLoading,
        resultMessage,
        setResultMessage,
        result,
        setResult,
      }}
    >
      {children}

    </AppContext.Provider>
  );
}

export const useApp = () => {
  const appContext = useContext(AppContext);
  if (!appContext) {
    throw new Error("useApp should be inside a AppProvider");
  }

  return appContext;
};
