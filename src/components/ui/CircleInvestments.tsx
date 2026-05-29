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
  { categoria: "acoes", valor: 10000, fill: "var(--color-acoes)" },
  { categoria: "fiis", valor: 20000, fill: "var(--color-fiis)" },
  { categoria: "rendaFixa", valor: 20000, fill: "var(--color-rendaFixa)" },
];

const chartConfig = {
  valor: {
    label: "Valor",
  },
  acoes: {
    label: "Ações",
    color: "var(--chart-1)",
  },
  fiis: {
    label: "FIIs",
    color: "var(--chart-2)",
  },
  rendaFixa: {
    label: "Renda Fixa",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

export default function ChartPieLegend() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Distribuição da Carteira</CardTitle>
        <CardDescription>Ações, FIIs e Renda Fixa</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-75"
        >
          <PieChart>
            <Pie data={chartData} dataKey="valor" nameKey="categoria" />
            <ChartLegend
              content={<ChartLegendContent nameKey="categoria" />}
              className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
