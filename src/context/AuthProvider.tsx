"use client";
import React, { useState, useEffect, createContext, useContext } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useApp } from "./AppProvider";
import { usePathname, useRouter } from "next/navigation";

interface AuthContextProps {
  isAuthenticated: boolean;
}

const AuthContext = createContext<null | AuthContextProps>(null);

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const { isLoading, setIsLoading } = useApp();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    });

    return unsubscribe;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
  }, [pathname, isAuthenticated, isLoading]); // eslint-disable-line react-hooks/exhaustive-deps


  return (
    <AuthContext.Provider value={{ isAuthenticated }}>
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
