"use client";
import React, { useState, createContext, useContext } from "react";

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

  return (
    <AuthContext.Provider value={{ isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const authContext = useContext(AuthContext);
  if(!authContext) {
    throw new Error("useAuth should be inside a AuthProvider");
  }

  return authContext;
};
