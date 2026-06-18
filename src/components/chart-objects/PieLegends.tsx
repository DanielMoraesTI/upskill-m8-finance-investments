"use client";

import { Pie, PieChart } from "recharts";
import { formatCurrency } from "@/utils/dataTypeUtils";

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
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

type PieLegendsItem = {
  key: string;
  label: string;
  value: number;
  color?: string;
};

type PieLegendsProps = {
  title: string;
  description: string;
  data: PieLegendsItem[];
  valueLabel?: string;
  legendColumnsClass?: string;
};

export default function PieLegends({
  title,
  description,
  data,
  valueLabel = "Distribuição por Categoria",
  legendColumnsClass = "*:basis-1/3",
}: PieLegendsProps) {
  const totalValue = data.reduce((sum, item) => sum + item.value, 0);

  const resolveThemeColor = (key: string, index: number, color?: string) => {
    if (color) {
      return color;
    }

    const normalizedKey = key.toLowerCase();
    const semanticTokenMap: Record<string, string> = {
      papel: "var(--chart-4)",
      tijolo: "var(--chart-5)",
      hibrido: "var(--chart-6)",
      hibridos: "var(--chart-6)",
    };

    if (semanticTokenMap[normalizedKey]) {
      return semanticTokenMap[normalizedKey];
    }

    const fallbackTokens = [
      "var(--chart-4)",
      "var(--chart-5)",
      "var(--chart-6)",
    ];
    return fallbackTokens[index % fallbackTokens.length];
  };

  const chartData = data.map((item, index) => ({
    categoria: item.key,
    valor: item.value,
    fill: resolveThemeColor(item.key, index, item.color),
  }));

  const chartConfig: ChartConfig = data.reduce(
    (config, item, index) => {
      config[item.key] = {
        label: item.label,
        color: resolveThemeColor(item.key, index, item.color),
      };

      return config;
    },
    {
      valor: {
        label: valueLabel,
      },
    } as ChartConfig,
  );

  return (
    <Card className="flex h-full w-full flex-col border-border/50 bg-card/80 backdrop-blur-sm shadow-lg">
      <CardHeader className="items-center pb-0 px-5 pt-5">
        <CardTitle className="text-base font-semibold text-foreground">
          {title}
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground/70">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 items-center justify-center pb-4 px-4">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square h-full max-h-80 w-full"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  nameKey="categoria"
                  formatter={(value, name) => {
                    const numericValue =
                      typeof value === "number"
                        ? value
                        : Number.parseFloat(String(value));
                    const safeValue = Number.isFinite(numericValue)
                      ? numericValue
                      : 0;

                    const percent =
                      totalValue > 0 ? (safeValue / totalValue) * 100 : 0;
                    const absoluteValue = formatCurrency(safeValue);

                    return (
                      <div className="flex w-full items-center justify-between gap-3">
                        <span className="text-muted-foreground">
                          {String(name)}
                        </span>
                        <span className="font-mono font-semibold text-foreground tabular-nums">
                          {absoluteValue} | {percent.toFixed(1)}%
                        </span>
                      </div>
                    );
                  }}
                />
              }
            />
            <Pie
              data={chartData}
              dataKey="valor"
              nameKey="categoria"
              strokeWidth={2}
              stroke="var(--background)"
            />
            <ChartLegend
              content={<ChartLegendContent nameKey="categoria" />}
              className={`-translate-y-1 flex-wrap gap-2 ${legendColumnsClass} *:justify-center`}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
