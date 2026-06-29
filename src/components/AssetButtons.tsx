"use client";

/**
 * Botões de operação específicos por tipo de ativo.
 *
 * Cada componente é um wrapper semântico em torno de AssetOperationButton,
 * com defaults e tipagem específicos para cada rota/contexto.
 *
 * ──────────────────────────────────────────────────────────
 * StockOperationButton       → rota /acoes  ou /acoes/[ticker]
 * FIIOperationButton         → rota /fiis   ou /fiis/[ticker]
 * FixedIncomeOperationButton → rota /renda-fixa
 * ──────────────────────────────────────────────────────────
 *
 * Exemplos de uso:
 *
 *   // Página /acoes — mostra os dois botões lado a lado
 *   <StockOperationButton operacao="compra" />
 *   <StockOperationButton operacao="venda" />
 *
 *   // Página /fiis/MXRF11 — botão único de compra
 *   <FIIOperationButton />
 *
 *   // Página /renda-fixa — botão de investir
 *   <FixedIncomeOperationButton label="Novo Investimento" />
 */

import { AssetOperationButton } from "./AssetOperationButton";

type OperationType = "compra" | "venda";

// ─────────────────────────────────────────
// Configuração de rótulos por tipo de ativo
// ─────────────────────────────────────────
// Esta constante define a configuração para cada tipo de ativo, incluindo o rótulo correspondente para cada tipo. Ela é utilizada para gerar dinamicamente o rótulo do botão com base no tipo de ativo selecionado, garantindo que o texto exibido seja consistente e informativo para os usuários. O ASSET_CONFIG é essencial para manter a flexibilidade e a escalabilidade do componente AssetOperationButton, permitindo que novos tipos de ativos sejam adicionados facilmente no futuro, bastando adicionar uma nova entrada na configuração com o rótulo apropriado.

interface StockOperationButtonProps {
  operacao?: OperationType;
  label?: string;
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

/**
 * Botão de compra/venda de Ações.
 * Use nas rotas /acoes e /acoes/[ticker].
 */
export function StockOperationButton({
  operacao = "compra",
  label,
  size,
  className,
}: StockOperationButtonProps) {
  return (
    <AssetOperationButton
      assetType="acoes"
      defaultOperacao={operacao}
      label={label}
      size={size}
      className={className}
    />
  );
}

// ─────────────────────────────────────────
// Fundos Imobiliários
// ─────────────────────────────────────────

interface FIIOperationButtonProps {
  operacao?: OperationType;
  label?: string;
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

/**
 * Botão de compra/venda de Fundos Imobiliários.
 * Use nas rotas /fiis e /fiis/[ticker].
 */
export function FIIOperationButton({
  operacao = "compra",
  label,
  size,
  className,
}: FIIOperationButtonProps) {
  return (
    <AssetOperationButton
      assetType="fiis"
      defaultOperacao={operacao}
      label={label}
      size={size}
      className={className}
    />
  );
}

// ─────────────────────────────────────────
// Renda Fixa
// ─────────────────────────────────────────

interface FixedIncomeOperationButtonProps {
  operacao?: OperationType;
  label?: string;
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

/**
 * Botão de compra/venda de Renda Fixa.
 * Use na rota /renda-fixa.
 */
export function FixedIncomeOperationButton({
  operacao = "compra",
  label,
  size,
  className,
}: FixedIncomeOperationButtonProps) {
  return (
    <AssetOperationButton
      assetType="renda-fixa"
      defaultOperacao={operacao}
      label={
        label ?? (operacao === "compra" ? "Novo Investimento" : "Resgatar")
      }
      size={size}
      className={className}
    />
  );
}
