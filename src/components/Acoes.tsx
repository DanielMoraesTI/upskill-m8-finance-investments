"use client";

import { CardValues } from "@/components/cardsValues/CardValues";
import { ItemCard, fakeItems } from "./investmentsList/StockList";

export default function Acoes() {
  return (
    <div className="flex flex-col w-full max-w-7xl grid-cols-1 items-start justify-items-center gap-4 md:grid-cols-2">
      <section className="flex w-full flex-col items-center gap-6">
        <h1 className="text-2xl font-bold">Ações</h1>
        <CardValues title="Ações" value="R$ 10.000,00" />
        <ul className="flex w-full flex-col gap-3">
          {fakeItems.map((item) => (
            <li key={item.id}>
              <ItemCard data={item} />
            </li>
          ))}
        </ul>
      </section>      
    </div>
  );
}
