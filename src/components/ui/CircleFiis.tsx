"use client";

import { Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";

export const description = "A pie chart with a legend";

const chartData = [
  { categoria: "tijolo", valor: 10000, fill: "var(--color-tijolo)" },
  { categoria: "papel", valor: 20000, fill: "var(--color-papel)" },
  { categoria: "hibrido", valor: 20000, fill: "var(--color-hibrido)" },
];

const chartConfig = {
  valor: {
    label: "Valor",
  },
  tijolo: {
    label: "Fundos de Tijolo",
    color: "var(--chart-1)",
  },
  papel: {
    label: "Fundos de Papel",
    color: "var(--chart-2)",
  },
  hibrido: {
    label: "Fundos Híbridos",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

export default function ChartPieLegend() {
  return (
    <Card className="flex h-full w-full flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Distribuição da Carteira</CardTitle>
        <CardDescription>
          Fundos de Tijolo, Fundos de Papel e Fundos Híbridos
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 items-center justify-center pb-2">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square h-full max-h-80 w-full"
        >
          <PieChart>
            <Pie data={chartData} dataKey="valor" nameKey="categoria" />
            <ChartLegend
              content={<ChartLegendContent nameKey="categoria" />}
              className="-translate-y-1 flex-wrap gap-2 *:basis-1/3 *:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
