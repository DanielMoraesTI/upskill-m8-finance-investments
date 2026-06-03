import { TrendingUp } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type CardValuesProps = {
  title: string;
  value: string;
};

export function CardValues({ title, value }: CardValuesProps) {
  return (
    <Card className="w-full max-w-sm shadow-sm">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center gap-4">
        <div className="text-3xl font-bold">{value}</div>
        <div className="flex items-center gap-1 text-green-500">
          <TrendingUp className="h-4 w-4" />
        </div>
      </CardContent>
    </Card>
  );
}
