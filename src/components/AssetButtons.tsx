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
// Ações
// ─────────────────────────────────────────

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
      label={label ?? (operacao === "compra" ? "Novo Investimento" : "Resgatar")}
      size={size}
      className={className}
    />
  );
}
