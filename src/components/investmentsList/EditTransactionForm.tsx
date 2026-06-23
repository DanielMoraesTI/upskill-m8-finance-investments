"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useTransaction } from "@/context/TransactionProvider";
import type { TTransaction } from "@/schemas/transactionSchema";

interface EditTransactionFormProps {
  transaction: TTransaction;
  assetLabel: string;
  onSuccess?: () => void;
}

function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function EditTransactionForm({
  transaction,
  assetLabel,
  onSuccess,
}: EditTransactionFormProps) {
  const { updateMutation } = useTransaction();

  const [entryType, setEntryType] = useState<"buy" | "sell">(transaction.entry_type);
  const [date, setDate] = useState(transaction.date);
  const [quantidade, setQuantidade] = useState(String(transaction.quantity));
  const [valor, setValor] = useState(String(transaction.unit_price));

  const total = () => {
    const q = parseFloat(quantidade);
    const v = parseFloat(valor.replace(",", "."));
    return !isNaN(q) && !isNaN(v) ? q * v : 0;
  };

  const canConfirm = quantidade !== "" && valor !== "" && date !== "";

  function handleSubmit() {
    updateMutation.mutate(
      {
        id: transaction.id,
        data: {
          entry_type: entryType,
          date,
          quantity: parseFloat(quantidade),
          unit_price: parseFloat(valor.replace(",", ".")),
          total_value: total(),
        },
      },
      { onSuccess },
    );
  }

  return (
    <div className="flex flex-col gap-6 px-6 py-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold text-foreground">Editar Transação</h2>
        <p className="text-sm text-muted-foreground/60">Atualize os dados da transação</p>
        <span className="mt-1 inline-flex w-fit px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
          {assetLabel}
        </span>
      </div>

      <div className="w-full h-px bg-border/40" />

      <FieldGroup className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Tipo */}
        <Field className="sm:col-span-2">
          <FieldLabel className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-widest">
            Tipo
          </FieldLabel>
          <div className="flex gap-2 mt-1">
            <button
              type="button"
              onClick={() => setEntryType("buy")}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold border transition-all ${
                entryType === "buy"
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : "bg-muted/30 text-muted-foreground border-border/50 hover:border-emerald-600/50"
              }`}
            >
              Compra
            </button>
            <button
              type="button"
              onClick={() => setEntryType("sell")}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold border transition-all ${
                entryType === "sell"
                  ? "bg-rose-600 text-white border-rose-600"
                  : "bg-muted/30 text-muted-foreground border-border/50 hover:border-rose-600/50"
              }`}
            >
              Venda
            </button>
          </div>
        </Field>

        {/* Data */}
        <Field className="sm:col-span-2">
          <FieldLabel
            htmlFor="edit-date"
            className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-widest"
          >
            Data
          </FieldLabel>
          <Input
            id="edit-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-muted/30 border-border/50 focus:border-primary/50 transition-colors"
          />
        </Field>

        {/* Quantidade */}
        <Field>
          <FieldLabel
            htmlFor="edit-quantidade"
            className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-widest"
          >
            Quantidade
          </FieldLabel>
          <Input
            id="edit-quantidade"
            type="number"
            min={1}
            placeholder="0"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
            className="bg-muted/30 border-border/50 focus:border-primary/50 transition-colors"
          />
        </Field>

        {/* Valor Unitário */}
        <Field>
          <FieldLabel
            htmlFor="edit-valor"
            className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-widest"
          >
            Valor Unitário (R$)
          </FieldLabel>
          <Input
            id="edit-valor"
            type="number"
            min={0}
            step={0.01}
            placeholder="0,00"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            className="bg-muted/30 border-border/50 focus:border-primary/50 transition-colors"
          />
        </Field>

        {/* Total */}
        <Field className="sm:col-span-2">
          <FieldLabel
            htmlFor="edit-total"
            className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-widest"
          >
            Total
          </FieldLabel>
          <Input
            id="edit-total"
            readOnly
            value={total() > 0 ? formatBRL(total()) : ""}
            placeholder="R$ 0,00"
            className="bg-muted/20 border-border/30 text-chart-1 font-bold cursor-default"
          />
        </Field>
      </FieldGroup>

      <Button
        className="w-full font-semibold shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-40 transition-all duration-200"
        disabled={!canConfirm || updateMutation.isPending}
        onClick={handleSubmit}
      >
        {updateMutation.isPending ? "Salvando..." : "Salvar Alterações"}
      </Button>
    </div>
  );
}