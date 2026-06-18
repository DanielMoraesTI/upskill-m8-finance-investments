"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { formatCurrency } from "@/utils/dataTypeUtils";

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

export default function ChartBarMultiple() {
  const handleTooltipFormatter = (
    value: number | string | readonly (number | string)[] | undefined,
    name?: string | number | any,
  ) => {
    if (value === undefined || Array.isArray(value)) return "";
    const numericValue =
      typeof value === "number" ? value : Number.parseFloat(String(value));
    const safeValue = Number.isFinite(numericValue) ? numericValue : 0;
    const absoluteValue = formatCurrency(safeValue);

    return (
      <div className="flex w-full items-center justify-between gap-3">
        <span className="text-muted-foreground">{name || "Valor"}</span>
        <span className="font-mono font-semibold text-foreground tabular-nums">
          {absoluteValue}
        </span>
      </div>
    );
  };

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm shadow-lg">
      <CardHeader className="px-6 pt-5 pb-3">
        <CardTitle className="text-base font-semibold text-foreground">
          Comparativo por Classe de Ativo
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground/70">
          Evolução mensal consolidada por classe: Ações, FIIs e Renda Fixa
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <ChartContainer config={chartConfig} className="min-h-55 w-full">
          <BarChart accessibilityLayer data={chartData} barCategoryGap="30%">
            <CartesianGrid
              vertical={false}
              stroke="currentColor"
              strokeOpacity={0.06}
            />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tick={{ fontSize: 11, fill: "currentColor", opacity: 0.5 }}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={{ fill: "currentColor", opacity: 0.04 }}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  formatter={handleTooltipFormatter}
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="acoes"
              fill="var(--color-acoes)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="fiis"
              fill="var(--color-fiis)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="rendaFixa"
              fill="var(--color-rendaFixa)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-1.5 text-sm px-6 pb-5">
        <div className="flex gap-2 leading-none font-semibold text-foreground">
          Desempenho consolidado dos 3 tipos{" "}
          <TrendingUp className="h-4 w-4 text-chart-1" />
        </div>
        <div className="leading-none text-xs text-muted-foreground/60">
          Visão comparativa dos últimos 6 meses
        </div>
      </CardFooter>
    </Card>
  );
}
