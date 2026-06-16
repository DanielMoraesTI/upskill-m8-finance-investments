"use client";
import { useState } from "react";
import { TransactionCard } from "@/components/investmentsList/TransactionCard";
import {
  TransactionFilter,
  FilterType,
} from "@/components/investmentsList/TransactionFilter";
import { fakeTransactions } from "@/utils/mockData";

export default function TransactionPage() {
  const [filter, setFilter] = useState<FilterType>("all");

  function handleEdit(id: string) {
    console.log("Editar transação:", id);
  }

  function handleDelete(id: string) {
    console.log("Deletar transação:", id);
  }

  // Filtragem lógica baseada no tipo selecionado ("compra" ou "venda")
  const filteredTransactions = fakeTransactions.filter((transaction) => {
    if (filter === "all") return true;
    return transaction.tipo?.toLowerCase() === filter;
  });

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
      <section className="flex w-full flex-col items-center gap-5">
        {/* Cabeçalho */}
        <div className="flex w-full flex-col items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Histórico de Transações
          </h1>
          <p className="text-sm text-muted-foreground/60">
            Todas as suas operações de compra e venda registradas
          </p>
        </div>

        {/* Linha divisória */}
        <div className="w-full h-px bg-linear-to-r from-transparent via-border/60 to-transparent" />

        {/* Filtro */}
        <TransactionFilter currentFilter={filter} onFilterChange={setFilter} />

        <ul className="flex w-full flex-col gap-3">
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction) => (
              <li key={transaction.id}>
                <TransactionCard
                  data={transaction}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </li>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-14 h-14 rounded-2xl bg-muted/50 border border-border/40 flex items-center justify-center">
                <span className="text-2xl text-muted-foreground/40">∅</span>
              </div>
              <p className="text-sm text-muted-foreground/60 text-center">
                Nenhuma transação encontrada para este filtro.
              </p>
            </div>
          )}
        </ul>
      </section>
    </div>
  );
}
