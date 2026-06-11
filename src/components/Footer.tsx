import { GitFork } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <>
      {/*<footer className="grid grid-cols-1 md:grid-cols-2 w-full h-fit py-1 md:h-12 border-t bg-sidebar">
      <div className="flex flex-row justify-center items-center w-full gap-2 md:gap-4 md:border-r">
        <p className="text-xs text-muted-foreground tracking-wide uppercase">
          Desenvolvido por
        </p>

        <Link
          href="https://github.com/DanielMoraesTI"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group border p-1"
        >
          <GitFork className="w-4 h-4 transition-transform group-hover:scale-110" />
          Daniel Moraes
        </Link>

        <Link
          href="https://github.com/devgabrielpanta"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group border p-1"
        >
          <GitFork className="w-4 h-4 transition-transform group-hover:scale-110" />
          Gabriel Panta
        </Link>
      </div>

      <div className="text-xs text-muted-foreground text-center flex items-center justify-center">
        © 2026 Finance Investments - UpSkill - Faculdade de Ciências da
        Universidade de Lisboa
      </div>
    </footer>*/}
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
    </>
  );
}
