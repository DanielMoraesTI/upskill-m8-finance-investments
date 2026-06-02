"use client";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggleButton() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? (
        <>
          <Sun className="w-4 h-4" />
          Feitiço de Áquila
        </>
      ) : (
        <>
          <Moon className="w-4 h-4" />
          Criatura da Noite
        </>
      )}
    </Button>
  );
}