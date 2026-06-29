"use client";
import React, { useState, useEffect, createContext, useContext } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useApp } from "./AppProvider";
import { usePathname, useRouter } from "next/navigation";

// Esta interface define a estrutura do contexto de autenticação (AuthContextProps), que inclui uma propriedade booleana isAuthenticated para indicar se o usuário está autenticado ou não.
interface AuthContextProps {
  isAuthenticated: boolean;
  userName: string;
  logout: () => Promise<void>;
}

const AuthContext = createContext<null | AuthContextProps>(null);
// Este componente é o provedor de autenticação (AuthProvider), que envolve os componentes filhos e fornece o contexto de autenticação para eles. Ele utiliza o hook useState para gerenciar o estado de autenticação do usuário, o hook useEffect para monitorar as mudanças no estado de autenticação usando a função onAuthStateChanged do Firebase, e os hooks usePathname e useRouter para redirecionar os usuários não autenticados para a página de autenticação.
export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>("");
  const { isLoading, setIsLoading } = useApp();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setIsAuthenticated(true);
        const fallbackName = firebaseUser.email?.split("@")[0] || "Usuário";
        setUserName(firebaseUser.displayName || fallbackName);
      } else {
        setIsAuthenticated(false);
        setUserName("");
      }
      setIsLoading(false);
    });

    return unsubscribe;
  }, []); 

  // GuardRail: Verifica autenticação no portal
  const redirectUnauthenticatedUsers = () => {
    setIsLoading(true);
    router.push("/auth");
  };

  useEffect(() => {
    if (!pathname.includes("portal")) return; // Não verifica se não estiver em uma rota protegida
    if (isLoading) return; // Não verifica se já estiver carregando

    if (!isAuthenticated) {
      redirectUnauthenticatedUsers();
    }
  }, [pathname, isAuthenticated, isLoading]);

  async function logout() {
    try {
      setIsLoading(true);
      await signOut(auth);
      router.push("/auth");
    } catch (error) {
      console.error("Erro ao deslogar:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, userName, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("useAuth should be inside a AuthProvider");
  }

  return authContext;
};
