"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const chartData = [
  { month: "January", acoes: 186, fiis: 80, rendaFixa: 120 },
  { month: "February", acoes: 145, fiis: 90, rendaFixa: 100 },
  { month: "March", acoes: 200, fiis: 120, rendaFixa: 150 },
  { month: "April", acoes: 170, fiis: 110, rendaFixa: 130 },
  { month: "May", acoes: 220, fiis: 140, rendaFixa: 160 },
  { month: "June", acoes: 190, fiis: 130, rendaFixa: 140 },
];

const chartConfig = {
  acoes: {
    label: "Ações",
    color: "var(--chart-1)",
  },
  fiis: {
    label: "Fiis",
    color: "var(--chart-2)",
  },
  rendaFixa: {
    label: "Renda Fixa",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

export function ChartBarMultiple() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparativo de Investimentos</CardTitle>
        <CardDescription>
          Ações, Fundos Imobiliários e Renda Fixa
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="acoes" fill="var(--color-acoes)" radius={4} />
            <Bar dataKey="fiis" fill="var(--color-fiis)" radius={4} />
            <Bar dataKey="rendaFixa" fill="var(--color-rendaFixa)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Desempenho consolidado dos 3 tipos <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Visão comparativa dos ultimos 6 meses
        </div>
      </CardFooter>
    </Card>
  );
}
