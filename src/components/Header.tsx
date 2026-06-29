"use client";
import Image from "next/image";
import { SidebarTrigger, useSidebar } from "./ui/sidebar";
import { useAuth } from "@/context/AuthProvider";
// Este componente é o cabeçalho (Header) do aplicativo, que é exibido na parte superior da interface do usuário. Ele inclui um logotipo, um gatilho para abrir a barra lateral de navegação e uma seção de perfil do usuário. O Header é projetado para ser responsivo e se adaptar a diferentes tamanhos de tela, garantindo que os elementos sejam exibidos de forma adequada em dispositivos móveis e desktops. Ele utiliza o hook useSidebar para controlar a abertura e fechamento da barra lateral, proporcionando uma experiência de navegação fluida para os usuários.
export default function Header() {
  const { open } = useSidebar();
  const { userName } = useAuth();
  const displayName = userName || "Usuário";
  const userInitial = displayName.charAt(0).toUpperCase();

  return (
    <header className="bg-sidebar/95 backdrop-blur-sm flex flex-row items-center justify-between w-full border-b border-sidebar-border/60 px-4 py-2.5 shadow-sm">
      <SidebarTrigger className="text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 rounded-lg transition-all" />

      <div className="flex items-center gap-2">
        <div
          className={`ml-auto transition-all duration-200 ${open ? "opacity-0 pointer-events-none" : "opacity-100"}`}
        >
          <Image
            src="/logo-black.png"
            alt="Finance Investments"
            width={441}
            height={140}
            className="w-28 h-auto dark:hidden"
            sizes="112px"
          />
          <Image
            src="/logo-white.png"
            alt="Finance Investments"
            width={441}
            height={140}
            className="hidden w-28 h-auto dark:block"
            sizes="112px"
          />
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-sidebar-accent/40 border border-sidebar-border/40">
          <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
            <span className="text-[10px] font-bold text-primary">
              {userInitial}
            </span>
          </div>
          <span className="text-xs font-medium text-sidebar-foreground/80 hidden sm:block">
            {displayName}
          </span>
        </div>
      </div>
    </header>
  );
}
