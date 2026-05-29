"use client";

import ChartPieLegend from "@/components/ui/CircleInvestments";
import { ChartBarMultiple } from "@/components/ui/ChartBarMultiple";
import { CardAcoes } from "@/components/ui/cardAcoes";
import { CardFiis } from "@/components/ui/cardFiis";
import { CardRendaFixa } from "@/components/ui/cardRendaFixa";
import { CardTotal } from "@/components/ui/cardTotal";

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
          <CardTotal />
          <CardAcoes />
          <CardFiis />
          <CardRendaFixa />
        </div>
      </section>
      <div className="mt-6 grid w-full grid-rows-1 gap-4 md:grid-cols-2">
        <ChartPieLegend />
        <ChartBarMultiple />
      </div>
    </div>
  );
}
