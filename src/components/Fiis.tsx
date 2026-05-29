"use client";

import { CardFiis } from "@/components/ui/cardFiis";
import CircleFiis from "@/components/ui/CircleFiis";

export default function Fiis() {
  return (
    <div className="grid w-full max-w-7xl grid-cols-1 items-start justify-items-center gap-4 md:grid-cols-2">
        <section className="flex w-full flex-col items-center gap-6">
            <h1 className="text-2xl font-bold">Fundos Imobiliários</h1>
        <CardFiis />
        <CircleFiis />
      </section>
    </div>
  );
}
