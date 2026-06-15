"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pencil, History } from "lucide-react";
import { formatDate } from "@/utils/dataTypeUtils";
import { formatCurrency } from "@/utils/dataTypeUtils";
import type { TFii, TRendaFixa, TStock } from "@/schemas/assetSchema";
import type { TWallet } from "@/schemas/walletSchema";
import type { TTransaction } from "@/schemas/transactionSchema";

// --- Types ---
export type AssetType = "acoes" | "fundos-imobiliarios" | "renda-fixa";

type BaseItemCardData = {
  id: string;
  valorInvestido: TWallet["total_invested"];
  valorAtual: number;
  dataAtualizacao: TWallet["updated_at"];
};

type StockItemCardData = BaseItemCardData & {
  sigla: TStock["ticker"];
  quantidade: TWallet["quantity"];
  name: TStock["company"];
};

type FiiItemCardData = BaseItemCardData & {
  sigla: TFii["ticker"];
  quantidade: TWallet["quantity"];
  categoria: TFii["category"];
};

type FixedIncomeItemCardData = BaseItemCardData & {
  name: TRendaFixa["company"];
  dataInicial: string | TTransaction["date"];
};

export type ItemCardData =
  | StockItemCardData
  | FiiItemCardData
  | FixedIncomeItemCardData;

type ItemCardProps = {
  asset: AssetType;
  data: ItemCardData;
};

// --- Componente ---
export default function WalletCard({ asset, data }: ItemCardProps) {
  const sigla = "sigla" in data ? data.sigla : undefined;
  const quantity = "quantidade" in data ? data.quantidade : undefined;
  const companyName = "name" in data ? data.name : undefined;
  const category = "categoria" in data ? data.categoria : undefined;
  const initialDate = "dataInicial" in data ? data.dataInicial : undefined;

  const handleEditClick = () => {};
  const handleHistoryClick = () => {};

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
                title={sigla}
              >
                {sigla}
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
                title={companyName}
              >
                {companyName}
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
                title={category}
              >
                {category}
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
                title={companyName}
              >
                {companyName}
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
                {initialDate}
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
                {quantity?.toLocaleString("pt-BR")}
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
            onClick={() => handleHistoryClick()}
          >
            <History className="h-4 w-4" />
            Histórico
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
