"use client";
import { useState, useEffect, useRef } from "react";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { ShieldCheck, TrendingUp, Zap, CircleQuestionMark } from "lucide-react";
import { Button } from "../ui/button";

type InvestorProfile = {
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  border: string;
  range: string;
};

type TInvestorProfileOptions = "conservador" | "moderado" | "arrojado";

const profiles: Record<TInvestorProfileOptions, InvestorProfile> = {
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
    description: "Entre 60% e 90% em Renda Fixa",
    icon: TrendingUp,
    color: "text-amber-700 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-950",
    border: "border-amber-300 dark:border-amber-700",
    range: "60% – 90% Renda Fixa",
  },
  arrojado: {
    label: "Investidor Arrojado",
    description: "Menos de 60% em Renda Fixa",
    icon: Zap,
    color: "text-rose-700 dark:text-rose-400",
    bg: "bg-rose-50 dark:bg-rose-950",
    border: "border-rose-300 dark:border-rose-700",
    range: "< 60% Renda Fixa",
  },
};

function getProfile(value: number): TInvestorProfileOptions {
  if (value > 90) return "conservador";
  if (value >= 60) return "moderado";
  return "arrojado";
}

const rendaFixaInicial = 85; // Esse número tem que ser calculado a partir do contexto da carteira.

export default function InvestorProfileSlider() {
  const [rendaFixa, setRendaFixa] = useState<number[]>([rendaFixaInicial]);
  const [rendaVariavel, setRendaVariavel] = useState<number>(
    100 - rendaFixaInicial,
  );
  const [profile, setProfile] = useState<InvestorProfile>(
    profiles[getProfile(rendaFixaInicial)],
  );
  const [openHelp, setOpenHelp] = useState<boolean>(false);

  const timeoutRef = useRef<number | null>(null); // Timeout para alterar o card só após o usuário parar de arrastar o slider por 300ms

  useEffect(() => {
    // Função para lidar com a mudança do slider e atualizar os estados de renda fixa, renda variável e perfil
    const handleSliderChange = (value: number | number[]) => {
      const rf = Array.isArray(value) ? value[0] : value;
      setRendaFixa([rf]);
      setRendaVariavel(100 - rf);
      setProfile(profiles[getProfile(rf)]);
    };

    // Limpa o timeout anterior para evitar mudanças rápidas no card enquanto o usuário arrasta o slider
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Define um novo timeout para atualizar o card após 300ms
    timeoutRef.current = window.setTimeout(() => {
      handleSliderChange(rendaFixa[0]);
    }, 300);

    // Limpa o timeout quando o componente for desmontado ou quando rendaFixa mudar
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [rendaFixa]);

  const renderProfileIcon = () => {
    const Icon = profile.icon;
    return <Icon className="w-6 h-6" />;
  };

  return (
    <div className="relative w-full max-w-lg space-y-6 p-6 rounded-2xl border bg-card shadow-sm">
      {/* Header */}
      <div className="flex flex-row justify-between items-center">
        <h3 className="text-base font-semibold text-foreground">
          Perfil de Investidor
        </h3>
        <button onClick={() => setOpenHelp(!openHelp)}>
          <CircleQuestionMark size={16} />
        </button>
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
          step={10}
          value={rendaFixa[0]}
          onValueChange={(value) =>
            setRendaFixa(Array.isArray(value) ? value : [value])
          }
          className="w-full"
        />
        {/* Zonas do perfil alinhadas aos intervalos reais */}
        <div className="px-0.5 select-none">
          <div className="relative h-2 w-full overflow-hidden rounded-full">
            <div className="absolute inset-y-0 left-0 w-[60%] bg-rose-400/70" />
            <div className="absolute inset-y-0 left-[60%] w-[30%] bg-amber-400/70" />
            <div className="absolute inset-y-0 left-[90%] w-[10%] bg-emerald-400/70" />

            {/* divisórias de corte */}
            <div className="absolute inset-y-0 left-[60%] w-px bg-background/90" />
            <div className="absolute inset-y-0 left-[90%] w-px bg-background/90" />
          </div>

          <div className="mt-2 flex text-[11px] leading-none">
            <span className="w-[60%] text-center font-medium text-rose-500">
              Arrojado
            </span>
            <span className="w-[30%] text-center font-medium text-amber-500">
              Moderado
            </span>
            <span className="w-[10%] text-center font-medium text-emerald-500">
              Conservador
            </span>
          </div>

          <div className="relative mt-1 h-4 text-[10px] text-muted-foreground">
            <span className="absolute left-0 translate-x-0">0%</span>
            <span className="absolute left-[60%] -translate-x-1/2">60%</span>
            <span className="absolute left-[90%] -translate-x-1/2">90%</span>
            <span className="absolute right-0 translate-x-0">100%</span>
          </div>
        </div>
      </div>

      {/* Card do perfil */}
      {openHelp && (
        <div className="absolute inset-0 w-full h-full bg-background/20 backdrop-blur-sm flex flex-col gap-2 items-center justify-center p-4 rounded-2xl">
          <div
            className={cn(
              "flex items-center gap-4 rounded-xl border px-5 py-4 transition-all duration-300",
              profile.bg,
              profile.border,
            )}
          >
            <div
              className={cn(
                "rounded-full p-2 bg-white/60 dark:bg-black/20",
                profile.color,
              )}
            >
              {renderProfileIcon()}
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
                profile.color,
              )}
            >
              {profile.range}
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={() => setOpenHelp(false)}>
            fechar
          </Button>
        </div>
      )}
    </div>
  );
}
