"use client";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
// Este componente é o botão de alternância de tema (ThemeToggleButton), que permite aos usuários alternar entre os modos claro e escuro do aplicativo. Ele utiliza o hook useTheme do pacote "next-themes" para acessar o tema atual e a função para alterar o tema, e o hook useState para gerenciar o estado de montagem do componente. O useEffect é utilizado para definir o estado de montagem como verdadeiro quando o componente é montado, garantindo que o botão seja renderizado corretamente. O ThemeToggleButton exibe um ícone de lua e a opção "Modo Escuro" quando o tema atual é claro, e um ícone de sol e a opção "Modo Claro" quando o tema atual é escuro. Ele é responsável por fornecer uma interface de usuário intuitiva para os usuários alternarem entre os modos claro e escuro do aplicativo, garantindo que eles possam personalizar a aparência do aplicativo de acordo com suas preferências de forma segura e eficiente. O ThemeToggleButton é essencial para melhorar a experiência do usuário, permitindo que eles escolham o tema que melhor se adequa às suas necessidades e preferências visuais.
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
