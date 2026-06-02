"use client";

import { CardValues } from "@/components/cardsValues/CardValues";
import PieLegends from "@/components/pieLegends/PieLegends";

export default function Fiis() {
  return (
    <div className="grid w-full max-w-7xl grid-cols-1 items-start justify-items-center gap-4 md:grid-cols-2">
      <section className="flex w-full flex-col items-center gap-6">
        <h1 className="text-2xl font-bold">Fundos Imobiliários</h1>
        <CardValues title="Fundos Imobiliários" value="R$ 20.000,00" />
        <PieLegends
          title="Distribuição da Carteira"
          description="Fundos de Tijolo, Fundos de Papel e Fundos Híbridos"
          data={[
            {
              key: "tijolo",
              label: "Fundos de Tijolo",
              value: 10000,
              color: "var(--chart-1)",
            },
            {
              key: "papel",
              label: "Fundos de Papel",
              value: 20000,
              color: "var(--chart-2)",
            },
            {
              key: "hibrido",
              label: "Fundos Híbridos",
              value: 20000,
              color: "var(--chart-3)",
            },
          ]}
        />
      </section>
    </div>
  );
}
