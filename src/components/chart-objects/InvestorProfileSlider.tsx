"use client";
import { cn } from "@/lib/utils";
import { ShieldCheck, TrendingUp, Zap } from "lucide-react";

type InvestorProfile = {
  label: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  border: string;
};

type TInvestorProfileOptions = "conservador" | "moderado" | "arrojado";

const profiles: Record<TInvestorProfileOptions, InvestorProfile> = {
  conservador: {
    label: "Conservador",
    icon: ShieldCheck,
    color: "text-emerald-700 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-950",
    border: "border-emerald-300 dark:border-emerald-700",
  },
  moderado: {
    label: "Moderado",
    icon: TrendingUp,
    color: "text-amber-700 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-950",
    border: "border-amber-300 dark:border-amber-700",
  },
  arrojado: {
    label: "Arrojado",
    icon: Zap,
    color: "text-rose-700 dark:text-rose-400",
    bg: "bg-rose-50 dark:bg-rose-950",
    border: "border-rose-300 dark:border-rose-700",
  },
};

function getProfile(rendaFixa: number): TInvestorProfileOptions {
  if (rendaFixa > 90) return "conservador";
  if (rendaFixa >= 60) return "moderado";
  return "arrojado";
}

const rendaFixaInicial = 85;

export default function InvestorProfileSlider() {
  const rendaFixa = rendaFixaInicial;
  const rendaVariavel = 100 - rendaFixa;
  const profile = profiles[getProfile(rendaFixa)];
  const Icon = profile.icon;

  return (
    <div className="flex items-center gap-4 px-4 py-2 rounded-xl border border-sidebar-border bg-card shadow-sm w-max">

      {/* Label + badge numa linha só */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-foreground whitespace-nowrap">
          Perfil de Investidor
        </span>

        <div className={cn(
          "flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap shadow-sm",
          profile.bg, profile.border, profile.color
        )}>
          <Icon className="w-3 h-3" />
          {profile.label}
        </div>
      </div>

      <span className="text-muted-foreground/30 text-xs hidden md:inline">|</span>

      {/* Percentuais */}
      <div className="flex items-center gap-2 text-xs tabular-nums text-muted-foreground whitespace-nowrap">
        <span><span className="font-semibold text-foreground">{rendaFixa}%</span> Renda Fixa</span>
        <span className="text-muted-foreground/40">·</span>
        <span><span className="font-semibold text-foreground">{rendaVariavel}%</span> Renda Variável</span>
      </div>

      <span className="text-muted-foreground/30 text-xs hidden md:inline">|</span>

      {/* Barra Esticada e Elegante */}
      <div className="flex flex-col gap-1 w-64 md:w-72"> {/* Aumentado para w-64 no mobile e w-72 no desktop */}
        <div className="relative h-2 w-full rounded-full overflow-hidden bg-muted">
          {/* Fatias proporcionais à regra de negócio (baseado na Renda Variável) */}
          <div className="absolute inset-y-0 left-0 w-[10%] bg-emerald-500/80" />
          <div className="absolute inset-y-0 left-[10%] w-[30%] bg-amber-500/80" />
          <div className="absolute inset-y-0 left-[40%] w-[60%] bg-rose-500/80" />
          
          {/* Divisores internos sutis */}
          <div className="absolute inset-y-0 left-[10%] w-px bg-background/50" />
          <div className="absolute inset-y-0 left-[40%] w-px bg-background/50" />
          
          {/* Indicador Atual */}
          <div
            className="absolute inset-y-0 w-0.5 bg-foreground z-10 shadow-[0_0_4px_rgba(0,0,0,0.3)]"
            style={{ left: `${rendaVariavel}%` }}
          />
        </div>
        
        {/* Textos inferiores com alinhamentos corrigidos */}
        <div className="flex text-[9px] font-medium tracking-wide leading-none text-muted-foreground">
          <span className="w-[25%] text-left text-emerald-600 dark:text-emerald-400">Conservador</span>
          <span className="w-[35%] text-center text-amber-600 dark:text-amber-500">Moderado</span>
          <span className="w-[40%] text-right text-rose-600 dark:text-rose-400">Arrojado</span>
        </div>
      </div>

    </div>
  );
}
