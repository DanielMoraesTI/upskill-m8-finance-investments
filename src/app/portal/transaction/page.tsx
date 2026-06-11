"use client";

import { TransactionCard, fakeTransactions } from "@/components/investmentsList/TransactionCard";

export default function TransactionPage() {
  function handleEdit(id: string) {
    console.log("Editar transação:", id);
  }

  function handleDelete(id: string) {
    console.log("Deletar transação:", id);
  }

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto items-center gap-4 px-4 py-6">
      <section className="flex w-full flex-col items-center gap-6">
        <h1 className="text-2xl font-bold">Histórico de Transações</h1>
        <ul className="flex w-full flex-col gap-3">
          {fakeTransactions.map((transaction) => (
            <li key={transaction.id}>
              <TransactionCard
                data={transaction}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
