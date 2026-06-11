import ChartBarMultiple from "@/components/chart-objects/ChartBarMultiple";
import CardValues from "@/components/chart-objects/CardValues";
import { Vault, Building2, Landmark, Wallet } from "lucide-react";
import PieLegends from "@/components/chart-objects/PieLegends";

export default function DashboardPage() {
  return (
    <div className="flex flex-col w-full flex-1 items-center justify-center px-4 py-6">
      <section className="flex w-full flex-col items-center gap-6">
        <h1 className="text-2xl font-bold">Resumo dos Investimentos: Visão Geral do Patrimônio</h1>
        <p className="text-muted-foreground">
          Centralize a gestão dos seus ativos e acompanhe a evolução do seu capital para tomar decisões informadas e estratégicas. Tenha uma visão clara do seu patrimônio, diversificação e desempenho dos seus investimentos em um só lugar.
        </p>
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 items-center justify-items-center">
          <CardValues title="Valor Total Investido" value="R$ 50.000,00" icon={Vault} />
          <CardValues title="Ações" value="R$ 10.000,00" icon={Wallet}/>
          <CardValues title="Fundos Imobiliários" value="R$ 20.000,00" icon={Building2}/>
          <CardValues title="Renda Fixa" value="R$ 20.000,00" icon={Landmark}/>
        </div>
      </section>
      <div className="mt-6 grid w-full grid-rows-1 gap-4 md:grid-cols-2">
        <PieLegends
          title="Distribuição da Carteira"
          description="Ações, FIIs e Renda Fixa"
          legendColumnsClass="*:basis-1/4"
          data={[
            {
              key: "acoes",
              label: "Ações",
              value: 10000,
              color: "var(--chart-1)",
            },
            {
              key: "fiis",
              label: "FIIs",
              value: 20000,
              color: "var(--chart-2)",
            },
            {
              key: "rendaFixa",
              label: "Renda Fixa",
              value: 20000,
              color: "var(--chart-3)",
            },
          ]}
        />
        <ChartBarMultiple />
      </div>
    </div>
  );
}
