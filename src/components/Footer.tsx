"use client"; // Adicionado para permitir o uso do hook usePathname

import { GitFork } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Importa o hook

export default function Footer() {
  const pathname = usePathname();

  // Condição para verificar se o usuário está exatamente na rota "/portal"
  const isPortal = pathname === "/portal";

  // Se estiver na rota "/portal", renderiza o Footer com os créditos dos desenvolvedores
  if (isPortal) {
    return (
<footer className="w-full border-t border-sidebar-border bg-sidebar/50 backdrop-blur-sm px-6 py-3 md:py-0 md:h-12 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-0">
  
  {/* Lado Esquerdo: Direitos Autorais / Institucional */}
  <div className="text-[11px] font-medium text-muted-foreground/70 tracking-wide text-center md:text-left">
    © 2026 Finance Investments <span className="text-muted-foreground/30 mx-1.5">•</span> UpSkill <span className="text-muted-foreground/30 mx-1.5">•</span> Faculdade de Ciências da Universidade de Lisboa
  </div>

  {/* Lado Direito: "Desenvolvido por" + Botões */}
  <div className="flex items-center gap-3">
    <span className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground/50">
      Desenvolvido por
    </span>

    <div className="flex items-center gap-2">
      <Link
        href="https://github.com/DanielMoraesTI"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground hover:text-sidebar-foreground transition-all duration-200 group border border-sidebar-border/40 bg-sidebar-background/40 hover:bg-sidebar-accent px-2.5 py-1 rounded-md shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
      >
        <GitFork className="w-3.5 h-3.5 text-muted-foreground/60 group-hover:text-sidebar-foreground transition-transform duration-200 group-hover:scale-105" />
        <span>Daniel Moraes</span>
      </Link>

      <Link
        href="https://github.com/devgabrielpanta"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground hover:text-sidebar-foreground transition-all duration-200 group border border-sidebar-border/40 bg-sidebar-background/40 hover:bg-sidebar-accent px-2.5 py-1 rounded-md shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
      >
        <GitFork className="w-3.5 h-3.5 text-muted-foreground/60 group-hover:text-sidebar-foreground transition-transform duration-200 group-hover:scale-105" />
        <span>Gabriel Panta</span>
      </Link>
    </div>
  </div>

</footer>
    );
  }

  // Nas demais páginas, renderiza o Footer com o resumo dos investimentos
  return (
    <footer className="w-full border-t border-zinc-200 bg-white px-6 py-2">
      <div className="mx-auto grid max-w-7xl grid-cols-4 divide-x divide-zinc-200">
        <div className="flex items-center justify-center gap-2 px-4">
          <span className="text-xs font-medium uppercase tracking-widest text-zinc-400">
            Total Investido
          </span>
          <span className="text-sm font-semibold tabular-nums text-zinc-900">
            R$ 0,00
          </span>
        </div>

        <div className="flex items-center justify-center gap-2 px-4">
          <span className="text-xs font-medium uppercase tracking-widest text-zinc-400">
            Ações
          </span>
          <span className="text-sm font-semibold tabular-nums text-zinc-900">
            R$ 0,00
          </span>
        </div>

        <div className="flex items-center justify-center gap-2 px-4">
          <span className="text-xs font-medium uppercase tracking-widest text-zinc-400">
            Fundos Imobiliários
          </span>
          <span className="text-sm font-semibold tabular-nums text-zinc-900">
            R$ 0,00
          </span>
        </div>

        <div className="flex items-center justify-center gap-2 px-4">
          <span className="text-xs font-medium uppercase tracking-widest text-zinc-400">
            Renda Fixa
          </span>
          <span className="text-sm font-semibold tabular-nums text-zinc-900">
            R$ 0,00
          </span>
        </div>
      </div>
    </footer>
  );
}