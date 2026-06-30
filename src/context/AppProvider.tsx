"use client";
import { useState, createContext, useContext, useRef, useEffect } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
// Esta interface define a estrutura do contexto do aplicativo (AppContextProps), que inclui o estado de carregamento (isLoading), a funÃ§Ã£o para atualizar o estado de carregamento (setIsLoading), a mensagem de resultado (resultMessage), a funÃ§Ã£o para atualizar a mensagem de resultado (setResultMessage), o resultado da operaÃ§Ã£o (result) e a funÃ§Ã£o para atualizar o resultado da operaÃ§Ã£o (setResult).
type TResult = "success" | "error" | null;

interface AppContextProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  resultMessage: string;
  setResultMessage: (message: string) => void;
  result: TResult;
  setResult: (result: TResult) => void;
  notifyResult: (result: Exclude<TResult, null>, message: string) => void;
}

const AppContext = createContext<null | AppContextProps>(null);
// Este componente Ã© o provedor do contexto do aplicativo (AppProvider), que envolve os componentes filhos e fornece o contexto do aplicativo para eles. Ele utiliza o hook useState para gerenciar o estado de carregamento, mensagens de resultado e resultados de operaÃ§Ãµes, e o hook useEffect para implementar um reset automÃ¡tico do estado de resultado apÃ³s 5 segundos, limpando as mensagens de feedback.
export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [resultMessage, setResultMessage] = useState<string>("");
  const [result, setResult] = useState<TResult>(null);

  const notifyResult = (
    resultType: Exclude<TResult, null>,
    message: string,
  ) => {
    setResult(resultType);
    setResultMessage(message);
  };

  // Reset automÃ¡tico do estado de resultado apÃ³s 5 segundos para limpar mensagens de feedback
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
        notifyResult,
      }}
    >
      {children}

      {result && resultMessage && (
        <div className="fixed top-4 right-4 z-9999 max-w-[calc(100vw-2rem)] w-96 animate-in slide-in-from-top-2 fade-in duration-200">
          <div
            className={`flex items-start gap-3 rounded-lg border px-4 py-3 shadow-lg backdrop-blur-sm ${
              result === "success"
                ? "border-emerald-500/30 bg-emerald-950/80 text-emerald-300"
                : "border-rose-500/30 bg-rose-950/80 text-rose-300"
            }`}
            role="status"
            aria-live="polite"
          >
            {result === "success" ? (
              <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="h-5 w-5 shrink-0 mt-0.5" />
            )}
            <div className="text-sm font-medium leading-snug">
              {resultMessage}
            </div>
          </div>
        </div>
      )}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const appContext = useContext(AppContext);
  if (!appContext) {
    throw new Error("useApp deve estar dentro de um AppProvider");
  }

  return appContext;
};
