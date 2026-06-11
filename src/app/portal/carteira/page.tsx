"use client";
import CardValues from "@/components/chart-objects/CardValues";
import AssetCategoryTable from "@/components/chart-objects/AssetCategoryTable";
import { useSearchParams } from "next/navigation";
import { AssetType, ItemCardData, fakeItemsFiis, fakeItemsStock, fakeItemsFixed } from "@/components/investmentsList/WalletList";
import { ItemCard } from "@/components/investmentsList/WalletList";
import { Building2, Landmark, Wallet } from "lucide-react";

interface ICarteiraItemProps {
  title: string;
  value: string;
  icon: "Wallet" | "Building2" | "Landmark"; // Tipagem mais restrita para os ícones
}

type TCarteiraItem = "acoes" | "fundos-imobiliarios" | "renda-fixa";

const carteiraMap: Record<TCarteiraItem, ICarteiraItemProps> = {
  acoes: {
    title: "Ações",
    value: "R$ 10.000,00",
    icon: "Wallet",
  },
  "fundos-imobiliarios": {
    title: "Fundos Imobiliários",
    value: "R$ 20.000,00",
    icon: "Building2",
  },
  "renda-fixa": {
    title: "Renda Fixa",
    value: "R$ 20.000,00",
    icon: "Landmark",
  },
};

const itemsByAsset: Record<AssetType, ItemCardData[]> = {
  "acoes": fakeItemsStock,
  "fundos-imobiliarios": fakeItemsFiis,
  "renda-fixa": fakeItemsFixed,
};


export default function Carteira() {
  const searchParams = useSearchParams();

  const asset = searchParams.get("asset") as AssetType || null;
  const items = asset ? (itemsByAsset[asset] ?? []) : [];

  return (
    <div className="flex flex-col w-full max-w-7xl grid-cols-1 items-start justify-items-center gap-4 md:grid-cols-2">
      <section className="flex w-full flex-col items-center gap-6">
        <h1 className="text-2xl font-bold">
          {carteiraMap[asset as TCarteiraItem]?.title}
        </h1>
        <CardValues
          title={carteiraMap[asset as TCarteiraItem]?.title}
          value={carteiraMap[asset as TCarteiraItem]?.value}
          icon={carteiraMap[asset as TCarteiraItem]?.icon === "Wallet"
            ? Wallet
            : carteiraMap[asset as TCarteiraItem]?.icon === "Building2"
              ? Building2
              : Landmark}
        />
        {asset === "fundos-imobiliarios" && (
          <div className="flex flex-row w-full items-center justify-center gap-4 flex-1">
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
          {items.map((item) => (
            <li key={item.id}>
              <ItemCard asset={asset as AssetType} data={item} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
