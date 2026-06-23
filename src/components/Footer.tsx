"use client"; // Adicionado para permitir o uso do hook usePathname

import { GitFork } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Importa o hook
import { useAsset } from "@/context/AssetProvider";
import { useWallet } from "@/context/WalletProvider";
import { buildPortfolioSummary } from "@/utils/portfolioMetrics";
import { formatCurrency } from "@/utils/dataTypeUtils";
// Este componente é o rodapé (Footer) do aplicativo, que exibe informações relevantes para os usuários, como o total investido, a distribuição dos investimentos por tipo de ativo e os créditos dos desenvolvedores. Ele utiliza o hook usePathname para determinar a rota atual e renderizar o conteúdo apropriado com base nessa rota. Se o usuário estiver na rota "/portal", o Footer exibe os créditos dos desenvolvedores, incluindo links para seus perfis no GitHub. Em outras rotas, o Footer exibe um resumo dos investimentos do usuário, incluindo o total investido e a distribuição por tipo de ativo (ações, fundos imobiliários e renda fixa). O Footer é essencial para fornecer informações importantes aos usuários e reconhecer os desenvolvedores que contribuíram para a criação do aplicativo, melhorando a experiência do usuário e promovendo a transparência sobre os criadores do aplicativo.
export default function Footer() {
  const pathname = usePathname();
  const { assetList } = useAsset();
  const { walletList } = useWallet();

  const summary = buildPortfolioSummary({
    walletList,
    assetList,
  });

  // Condição para verificar se o usuário está exatamente na rota "/portal"
  const isPortal = pathname === "/portal";

  // Se estiver na rota "/portal", renderiza o Footer com os créditos dos desenvolvedores
  if (isPortal) {
    return (
      <footer className="w-full border-t border-sidebar-border/50 bg-sidebar/80 backdrop-blur-sm px-6 py-3 md:py-0 md:h-11 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-0">
        {/* Lado Esquerdo: Direitos Autorais / Institucional */}
        <div className="text-[10px] font-medium text-muted-foreground/50 tracking-wide text-center md:text-left">
          © 2026 Finance Investments{" "}
          <span className="text-muted-foreground/25 mx-1">•</span> UpSkill{" "}
          <span className="text-muted-foreground/25 mx-1">•</span> Faculdade de
          Ciências da Universidade de Lisboa
        </div>

        {/* Lado Direito: "Desenvolvido por" + Botões */}
        <div className="flex items-center gap-2.5">
          <span className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground/35">
            Dev por
          </span>

          <div className="flex items-center gap-1.5">
            <Link
              href="https://github.com/DanielMoraesTI"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground/60 hover:text-primary transition-all duration-200 group border border-sidebar-border/30 hover:border-primary/30 bg-sidebar-accent/20 hover:bg-primary/8 px-2 py-0.5 rounded-md"
            >
              <GitFork className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-all" />
              <span>Daniel Moraes</span>
            </Link>

            <Link
              href="https://github.com/devgabrielpanta"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground/60 hover:text-primary transition-all duration-200 group border border-sidebar-border/30 hover:border-primary/30 bg-sidebar-accent/20 hover:bg-primary/8 px-2 py-0.5 rounded-md"
            >
              <GitFork className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-all" />
              <span>Gabriel Panta</span>
            </Link>
          </div>
        </div>
      </footer>
    );
  }

  // Nas demais páginas, renderiza o Footer com o resumo dos investimentos
  return (
    <footer className="w-full border-t border-border/50 bg-card/60 backdrop-blur-sm px-6 py-2">
      <div className="mx-auto grid max-w-7xl grid-cols-2 md:grid-cols-4 divide-x divide-border/40">
        <div className="flex items-center justify-center gap-2 px-4 py-1">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
            Total Investido
          </span>
          <span className="text-xs font-bold tabular-nums text-foreground/80">
            {formatCurrency(summary.totalUpdated)}
          </span>
        </div>

        <div className="flex items-center justify-center gap-2 px-4 py-1">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
            Ações
          </span>
          <span className="text-xs font-bold tabular-nums text-foreground/80">
            {formatCurrency(summary.byTypeUpdated.stock)}
          </span>
        </div>

        <div className="flex items-center justify-center gap-2 px-4 py-1">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
            Fundos Imobiliários
          </span>
          <span className="text-xs font-bold tabular-nums text-foreground/80">
            {formatCurrency(summary.byTypeUpdated.fii)}
          </span>
        </div>

        <div className="flex items-center justify-center gap-2 px-4 py-1">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
            Renda Fixa
          </span>
          <span className="text-xs font-bold tabular-nums text-foreground/80">
            {formatCurrency(summary.byTypeUpdated.fixedIncome)}
          </span>
        </div>
      </div>
    </footer>
  );
}
