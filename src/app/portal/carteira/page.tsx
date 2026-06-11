"use client";
import CardValues from "@/components/chart-objects/CardValues";
import PieLegends from "@/components/chart-objects/PieLegends";
import AssetCategoryTable from "@/components/chart-objects/AssetCategoryTable";
import { fakeItemsStock, ItemCardStock } from "@/components/investmentsList/StockList";
import { fakeItemsFixed, ItemCardFixed } from "@/components/investmentsList/FixedIncomeList";
import { fakeItemsFiis, ItemCardFiis } from "@/components/investmentsList/FiisList";
import { useSearchParams } from "next/navigation";

interface ICarteiraItemProps {
  title: string;
  value: string;
}

type TCarteiraItem = "acoes" | "fundos-imobiliarios" | "renda-fixa" | "all";

const carteiraMap: Record<TCarteiraItem, ICarteiraItemProps> = {
  acoes: {
    title: "Ações",
    value: "R$ 10.000,00",
  },
  "fundos-imobiliarios": {
    title: "Fundos Imobiliários",
    value: "R$ 20.000,00",
  },
  "renda-fixa": {
    title: "Renda Fixa",
    value: "R$ 20.000,00",
  },
  all: {
    title: "Todos os Ativos",
    value: "R$ 50.000,00",
  },
};

export default function Carteira() {
  const searchParams = useSearchParams();

  const asset = searchParams.get("asset");

  return (
    <div className="flex flex-col w-full max-w-7xl grid-cols-1 items-start justify-items-center gap-4 md:grid-cols-2">
      <section className="flex w-full flex-col items-center gap-6">
        <h1 className="text-2xl font-bold">
          {carteiraMap[asset as TCarteiraItem]?.title}
        </h1>
        <CardValues
          title={carteiraMap[asset as TCarteiraItem]?.title}
          value={carteiraMap[asset as TCarteiraItem]?.value}
        />
        {asset === "fundos-imobiliarios" && (
          <div className="flex flex-row w-full items-center justify-center gap-4 flex-1">
            {/*<PieLegends
              title="Distribuição da Carteira"
              description="Fundos de Tijolo, Fundos de Papel e Fundos Híbridos"
              data={[
                {
                  key: "tijolo",
                  label: "Fundos de Tijolo",
                  value: 10000,
                  color: "var(--chart-1)",
                },
                {
                  key: "papel",
                  label: "Fundos de Papel",
                  value: 20000,
                  color: "var(--chart-2)",
                },
                {
                  key: "hibrido",
                  label: "Fundos Híbridos",
                  value: 20000,
                  color: "var(--chart-3)",
                },
              ]}
            />*/}
            <AssetCategoryTable
              data={[
                { categoria: "Fundos de Papel", valorTotal: 20075.33 },
                { categoria: "Fundos de Tijolo", valorTotal: 32080.14 },
                { categoria: "Fundos Híbridos", valorTotal: 15000.0 },
              ]}
              titulo="Minha Carteira de FIIs"
            />
          </div>
        )}
        <ul className="flex w-full flex-col gap-3">
          {fakeItemsStock.map((item) => (
            <li key={item.id}>
              {asset === "acoes" && (
                <ItemCardStock data={item} />
              )}
            </li>
          ))}
        </ul>
        <ul className="flex w-full flex-col gap-3">
          {fakeItemsFiis.map((item) => (
            <li key={item.id}>
              {asset === "fundos-imobiliarios" && (
                <ItemCardFiis data={item} />
              )}
            </li>
          ))}
        </ul>
        <ul className="flex w-full flex-col gap-3">
          {fakeItemsFixed.map((item) => (
            <li key={item.id}>
              {asset === "renda-fixa" && (
                <ItemCardFixed data={item} />
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
