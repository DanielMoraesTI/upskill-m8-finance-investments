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

type PieLegendsItem = {
  key: string;
  label: string;
  value: number;
  color: string;
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
  valueLabel = "Valor",
  legendColumnsClass = "*:basis-1/3",
}: PieLegendsProps) {
  const chartData = data.map((item) => ({
    categoria: item.key,
    valor: item.value,
    fill: `var(--color-${item.key})`,
  }));

  const chartConfig: ChartConfig = data.reduce(
    (config, item) => {
      config[item.key] = {
        label: item.label,
        color: item.color,
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
