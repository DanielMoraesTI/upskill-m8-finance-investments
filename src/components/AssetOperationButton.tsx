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
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import BusinessAction, { type InvestmentType } from "./BusinessAction";
// Este componente é o botão de operação de ativo (AssetOperationButton), que é um botão genérico para acionar a compra ou venda de um tipo específico de ativo. Ele abre um Sheet com o formulário BusinessAction já pré-configurado para o tipo de ativo selecionado. O AssetOperationButton recebe props como o tipo de ativo, a operação padrão (compra ou venda), um rótulo personalizado para o botão, a variante visual do botão, o tamanho do botão e classes CSS adicionais. Ele utiliza o hook useState para gerenciar o estado de abertura do Sheet e renderiza o formulário BusinessAction dentro do SheetContent, passando as props necessárias para pré-configurar o formulário com base no tipo de ativo e operação selecionados. O AssetOperationButton é essencial para fornecer uma interface de usuário intuitiva e eficiente para os usuários realizarem operações de compra e venda de ativos, garantindo que eles possam acessar rapidamente o formulário apropriado para cada tipo de ativo e operação, melhorando a experiência do usuário ao gerenciar suas operações financeiras.
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
// Esta constante define a configuração para cada tipo de ativo, incluindo o rótulo correspondente para cada tipo. Ela é utilizada para gerar dinamicamente o rótulo do botão com base no tipo de ativo selecionado, garantindo que o texto exibido seja consistente e informativo para os usuários. O ASSET_CONFIG é essencial para manter a flexibilidade e a escalabilidade do componente AssetOperationButton, permitindo que novos tipos de ativos sejam adicionados facilmente no futuro, bastando adicionar uma nova entrada na configuração com o rótulo apropriado. Ele também melhora a experiência do usuário ao fornecer rótulos claros e específicos para cada tipo de ativo, facilitando a compreensão das operações que estão sendo realizadas. O ASSET_CONFIG é uma parte fundamental do componente AssetOperationButton, garantindo que as informações exibidas sejam relevantes e personalizadas para cada tipo de ativo, melhorando a usabilidade e a eficiência do processo de compra e venda de ativos para os usuários.
export function AssetOperationButton({
  assetType,
  defaultOperacao = "compra",
  label,
  variant,
  size = "default",
  className = "",
}: AssetOperationButtonProps) {
  const [open, setOpen] = useState(false);
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
    <Sheet open={open} onOpenChange={setOpen}>
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
          lockOperacao
          onSuccess={() => setOpen(false)}
        />
      </SheetContent>
    </Sheet>
  );
}
