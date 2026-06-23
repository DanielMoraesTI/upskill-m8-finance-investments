"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type TradeOperacao = "comprar" | "vender" | "resgatar";

interface TradeFormProps {
  operacao: TradeOperacao;
  assetLabel: string;
}

function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function calcTotal(quantidade: string, valor: string): number {
  const q = parseFloat(quantidade);
  const v = parseFloat(valor.replace(",", "."));
  return !isNaN(q) && !isNaN(v) ? q * v : 0;
}

export default function TradeForm({ operacao, assetLabel }: TradeFormProps) {
  const [quantidade, setQuantidade] = useState("");
  const [valor, setValor] = useState("");

  const isCompra = operacao === "comprar";
  const isResgatar = operacao === "resgatar";
  const total = calcTotal(quantidade, valor);
  const canConfirm = quantidade !== "" && valor !== "";

  const title = isCompra ? "Comprar" : isResgatar ? "Resgatar" : "Vender";
  const subtitle = isCompra
    ? "Registre a compra de cotas"
    : isResgatar
      ? "Registre o resgate"
      : "Registre a venda de cotas";

  const colorClass = isCompra
    ? "bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-40"
    : "bg-rose-600 hover:bg-rose-500 text-white disabled:opacity-40";

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
            onChange={(e) => setQuantidade(e.target.value)}
            className="bg-muted/30 border-border/50 focus:border-primary/50 transition-colors"
          />
        </Field>

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
            onChange={(e) => setValor(e.target.value)}
            className="bg-muted/30 border-border/50 focus:border-primary/50 transition-colors"
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
        disabled={!canConfirm}
        onClick={() => console.log({ operacao, quantidade, valor, total })}
      >
        Confirmar {title}
      </Button>
    </div>
  );
}