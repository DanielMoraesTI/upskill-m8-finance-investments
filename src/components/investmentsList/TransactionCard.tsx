"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

// --- Types ---
export type TransactionType = "compra" | "venda";
export type TransactionAsset = "acoes" | "fundos-imobiliarios" | "renda-fixa";

export interface TransactionCardData {
  id: string;
  tipo: TransactionType;
  asset: TransactionAsset;
  // acoes + fundos-imobiliarios
  sigla?: string;
  quantidade?: number;
  valorUnitario?: number;
  // renda-fixa
  name?: string;
  // shared
  valorTotal: number;
  data: string; // ISO date string
}

interface TransactionCardProps {
  data: TransactionCardData;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

// --- Helpers ---
function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(dateStr));
}

// --- Component ---
export function TransactionCard({ data, onEdit, onDelete }: TransactionCardProps) {
  const isRendaFixa = data.asset === "renda-fixa";
  const isCompra = data.tipo === "compra";

  return (
    <Card className="w-full">
      <CardContent className="flex items-center gap-6 px-6 py-4">

        {/* Tipo: Compra / Venda */}
        <div className="flex flex-col w-[90px] shrink-0">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Tipo
          </span>
          <Badge
            // Mudamos o variant da Compra para "secondary" (ou deixamos sem variant) 
            // para que o fundo preto padrão do shadcn não sobressaia
            variant="outline"
            className={cn(
              "mt-1 w-fit text-xs font-semibold flex items-center gap-1 border px-2 py-0.5 rounded-full shadow-sm",
              isCompra 
                ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800" 
                : "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800"
            )}
          >
            {isCompra ? (
              <TrendingUp className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <TrendingDown className="h-3 w-3 text-rose-600 dark:text-rose-400" />
            )}
            {isCompra ? "Compra" : "Venda"}
          </Badge>
        </div>

        <div className="h-8 w-px bg-border" />

        {/* Sigla — acoes + fundos-imobiliarios | Nome — renda-fixa */}
        <div className="flex flex-col w-[180px] shrink-0">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {isRendaFixa ? "Nome" : "Sigla"}
          </span>
          <span className="text-sm font-semibold text-foreground mt-1 truncate" title={isRendaFixa ? data.name : data.sigla}>
            {isRendaFixa ? data.name : data.sigla}
          </span>
        </div>

        <div className="h-8 w-px bg-border" />

        {/* Quantidade — acoes + fundos-imobiliarios | espaço vazio — renda-fixa */}
        <div className="flex flex-col w-[100px] shrink-0">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {!isRendaFixa ? "Quantidade" : "\u00A0"}
          </span>
          <span className="text-sm font-semibold text-foreground mt-1">
            {!isRendaFixa ? data.quantidade?.toLocaleString("pt-BR") : "\u00A0"}
          </span>
        </div>

        <div className="h-8 w-px bg-border" />

        {/* Valor Unitário — acoes + fundos-imobiliarios | espaço vazio — renda-fixa */}
        <div className="flex flex-col w-[130px] shrink-0">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {!isRendaFixa ? "Valor Unitário" : "\u00A0"}
          </span>
          <span className="text-sm font-semibold text-foreground mt-1">
            {!isRendaFixa && data.valorUnitario
              ? formatCurrency(data.valorUnitario)
              : "\u00A0"}
          </span>
        </div>

        <div className="h-8 w-px bg-border" />

        {/* Valor Total — all */}
        <div className="flex flex-col w-[130px] shrink-0">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Valor Total
          </span>
          <span className="text-sm font-semibold text-foreground mt-1">
            {formatCurrency(data.valorTotal)}
          </span>
        </div>

        <div className="h-8 w-px bg-border" />

        {/* Data — all */}
        <div className="flex flex-col w-[100px] shrink-0">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
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
            className="flex items-center gap-1.5"
          >
            <Pencil className="h-3.5 w-3.5" />
            Editar
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete?.(data.id)}
            className="flex items-center gap-1.5"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Deletar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// --- Fake Data ---
export const fakeTransactions: TransactionCardData[] = [
  {
    id: "1",
    tipo: "compra",
    asset: "acoes",
    sigla: "ITSA3",
    quantidade: 100,
    valorUnitario: 10.5,
    valorTotal: 1050.0,
    data: "2024-05-28T10:30:00Z",
  },
  {
    id: "2",
    tipo: "venda",
    asset: "acoes",
    sigla: "PETR4",
    quantidade: 50,
    valorUnitario: 38.2,
    valorTotal: 1910.0,
    data: "2024-05-27T14:15:00Z",
  },
  {
    id: "3",
    tipo: "compra",
    asset: "fundos-imobiliarios",
    sigla: "CPTS11",
    quantidade: 200,
    valorUnitario: 9.85,
    valorTotal: 1970.0,
    data: "2024-05-26T09:00:00Z",
  },
  {
    id: "4",
    tipo: "venda",
    asset: "fundos-imobiliarios",
    sigla: "XPML11",
    quantidade: 80,
    valorUnitario: 105.3,
    valorTotal: 8424.0,
    data: "2024-05-25T11:45:00Z",
  },
  {
    id: "5",
    tipo: "compra",
    asset: "renda-fixa",
    name: "Nubank Caixinha",
    valorTotal: 5000.0,
    data: "2024-05-24T08:00:00Z",
  },
  {
    id: "6",
    tipo: "venda",
    asset: "renda-fixa",
    name: "Itaú Crédito Bancário Renda Fixa Crédito Privado",
    valorTotal: 12000.0,
    data: "2024-05-23T16:30:00Z",
  },
];
