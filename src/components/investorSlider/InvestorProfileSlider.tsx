"use client";
import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { ShieldCheck, TrendingUp, Zap } from "lucide-react";

type InvestorProfile = {
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  border: string;
  range: string;
};

const profiles: Record<string, InvestorProfile> = {
  conservador: {
    label: "Investidor Conservador",
    description: "Mais de 90% em Renda Fixa",
    icon: ShieldCheck,
    color: "text-emerald-700 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-950",
    border: "border-emerald-300 dark:border-emerald-700",
    range: "> 90% Renda Fixa",
  },
  moderado: {
    label: "Investidor Moderado",
    description: "Entre 70% e 90% em Renda Fixa",
    icon: TrendingUp,
    color: "text-amber-700 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-950",
    border: "border-amber-300 dark:border-amber-700",
    range: "70% – 90% Renda Fixa",
  },
  arrojado: {
    label: "Investidor Arrojado",
    description: "Menos de 70% em Renda Fixa",
    icon: Zap,
    color: "text-rose-700 dark:text-rose-400",
    bg: "bg-rose-50 dark:bg-rose-950",
    border: "border-rose-300 dark:border-rose-700",
    range: "< 70% Renda Fixa",
  },
};

function getProfile(value: number): keyof typeof profiles {
  if (value > 90) return "conservador";
  if (value >= 70) return "moderado";
  return "arrojado";
}

export function InvestorProfileSlider() {
  const [rendaFixa, setRendaFixa] = useState(85);
  const rendaVariavel = 100 - rendaFixa;
  const profileKey = getProfile(rendaFixa);
  const profile = profiles[profileKey];
  const Icon = profile.icon;

  return (
    <div className="w-full max-w-lg space-y-6 p-6 rounded-2xl border bg-card shadow-sm">
      {/* Header */}
      <div>
        <h3 className="text-base font-semibold text-foreground">
          Perfil de Investidor
        </h3>
        <p className="text-sm text-muted-foreground mt-0.5">
          Ajuste a proporção de Renda Fixa na sua carteira
        </p>
      </div>

      {/* Percentuais */}
      <div className="flex justify-between text-sm font-medium">
        <div className="flex flex-col gap-0.5">
          <span className="text-muted-foreground">Renda Fixa</span>
          <span className="text-2xl font-bold text-foreground tabular-nums">
            {rendaFixa}%
          </span>
        </div>
        <div className="flex flex-col gap-0.5 items-end">
          <span className="text-muted-foreground">Renda Variável</span>
          <span className="text-2xl font-bold text-foreground tabular-nums">
            {rendaVariavel}%
          </span>
        </div>
      </div>

      {/* Slider */}
      <div className="space-y-2">
        <Slider
          min={0}
          max={100}
          step={1}
          value={[rendaFixa]}
          onValueChange={([val]) => setRendaFixa(val)}
          className="w-full"
        />
        {/* Labels das zonas */}
        <div className="flex justify-between text-xs text-muted-foreground px-0.5 select-none">
          <span>0%</span>
          <span className="text-rose-500 font-medium">Arrojado</span>
          <span className="text-amber-500 font-medium">Moderado</span>
          <span className="text-emerald-500 font-medium">Conservador</span>
          <span>100%</span>
        </div>
      </div>

      {/* Barra de zonas coloridas */}
      <div className="flex h-2 w-full rounded-full overflow-hidden gap-0.5">
        <div className="bg-rose-400 flex-[70]" title="Arrojado: 0–69%" />
        <div className="bg-amber-400 flex-[20]" title="Moderado: 70–90%" />
        <div className="bg-emerald-400 flex-[10]" title="Conservador: 91–100%" />
      </div>

      {/* Card do perfil */}
      <div
        className={cn(
          "flex items-center gap-4 rounded-xl border px-5 py-4 transition-all duration-300",
          profile.bg,
          profile.border
        )}
      >
        <div className={cn("rounded-full p-2 bg-white/60 dark:bg-black/20", profile.color)}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className={cn("font-semibold text-sm", profile.color)}>
            {profile.label}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {profile.description}
          </p>
        </div>
        <span
          className={cn(
            "ml-auto text-xs font-mono font-medium px-2 py-1 rounded-md bg-white/60 dark:bg-black/20",
            profile.color
          )}
        >
          {profile.range}
        </span>
      </div>
    </div>
  );
}