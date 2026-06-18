import ChartBarMultiple from "@/components/chart-objects/ChartBarMultiple";
import CardValues from "@/components/chart-objects/CardValues";
import { Vault, Building2, Landmark, Wallet } from "lucide-react";
import PieLegends from "@/components/chart-objects/PieLegends";
import InvestorProfileSlider from "@/components/chart-objects/InvestorProfileSlider";

export default function DashboardPage() {
  return (
    <div className="flex flex-col w-full flex-1 items-center justify-start px-4 sm:px-6 lg:px-8 py-6 gap-6 max-w-screen-2xl mx-auto">
      {/* SEÇÃO DE INTRODUÇÃO */}
      <section className="flex w-full flex-col items-center gap-4">
        <InvestorProfileSlider />
        <div className="text-center max-w-3xl">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Resumo dos Investimentos
          </h1>
          <p className="mt-2 text-sm text-muted-foreground/70 leading-relaxed max-w-2xl mx-auto">
            Centralize a gestão dos seus ativos e acompanhe a evolução do seu
            capital para tomar decisões informadas e estratégicas.
          </p>
        </div>

        {/* Linha divisória decorativa */}
        <div className="w-full h-px bg-linear-to-r from-transparent via-border/60 to-transparent" />
      </section>

      {/* GRID PRINCIPAL */}
      <section className="grid w-full grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
        {/* Sub-grid dos 4 Cards */}
        <div className="grid grid-cols-2 gap-4">
          <CardValues
            title="Valor Total Investido"
            value="R$ 50.000,00"
            icon={Vault}
            highlight
          />
          <CardValues
            title="Ações"
            value="R$ 10.000,00"
            percentage="20%"
            icon={Wallet}
          />
          <CardValues
            title="Fundos Imobiliários"
            value="R$ 20.000,00"
            percentage="40%"
            icon={Building2}
          />
          <CardValues
            title="Renda Fixa"
            value="R$ 20.000,00"
            percentage="40%"
            icon={Landmark}
          />
        </div>

        {/* PieLegends */}
        <div className="flex w-full h-full min-h-70">
          <PieLegends
            title="Distribuição de Fundos Imobiliários"
            description="Fundos de Papel, Fundos de Tijolo e Fundos Híbridos"
            legendColumnsClass="*:basis-1/4"
            data={[
              { key: "papel", label: "Fundos de Papel", value: 40 },
              { key: "tijolo", label: "Fundos de Tijolo", value: 30 },
              { key: "hibrido", label: "Fundos Híbridos", value: 30 },
            ]}
          />
        </div>
      </section>

      {/* GRÁFICO DE BARRAS */}
      <div className="w-full">
        <ChartBarMultiple />
      </div>
    </div>
  );
}
