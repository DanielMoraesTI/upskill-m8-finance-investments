"use client";

/**
 * AssetOperationButton
 *
 * Botão genérico para acionar compra/venda de um tipo específico de ativo.
 * Abre um Sheet com o formulário BusinessAction já pré-configurado.
 *
 * Uso:
 *   <AssetOperationButton assetType="acoes" />
 *   <AssetOperationButton assetType="fiis" defaultOperacao="venda" />
 *   <AssetOperationButton assetType="renda-fixa" label="Investir" />
 */

import { TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import BusinessAction, { type InvestmentType } from "./BusinessAction";

type OperationType = "compra" | "venda";

interface AssetOperationButtonProps {
  /** Tipo de ativo — pré-configura e bloqueia o seletor no formulário */
  assetType: "acoes" | "fiis" | "renda-fixa";
  /** Operação padrão ao abrir o sheet (padrão: "compra") */
  defaultOperacao?: OperationType;
  /** Texto personalizado para o botão */
  label?: string;
  /** Variante visual do botão */
  variant?: "default" | "outline" | "ghost" | "secondary";
  /** Tamanho do botão */
  size?: "default" | "sm" | "lg" | "icon";
  /** Classes CSS adicionais */
  className?: string;
}

const ASSET_CONFIG = {
  acoes: { label: "Ações" },
  fiis: { label: "Fundos Imobiliários" },
  "renda-fixa": { label: "Renda Fixa" },
} as const;

export function AssetOperationButton({
  assetType,
  defaultOperacao = "compra",
  label,
  variant,
  size = "default",
  className = "",
}: AssetOperationButtonProps) {
  const config = ASSET_CONFIG[assetType];
  const isCompra = defaultOperacao === "compra";

  const buttonLabel =
    label ?? (isCompra ? `Comprar ${config.label}` : `Vender ${config.label}`);

  const colorClass = variant
    ? ""
    : isCompra
      ? "bg-emerald-600 hover:bg-emerald-500 text-white"
      : "bg-rose-600 hover:bg-rose-500 text-white";

  const Icon = isCompra ? TrendingUp : TrendingDown;

  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button
            variant={variant ?? "default"}
            size={size}
            className={`gap-2 font-semibold shadow-md transition-all duration-200 ${colorClass} ${className}`}
          />
        }
      >
        <Icon className="h-4 w-4" />
        {buttonLabel}
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-full sm:max-w-lg overflow-y-auto p-0"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>{buttonLabel}</SheetTitle>
        </SheetHeader>
        <BusinessAction
          defaultInvestimento={assetType as InvestmentType}
          defaultOperacao={defaultOperacao}
          lockInvestimento
        />
      </SheetContent>
    </Sheet>
  );
}
