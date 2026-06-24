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

type TChartBarPoint = {
  month: string;
  acoes: number;
  fiis: number;
  rendaFixa: number;
};

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

interface ChartBarMultipleProps {
  data: TChartBarPoint[];
}

export default function ChartBarMultiple({ data }: ChartBarMultipleProps) {
  const handleTooltipFormatter = (
    value: number | string | readonly (number | string)[] | undefined,
    name?: string | number | unknown,
  ) => {
    if (value === undefined || Array.isArray(value)) return "";
    const numericValue =
      typeof value === "number" ? value : Number.parseFloat(String(value));
    const safeValue = Number.isFinite(numericValue) ? numericValue : 0;
    const absoluteValue = formatCurrency(safeValue);

    const label =
      chartConfig[name as keyof typeof chartConfig]?.label ?? name ?? "Valor";

    return (
      <div className="flex w-full items-center justify-between gap-3">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-mono font-semibold text-foreground tabular-nums">
          {absoluteValue}
        </span>
      </div>
    );
  };

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm shadow-lg h-full">
      <CardHeader className="px-5 pt-4 pb-2">
        <CardTitle className="text-base font-semibold text-foreground">
          Comparativo por Classe de Ativo
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground/70">
          Evolução mensal consolidada por classe: Ações, FIIs e Renda Fixa
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 pb-2">
        <ChartContainer
          config={chartConfig}
          className="h-48 sm:h-56 lg:h-60 xl:h-65 w-full"
        >
          <BarChart accessibilityLayer data={data} barCategoryGap="30%">
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
      <CardFooter className="flex-col items-start gap-1 text-sm px-5 pb-4 pt-1">
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
