"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pencil, History } from "lucide-react";

// --- Types ---
export type AssetType = "acoes" | "fundos-imobiliarios" | "renda-fixa";

export interface ItemCardData {
  id: string;
  // acoes + fundos-imobiliarios
  sigla?: string;
  quantidade?: number;
  // acoes
  name?: string;
  // fundos-imobiliarios
  categoria?: string;
  // renda-fixa
  dataInicial?: string;
  // shared
  valorInvestido: number;
  valorAtual: number;
  dataAtualizacao: string; // ISO date string
}

interface ItemCardProps {
  asset: AssetType;
  data: ItemCardData;
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

// --- Componente ---
export default function WalletCard({ asset, data}: ItemCardProps) {

  const handleEditClick = () => {}

  return (
    <Card className="w-full border-border/50 bg-card/80 backdrop-blur-sm shadow-sm card-hover group overflow-x-auto">
      <CardContent className="flex items-center gap-5 px-5 py-4 min-w-max">
        {/* Sigla — acoes e fundos-imobiliarios */}
        {(asset === "acoes" || asset === "fundos-imobiliarios") && (
          <>
            <div className="flex w-20 shrink-0 flex-col">
              <span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest">
                Sigla
              </span>
              <span
                className="mt-1 truncate text-sm font-bold text-primary"
                title={data.sigla}
              >
                {data.sigla}
              </span>
            </div>
            <div className="h-8 w-px bg-border/50" />
          </>
        )}

        {/* Empresa — acoes */}
        {asset === "acoes" && (
          <>
            <div className="flex w-44 shrink-0 flex-col">
              <span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest">
                Empresa
              </span>
              <Badge
                variant="secondary"
                className="mt-1 inline-flex max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-xs bg-secondary/60 border-border/40"
                title={data.name}
              >
                {data.name}
              </Badge>
            </div>
            <div className="h-8 w-px bg-border/50" />
          </>
        )}

        {/* Categoria — fundos-imobiliarios */}
        {asset === "fundos-imobiliarios" && (
          <>
            <div className="flex w-44 shrink-0 flex-col">
              <span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest">
                Categoria
              </span>
              <Badge
                variant="secondary"
                className="mt-1 inline-flex max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-xs bg-secondary/60 border-border/40"
                title={data.categoria}
              >
                {data.categoria}
              </Badge>
            </div>
            <div className="h-8 w-px bg-border/50" />
          </>
        )}

        {/* Nome — renda-fixa */}
        {asset === "renda-fixa" && (
          <>
            <div className="flex w-44 shrink-0 flex-col">
              <span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest">
                Nome
              </span>
              <span
                className="mt-1 truncate text-sm font-semibold text-foreground"
                title={data.name}
              >
                {data.name}
              </span>
            </div>
            <div className="h-8 w-px bg-border/50" />
          </>
        )}

        {/* Data Inicial — renda-fixa */}
        {asset === "renda-fixa" && (
          <>
            <div className="flex w-28 shrink-0 flex-col">
              <span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest">
                Data Inicial
              </span>
              <Badge
                variant="secondary"
                className="mt-1 w-fit text-xs bg-secondary/60 border-border/40"
              >
                {data.dataInicial}
              </Badge>
            </div>
            <div className="h-8 w-px bg-border/50" />
          </>
        )}

        {/* Quantidade — acoes e fundos-imobiliarios */}
        {(asset === "acoes" || asset === "fundos-imobiliarios") && (
          <>
            <div className="flex w-24 shrink-0 flex-col">
              <span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest">
                Quantidade
              </span>
              <span className="mt-1 text-sm font-semibold text-foreground">
                {data.quantidade?.toLocaleString("pt-BR")}
              </span>
            </div>
            <div className="h-8 w-px bg-border/50" />
          </>
        )}

        {/* Valor Investido */}
        <div className="flex w-32 shrink-0 flex-col">
          <span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest">
            Valor Investido
          </span>
          <span className="mt-1 text-sm font-semibold text-foreground">
            {formatCurrency(data.valorInvestido)}
          </span>
        </div>

        <div className="h-8 w-px bg-border/50" />

        {/* Valor Atual */}
        <div className="flex w-32 shrink-0 flex-col">
          <span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest">
            Valor Atualizado
          </span>
          <span
            className={`mt-1 text-sm font-bold ${data.valorAtual >= data.valorInvestido ? "text-chart-1" : "text-chart-5"}`}
          >
            {formatCurrency(data.valorAtual)}
          </span>
        </div>

        <div className="h-8 w-px bg-border/50" />

        {/* Data Atualização */}
        <div className="flex w-28 shrink-0 flex-col">
          <span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest">
            Atualização
          </span>
          <span className="mt-1 text-sm font-semibold text-foreground">
            {formatDate(data.dataAtualizacao)}
          </span>
        </div>

        {/* Espaçamento */}
        <div className="flex-1" />

        {/* Botões */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEditClick()}
            className="flex items-center gap-1.5 border-border/50 hover:border-primary/40 hover:bg-primary/8 hover:text-primary transition-all"
          >
            <Pencil className="h-3.5 w-3.5" />
            Editar
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 text-muted-foreground/60 hover:text-foreground hover:bg-muted/40 transition-all"
            onClick={() => {}}
          >
            <History className="h-4 w-4" />
            Histórico
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

// --- Fake Data ---
export const fakeItemsStock: ItemCardData[] = [
  {
    id: "1",
    sigla: "ITSA3",
    name: "ITAUSA S.A.",
    quantidade: 150,
    valorInvestido: 45000.0,
    valorAtual: 47000.0,
    dataAtualizacao: "2024-05-28T10:30:00Z",
  },
  {
    id: "2",
    sigla: "PETR4",
    name: "PETROBRAS S.A.",
    quantidade: 320,
    valorInvestido: 8750.5,
    valorAtual: 9000.0,
    dataAtualizacao: "2024-05-27T14:15:00Z",
  },
  {
    id: "3",
    sigla: "CMIG4",
    name: "Cemig Energia MG S.A.",
    quantidade: 87,
    valorInvestido: 12300.75,
    valorAtual: 12500.0,
    dataAtualizacao: "2024-05-26T09:00:00Z",
  },
];

// --- Fake Data ---
export const fakeItemsFixed: ItemCardData[] = [
  {
    id: "1",
    name: "Itaú Crédito Bancário Renda Fixa Crédito Privado",
    dataInicial: "15/05/2024",
    valorInvestido: 30000.0,
    valorAtual: 45000.0,
    dataAtualizacao: "2024-05-28T10:30:00Z",
  },
  {
    id: "2",
    name: "Nubank Caixinha",
    dataInicial: "20/05/2024",
    valorInvestido: 5000.0,
    valorAtual: 8750.5,
    dataAtualizacao: "2024-05-27T14:15:00Z",
  },
];
