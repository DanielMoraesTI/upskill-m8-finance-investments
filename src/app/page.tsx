"use client";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";
import { useApp } from "@/context/AppProvider";

export default function Home() {
  const router = useRouter();
  const { isLoading } = useApp();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace("/auth");
    } else {
      router.replace("/portal");
    }
  }, [isAuthenticated, isLoading, router]);

  return <Loading />;
}
