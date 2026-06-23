"use client";
import { cn } from "@/lib/utils";
import { ShieldCheck, TrendingUp, Zap } from "lucide-react";
import { useAsset } from "@/context/AssetProvider";
import { useWallet } from "@/context/WalletProvider";
import { buildPortfolioSummary } from "@/utils/portfolioMetrics";
// Importações do Shadcn UI Tooltip
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type InvestorProfile = {
  label: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  border: string;
  description: string;
};

type TInvestorProfileOptions = "conservador" | "moderado" | "arrojado";

const profiles: Record<TInvestorProfileOptions, InvestorProfile> = {
  conservador: {
    label: "Conservador",
    icon: ShieldCheck,
    color: "text-emerald-700 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-950",
    border: "border-emerald-300 dark:border-emerald-700",
    description:
      "Possui mais de 90% do patrimônio alocado em Renda Fixa. Foco total em segurança e preservação de capital.",
  },
  moderado: {
    label: "Moderado",
    icon: TrendingUp,
    color: "text-amber-700 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-950",
    border: "border-amber-300 dark:border-amber-700",
    description:
      "Possui entre 60% e 90% em Renda Fixa. Busca equilíbrio entre segurança e uma moderada busca por rentabilidade.",
  },
  arrojado: {
    label: "Arrojado",
    icon: Zap,
    color: "text-rose-700 dark:text-rose-400",
    bg: "bg-rose-50 dark:bg-rose-950",
    border: "border-rose-300 dark:border-rose-700",
    description:
      "Possui menos de 60% em Renda Fixa (maior exposição à Renda Variável). Foco em maximização de ganhos a longo prazo.",
  },
};

function getProfile(rendaFixa: number): TInvestorProfileOptions {
  if (rendaFixa > 90) return "conservador";
  if (rendaFixa >= 60) return "moderado";
  return "arrojado";
}

export default function InvestorProfileSlider() {
  const { assetList } = useAsset();
  const { walletList } = useWallet();

  const portfolioSummary = buildPortfolioSummary({
    walletList,
    assetList,
  });

  const totalUpdated = portfolioSummary.totalUpdated;
  const rendaFixa =
    totalUpdated > 0
      ? Math.round(
          (portfolioSummary.byTypeUpdated.fixedIncome / totalUpdated) * 100,
        )
      : 0;
  const rendaVariavel = 100 - rendaFixa;
  const profile = profiles[getProfile(rendaFixa)];
  const Icon = profile.icon;

  return (
    // Provedor do Tooltip envolvendo o componente
    <TooltipProvider delay={200}>
      <div className="flex flex-wrap items-center gap-4 px-4 py-2.5 rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm shadow-sm w-max max-w-full">
        {/* Label + badge */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-widest whitespace-nowrap">
            Perfil
          </span>

          <Tooltip>
            <TooltipTrigger>
              <div
                className={cn(
                  "flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap cursor-help transition-opacity hover:opacity-90",
                  profile.bg,
                  profile.border,
                  profile.color,
                )}
              >
                <Icon className="w-3 h-3" />
                {profile.label}
              </div>
            </TooltipTrigger>

            <TooltipContent className="max-w-xs p-3 text-xs bg-popover text-popover-foreground border border-border/60 shadow-xl rounded-xl">
              <p className="font-semibold mb-1 flex items-center gap-1">
                <Icon className={cn("w-3.5 h-3.5", profile.color)} />
                Parâmetros do Perfil {profile.label}
              </p>
              <p className="text-muted-foreground leading-relaxed">
                {profile.description}
              </p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="w-px h-5 bg-border/50 hidden md:block" />

        {/* Percentuais */}
        <div className="flex items-center gap-2 text-xs tabular-nums text-muted-foreground whitespace-nowrap">
          <span>
            <span className="font-bold text-foreground">{rendaFixa}%</span>{" "}
            Renda Fixa
          </span>
          <span className="text-border">·</span>
          <span>
            <span className="font-bold text-foreground">{rendaVariavel}%</span>{" "}
            Renda Variável
          </span>
        </div>

        <div className="w-px h-5 bg-border/50 hidden md:block" />

        {/* Barra */}
        <div className="flex flex-col gap-1 w-48 sm:w-64 md:w-72">
          <div className="relative h-2 w-full rounded-full overflow-hidden bg-muted/60">
            <div className="absolute inset-y-0 left-0 w-[10%] bg-emerald-500/70" />
            <div className="absolute inset-y-0 left-[10%] w-[30%] bg-amber-500/70" />
            <div className="absolute inset-y-0 left-[40%] w-[60%] bg-rose-500/70" />

            <div className="absolute inset-y-0 left-[10%] w-px bg-background/40" />
            <div className="absolute inset-y-0 left-[40%] w-px bg-background/40" />

            <div
              className="absolute inset-y-0 w-0.5 bg-foreground/90 z-10 shadow-[0_0_6px_rgba(255,255,255,0.3)]"
              style={{ left: `${rendaVariavel}%` }}
            />
          </div>

          <div className="flex text-[9px] font-semibold tracking-wide leading-none">
            <span className="w-[25%] text-left text-emerald-500">
              Conservador
            </span>
            <span className="w-[35%] text-center text-amber-500">Moderado</span>
            <span className="w-[40%] text-right text-rose-500">Arrojado</span>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
