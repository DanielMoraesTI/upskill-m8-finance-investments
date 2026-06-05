"use client";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ThemeToggleButton() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const handleMount = () => setMounted(true);
    handleMount();
  }, []);

  if (!mounted) {
    return (
      <Button variant="outline" size="sm" disabled>
        <Moon className="w-4 h-4" />
        Tema
      </Button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? (
        <>
          <Sun className="w-4 h-4" />
          Modo Claro
        </>
      ) : (
        <>
          <Moon className="w-4 h-4" />
          Modo Escuro
        </>
      )}
    </Button>
  );
}
