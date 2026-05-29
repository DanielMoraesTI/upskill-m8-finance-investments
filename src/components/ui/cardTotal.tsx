import { TrendingUp } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CardTotal() {
  return (
    <Card className="w-full max-w-sm shadow-sm">
      <CardHeader>
        <CardTitle>Valor Total Investido</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center gap-4">
        <div className="text-3xl font-bold">R$ 50.000,00</div>
        <div className="flex items-center gap-1 text-green-500">
          <TrendingUp className="h-4 w-4" />
        </div>
      </CardContent>
    </Card>
  );
}
