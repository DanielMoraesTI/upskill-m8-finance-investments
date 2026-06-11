"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2 } from "lucide-react";

// --- Types ---
export interface ItemCardData {
  id: string;
  sigla: string;
  categoria: string;
  quantidade: number;
  valorInvestido: number;
  valorAtual: number;
  dataAtualizacao: string; // ISO date string
}

interface ItemCardProps {
  data: ItemCardData;
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
export function ItemCardFiis({ data, onEdit, onDelete }: ItemCardProps) {
  return (
    <Card className="w-full">
      <CardContent className="flex items-center gap-6 px-6 py-4">
        {/* Sigla */}
        <div className="flex flex-col min-w-[60px]">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Sigla
          </span>
          <span className="text-sm font-semibold text-foreground mt-1">
            {data.sigla}
          </span>
        </div>

        <div className="h-8 w-px bg-border" />

        {/* Categoria */}
        <div className="flex flex-col min-w-[120px]">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Categoria
          </span>
          <Badge variant="secondary" className="mt-1 w-fit text-xs">
            {data.categoria}
          </Badge>
        </div>

        <div className="h-8 w-px bg-border" />

        {/* Quantidade */}
        <div className="flex flex-col min-w-[80px]">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Quantidade
          </span>
          <span className="text-sm font-semibold text-foreground mt-1">
            {data.quantidade.toLocaleString("pt-BR")}
          </span>
        </div>

        <div className="h-8 w-px bg-border" />

        {/* Valor Investido */}
        <div className="flex flex-col min-w-[120px]">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Valor Investido
          </span>
          <span className="text-sm font-semibold text-foreground mt-1">
            {formatCurrency(data.valorInvestido)}
          </span>
        </div>

        <div className="h-8 w-px bg-border" />

        {/* Valor Atual */}
        <div className="flex flex-col min-w-[120px]">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Valor Atual
          </span>
          <span className="text-sm font-semibold text-foreground mt-1">
            {formatCurrency(data.valorAtual)}
          </span>
        </div>

        <div className="h-8 w-px bg-border" />

        {/* Data Atualização */}
        <div className="flex flex-col min-w-[120px]">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Data Atualização
          </span>
          <span className="text-sm font-semibold text-foreground mt-1">
            {formatDate(data.dataAtualizacao)}
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
export const fakeItemsFiis: ItemCardData[] = [
  {
    id: "1",
    sigla: "CPTS11",
    categoria: "Fundo de Papel",
    quantidade: 150,
    valorInvestido: 45000.0,
    valorAtual: 47000.0,
    dataAtualizacao: "2024-05-28T10:30:00Z",
  },
  {
    id: "2",
    sigla: "XPML11",
    categoria: "Fundo de Tijolo",
    quantidade: 320,
    valorInvestido: 8750.5,
    valorAtual: 9000.0,
    dataAtualizacao: "2024-05-27T14:15:00Z",
  },
  {
    id: "3",
    sigla: "RECR11",
    categoria: "Fundo de Papel",
    quantidade: 87,
    valorInvestido: 12300.75,
    valorAtual: 12500.0,
    dataAtualizacao: "2024-05-26T09:00:00Z",
  },
];
