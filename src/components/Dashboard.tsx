"use client";

import { ChartBarMultiple } from "@/components/multipleBar/MultipleBar";
import { CardValues } from "@/components/cardsValues/CardValues";
import { InvestorProfileSlider } from "@/components/investorSlider/InvestorProfileSlider";
import PieLegends from "@/components/pieLegends/PieLegends";

export const description = "A multiple bar chart";

export default function Dashboard() {
  return (
    <div className="flex flex-col w-full flex-1 items-center justify-center px-4 py-6">
      <section className="flex w-full flex-col items-center gap-6">
        <h1 className="text-2xl font-bold">Resumo dos Investimentos</h1>
        <p className="text-muted-foreground">
          Acompanhe o desempenho dos seus investimentos em um só lugar
        </p>
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <CardValues title="Valor Total Investido" value="R$ 50.000,00" />
          <CardValues title="Ações" value="R$ 10.000,00" />
          <CardValues title="Fundos Imobiliários" value="R$ 20.000,00" />
          <CardValues title="Renda Fixa" value="R$ 20.000,00" />
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
        <InvestorProfileSlider />
      </div>
    </div>
  );
}
