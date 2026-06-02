"use client";

import { CardValues } from "@/components/cardsValues/CardValues";

export default function Acoes() {
  return (
    <div className="grid w-full max-w-7xl grid-cols-1 items-start justify-items-center gap-4 md:grid-cols-2">
      <section className="flex w-full flex-col items-center gap-6">
        <h1 className="text-2xl font-bold">Ações</h1>
        <CardValues title="Ações" value="R$ 10.000,00" />
      </section>
    </div>
  );
}
