"use client";
import { useAuth } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    router.replace("/auth");
  } else {
    router.replace("/portal");
  }

  return (
    <main>
      <h1>Testes para NavBar depois de Autenticar</h1>
    </main>
  );
}
