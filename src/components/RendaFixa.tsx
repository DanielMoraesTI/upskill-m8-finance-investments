"use client";

import CardValues from "@/components/chart-objects/CardValues";
import { ItemCard, fakeItems } from "./investmentsList/FixedIncomeList";

export default function RendaFixa() {
  return (
    <div className="flex flex-col w-full max-w-7xl grid-cols-1 items-start justify-items-center gap-4 md:grid-cols-2">
      <section className="flex w-full flex-col items-center gap-6">
        <h1 className="text-2xl font-bold">Renda Fixa</h1>
        <CardValues title="Renda Fixa" value="R$ 20.000,00" />
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
