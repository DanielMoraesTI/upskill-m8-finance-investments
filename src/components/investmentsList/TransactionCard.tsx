"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/dataTypeUtils";
import { formatCurrency } from "@/utils/dataTypeUtils";
import type { TFii, TRendaFixa, TStock } from "@/schemas/assetSchema";
import type { TTransaction } from "@/schemas/transactionSchema";

// --- Types ---
export type TransactionType = "compra" | "venda";
export type TransactionAsset = "acoes" | "fundos-imobiliarios" | "renda-fixa";

type BaseTransactionCardData = {
  id: string;
  tipo: TransactionType;
  asset: TransactionAsset;
  valorTotal: TTransaction["total_value"];
  data: TTransaction["date"];
};

type VariableIncomeTransactionCardData = BaseTransactionCardData & {
  asset: "acoes" | "fundos-imobiliarios";
  sigla: TStock["ticker"] | TFii["ticker"];
  quantidade: TTransaction["quantity"];
  valorUnitario: TTransaction["unit_price"];
};

type FixedIncomeTransactionCardData = BaseTransactionCardData & {
  asset: "renda-fixa";
  name: TRendaFixa["company"];
};

export type TransactionCardData =
  | VariableIncomeTransactionCardData
  | FixedIncomeTransactionCardData;

interface TransactionCardProps {
  data: TransactionCardData;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

// --- Component ---
export function TransactionCard({
  data,
  onEdit,
  onDelete,
}: TransactionCardProps) {
  const isRendaFixa = data.asset === "renda-fixa";
  const isCompra = data.tipo === "compra";
  const ticker = "sigla" in data ? data.sigla : undefined;
  const quantity = "quantidade" in data ? data.quantidade : undefined;
  const unitValue = "valorUnitario" in data ? data.valorUnitario : undefined;
  const fixedIncomeName = "name" in data ? data.name : undefined;

  return (
    <Card className="w-full border-border/50 bg-card/80 backdrop-blur-sm shadow-sm card-hover group overflow-x-auto">
      <CardContent className="flex items-center gap-5 px-5 py-4 min-w-max">
        {/* Tipo: Compra / Venda */}
        <div className="flex flex-col w-[88px] shrink-0">
          <span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest">
            Tipo
          </span>
          <Badge
            variant="outline"
            className={cn(
              "mt-1 w-fit text-xs font-semibold flex items-center gap-1 border px-2 py-0.5 rounded-full",
              isCompra
                ? "bg-emerald-950/50 text-emerald-400 border-emerald-800/50"
                : "bg-rose-950/50 text-rose-400 border-rose-800/50",
            )}
          >
            {isCompra ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {isCompra ? "Compra" : "Venda"}
          </Badge>
        </div>

        <div className="h-8 w-px bg-border/50" />

        {/* Sigla / Nome */}
        <div className="flex flex-col w-[180px] shrink-0">
          <span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest">
            {isRendaFixa ? "Nome" : "Sigla"}
          </span>
          <span
            className={`text-sm font-bold mt-1 truncate ${isRendaFixa ? "text-foreground" : "text-primary"}`}
            title={isRendaFixa ? fixedIncomeName : ticker}
          >
            {isRendaFixa ? fixedIncomeName : ticker}
          </span>
        </div>

        <div className="h-8 w-px bg-border/50" />

        {/* Quantidade */}
        <div className="flex flex-col w-[100px] shrink-0">
          <span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest">
            {!isRendaFixa ? "Quantidade" : "\u00A0"}
          </span>
          <span className="text-sm font-semibold text-foreground mt-1">
            {!isRendaFixa ? quantity?.toLocaleString("pt-BR") : "--"}
          </span>
        </div>

        <div className="h-8 w-px bg-border/50" />

        {/* Valor Unitário */}
        <div className="flex flex-col w-[130px] shrink-0">
          <span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest">
            {!isRendaFixa ? "Valor Unitário" : ""}
          </span>
          <span className="text-sm font-semibold text-foreground mt-1">
            {!isRendaFixa && unitValue ? formatCurrency(unitValue) : "--"}
          </span>
        </div>

        <div className="h-8 w-px bg-border/50" />

        {/* Valor Total */}
        <div className="flex flex-col w-[130px] shrink-0">
          <span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest">
            Valor Total
          </span>
          <span
            className={`text-sm font-bold mt-1 ${isCompra ? "text-chart-1" : "text-chart-5"}`}
          >
            {formatCurrency(data.valorTotal)}
          </span>
        </div>

        <div className="h-8 w-px bg-border/50" />

        {/* Data */}
        <div className="flex flex-col w-[100px] shrink-0">
          <span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest">
            Data
          </span>
          <span className="text-sm font-semibold text-foreground mt-1">
            {formatDate(data.data)}
          </span>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit?.(data.id)}
            className="flex items-center gap-1.5 border-border/50 hover:border-primary/40 hover:bg-primary/8 hover:text-primary transition-all"
          >
            <Pencil className="h-3.5 w-3.5" />
            Editar
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete?.(data.id)}
            className="flex items-center gap-1.5 text-muted-foreground/60 hover:text-destructive hover:bg-destructive/10 transition-all"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Deletar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
