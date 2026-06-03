"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2 } from "lucide-react";

// --- Types ---
export interface ItemCardData {
  id: string;
  sigla: string;
  name: string;
  quantidade: number;
  valorTotal: number;
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
export function ItemCard({ data, onEdit, onDelete }: ItemCardProps) {
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

        {/* Nome */}
        <div className="flex flex-col min-w-[120px]">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Empresa
          </span>
          <Badge variant="secondary" className="mt-1 w-fit text-xs">
            {data.name}
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

        {/* Valor Total */}
        <div className="flex flex-col min-w-[120px]">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Valor Total
          </span>
          <span className="text-sm font-semibold text-foreground mt-1">
            {formatCurrency(data.valorTotal)}
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
export const fakeItems: ItemCardData[] = [
  {
    id: "1",
    sigla: "ITSA3",
    name: "ITAUSA S.A.",
    quantidade: 150,
    valorTotal: 45000.0,
    dataAtualizacao: "2024-05-28T10:30:00Z",
  },
  {
    id: "2",
    sigla: "PETR4",
    name: "PETROBRAS S.A.",
    quantidade: 320,
    valorTotal: 8750.5,
    dataAtualizacao: "2024-05-27T14:15:00Z",
  },
  {
    id: "3",
    sigla: "CMIG4",
    name: "Cemig Energia MG S.A.",
    quantidade: 87,
    valorTotal: 12300.75,
    dataAtualizacao: "2024-05-26T09:00:00Z",
  },
];