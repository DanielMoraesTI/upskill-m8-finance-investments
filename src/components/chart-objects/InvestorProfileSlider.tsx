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
    <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg border bg-card shadow-sm w-max">

      {/* Label + badge numa linha só */}
      <span className="text-xs font-semibold text-foreground whitespace-nowrap">
        Perfil de Investidor
      </span>

      <div className={cn(
        "flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        profile.bg, profile.border, profile.color
      )}>
        <Icon className="w-3 h-3" />
        {profile.label}
      </div>

      {/* Percentuais */}
      <div className="flex items-center gap-1.5 text-xs tabular-nums text-muted-foreground whitespace-nowrap">
        <span><span className="font-bold text-foreground">{rendaFixa}%</span> RF</span>
        <span>·</span>
        <span><span className="font-bold text-foreground">{rendaVariavel}%</span> RV</span>
      </div>

      {/* Barra compacta */}
      <div className="flex flex-col gap-0.5 w-40">
        <div className="relative h-2 w-full rounded-full overflow-hidden">
          <div className="absolute inset-y-0 left-0 w-[10%] bg-emerald-400/80" />
          <div className="absolute inset-y-0 left-[10%] w-[30%] bg-amber-400/80" />
          <div className="absolute inset-y-0 left-[40%] w-[60%] bg-rose-400/80" />
          <div className="absolute inset-y-0 left-[10%] w-px bg-background/90" />
          <div className="absolute inset-y-0 left-[40%] w-px bg-background/90" />
          {/* Indicador */}
          <div
            className="absolute inset-y-0 w-0.5 bg-foreground/80 z-10"
            style={{ left: `${rendaVariavel}%` }}
          />
        </div>
        <div className="flex text-[8px] leading-none">
          <span className="w-[10%] text-center text-emerald-600 dark:text-emerald-400 font-medium">C</span>
          <span className="w-[30%] text-center text-amber-500 font-medium">M</span>
          <span className="w-[60%] text-center text-rose-500 font-medium">A</span>
        </div>
      </div>

    </div>
  );
}
