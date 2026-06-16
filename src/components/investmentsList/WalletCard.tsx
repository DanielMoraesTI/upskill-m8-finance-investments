"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pencil, History } from "lucide-react";
import { formatDate } from "@/utils/dataTypeUtils";
import { formatCurrency } from "@/utils/dataTypeUtils";
import type { TWallet } from "@/schemas/walletSchema";
import { useAsset } from "@/context/AssetProvider";

export default function WalletCard({ walletItem }: { walletItem: TWallet }) {
  const { currentAssetType, assetList } = useAsset();
  const assetType = currentAssetType?.asset_type || null;

  const currentAsset = assetList.find(
    (asset) => asset.id === walletItem.asset_id,
  );

  if (!currentAsset) return null;

  const sigla = "ticker" in currentAsset ? currentAsset.ticker : "XPTO";
  const quantity = walletItem.quantity;
  const companyName =
    "company" in currentAsset ? currentAsset.company : undefined;
  const category =
    "category" in currentAsset ? currentAsset.category : undefined;
  const initialDate = walletItem?.initial_date || "";
  const investedAmount = walletItem.total_invested;
  const actualAmount = (walletItem?.income || 0) + investedAmount;

  const handleEditClick = () => {};
  const handleHistoryClick = () => {};

  if (!assetType) return null;

  return (
    <Card className="w-full border-border/50 bg-card/80 backdrop-blur-sm shadow-sm card-hover group overflow-x-auto">
      <CardContent className="flex items-center gap-5 px-5 py-4 min-w-max">
        {/* Sigla — acoes e fundos-imobiliarios */}
        {(assetType === "Ação" || assetType === "FII") && (
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
        {assetType === "Ação" && (
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
        {assetType === "FII" && (
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
        {assetType === "Renda Fixa" && (
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
        {assetType === "Renda Fixa" && (
          <>
            <div className="flex w-28 shrink-0 flex-col">
              <span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest">
                Data Inicial
              </span>
              <Badge
                variant="secondary"
                className="mt-1 w-fit text-xs bg-secondary/60 border-border/40"
              >
                {formatDate(initialDate || new Date().toISOString())}
              </Badge>
            </div>
            <div className="h-8 w-px bg-border/50" />
          </>
        )}

        {/* Quantidade — acoes e fundos-imobiliarios */}
        {(assetType === "Ação" || assetType === "FII") && (
          <>
            <div className="flex w-24 shrink-0 flex-col">
              <span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest">
                Quantidade
              </span>
              <span className="mt-1 text-sm font-semibold text-foreground">
                {quantity}
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
            {formatCurrency(investedAmount)}
          </span>
        </div>

        <div className="h-8 w-px bg-border/50" />

        {/* Valor Atual */}
        <div className="flex w-32 shrink-0 flex-col">
          <span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest">
            Valor Atualizado
          </span>
          <span
            className={`mt-1 text-sm font-bold ${actualAmount >= investedAmount ? "text-chart-1" : "text-chart-5"}`}
          >
            {formatCurrency(actualAmount)}
          </span>
        </div>

        <div className="h-8 w-px bg-border/50" />

        {/* Data Atualização */}
        <div className="flex w-28 shrink-0 flex-col">
          <span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest">
            Atualização
          </span>
          <span className="mt-1 text-sm font-semibold text-foreground">
            {formatDate(walletItem?.updated_at || new Date().toISOString())}
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
