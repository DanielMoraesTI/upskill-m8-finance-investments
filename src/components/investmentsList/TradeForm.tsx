"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useTransaction } from "@/context/TransactionProvider";
import { useMemo } from "react";

type TradeOperacao = "comprar" | "vender" | "resgatar";
// Este componente é o formulário de negociação (TradeForm), que é utilizado para registrar operações de compra, venda ou resgate de ativos. Ele recebe props como a operação a ser realizada (comprar, vender ou resgatar), o rótulo do ativo, o ID do ativo e uma função de callback para ser chamada após uma operação bem-sucedida.
interface TradeFormProps {
  operacao: TradeOperacao;
  assetLabel: string;
  assetId?: number;
  assetType?: string | null;
  maxQuantity?: number;
  onSuccess?: () => void;
}
// Função auxiliar para sanitizar a entrada de números, removendo sinais de mais e menos.
function sanitizeUnsignedNumberInput(value: string): string {
  return value.replace(/[-+]/g, "");
}
// Função auxiliar para formatar um valor numérico em moeda brasileira (BRL).
function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
// Função auxiliar para calcular o total da operação com base na quantidade e no valor unitário.
function calcTotal(quantidade: string, valor: string): number {
  const q = parseFloat(quantidade);
  const v = parseFloat(valor.replace(",", "."));
  return !isNaN(q) && !isNaN(v) ? q * v : 0;
}

export default function TradeForm({
  operacao,
  assetLabel,
  assetId,
  assetType,
  maxQuantity,
  onSuccess,
}: TradeFormProps) {
  const isCompra = operacao === "comprar";
  const isResgatar = operacao === "resgatar";
  const isRendaFixa = assetType === "Renda Fixa";
  const { createMutation } = useTransaction();
  const [quantidade, setQuantidade] = useState(
    isResgatar || isRendaFixa ? "1" : "",
  );
  const [valor, setValor] = useState("");
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const total = useMemo(
    () => calcTotal(quantidade, valor),
    [quantidade, valor],
  );
  const quantityNumber = isRendaFixa ? 1 : parseFloat(quantidade);
  const unitPriceNumber = parseFloat(valor.replace(",", "."));
  const canConfirm =
    !!assetId &&
    Number.isFinite(unitPriceNumber) &&
    (isRendaFixa || (Number.isFinite(quantityNumber) && quantityNumber > 0)) &&
    unitPriceNumber > 0 &&
    (operacao !== "vender" ||
      maxQuantity === undefined ||
      quantityNumber <= maxQuantity);

  const title = isCompra ? "Comprar" : isResgatar ? "Resgatar" : "Vender";
  const subtitle = isCompra
    ? "Registre a compra de cotas"
    : isResgatar
      ? "Registre o resgate"
      : "Registre a venda de cotas";

  const colorClass = isCompra
    ? "bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-40"
    : "bg-rose-600 hover:bg-rose-500 text-white disabled:opacity-40";

  function handleSubmit() {
    if (!assetId) return;

    const quantityValue = isRendaFixa ? 1 : parseFloat(quantidade);
    const unitPriceValue = parseFloat(valor.replace(",", "."));
    const now = new Date();
    const transactionDate = new Date(
      now.getTime() - now.getTimezoneOffset() * 60_000,
    )
      .toISOString()
      .slice(0, 10);

    if (!Number.isFinite(quantityValue) || !Number.isFinite(unitPriceValue)) {
      return;
    }

    setFeedback(null);

    if ((!isRendaFixa && quantityValue <= 0) || unitPriceValue <= 0) {
      return;
    }

    if (
      operacao === "vender" &&
      maxQuantity !== undefined &&
      quantityValue > maxQuantity
    ) {
      setFeedback({
        type: "error",
        message: `Quantidade de venda maior que a disponível (${maxQuantity}).`,
      });
      return;
    }

    createMutation.mutate(
      {
        asset_id: assetId,
        entry_type: operacao === "comprar" ? "buy" : "sell",
        date: transactionDate,
        quantity: quantityValue,
        unit_price: unitPriceValue,
        total_value: quantityValue * unitPriceValue,
      },
      {
        onSuccess: () => {
          setFeedback({
            type: "success",
            message: `${title} registrada com sucesso.`,
          });
          setQuantidade(isResgatar || isRendaFixa ? "1" : "");
          setValor("");
          onSuccess?.();
        },
        onError: (error) => {
          setFeedback({
            type: "error",
            message: error.message || "Nao foi possivel salvar a operacao.",
          });
        },
      },
    );
  }

  return (
    <div className="flex flex-col gap-6 px-6 py-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground/60">{subtitle}</p>
        <span className="mt-1 inline-flex w-fit px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
          {assetLabel}
        </span>
      </div>

      <div className="w-full h-px bg-border/40" />

      <FieldGroup className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
        {!isRendaFixa && (
          <Field>
            <FieldLabel
              htmlFor="trade-quantidade"
              className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-widest"
            >
              Quantidade
            </FieldLabel>
            <Input
              id="trade-quantidade"
              type="number"
              min={1}
              placeholder="0"
              value={quantidade}
              readOnly={isResgatar}
              onChange={(e) =>
                setQuantidade(sanitizeUnsignedNumberInput(e.target.value))
              }
              onKeyDown={(event) => {
                if (["-", "+", "e", "E"].includes(event.key)) {
                  event.preventDefault();
                }
              }}
              className="no-number-spinner bg-muted/30 border-border/50 focus:border-primary/50 transition-colors"
            />
          </Field>
        )}

        <Field>
          <FieldLabel
            htmlFor="trade-valor"
            className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-widest"
          >
            Valor Unitário (R$)
          </FieldLabel>
          <Input
            id="trade-valor"
            type="number"
            min={0}
            step={0.01}
            placeholder="0,00"
            value={valor}
            onChange={(e) =>
              setValor(sanitizeUnsignedNumberInput(e.target.value))
            }
            onKeyDown={(event) => {
              if (["-", "+", "e", "E"].includes(event.key)) {
                event.preventDefault();
              }
            }}
            className="no-number-spinner bg-muted/30 border-border/50 focus:border-primary/50 transition-colors"
          />
        </Field>

        <Field className="sm:col-span-2">
          <FieldLabel
            htmlFor="trade-total"
            className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-widest"
          >
            Total
          </FieldLabel>
          <Input
            id="trade-total"
            readOnly
            value={total > 0 ? formatBRL(total) : ""}
            placeholder="R$ 0,00"
            className="bg-muted/20 border-border/30 text-chart-1 font-bold cursor-default"
          />
        </Field>
      </FieldGroup>

      <Button
        className={`w-full font-semibold shadow-lg transition-all duration-200 ${colorClass}`}
        disabled={!canConfirm || createMutation.isPending}
        onClick={handleSubmit}
      >
        {createMutation.isPending ? "Salvando..." : `Confirmar ${title}`}
      </Button>

      {feedback && (
        <div
          className={`rounded-md border px-3 py-2 text-sm ${
            feedback.type === "success"
              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600"
              : "border-rose-500/40 bg-rose-500/10 text-rose-600"
          }`}
        >
          {feedback.message}
        </div>
      )}
    </div>
  );
}
