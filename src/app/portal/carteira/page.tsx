"use client";
import { Suspense } from "react";
export const dynamic = "force-dynamic";
import AssetCategoryTable from "@/components/chart-objects/AssetCategoryTable";
import { useSearchParams } from "next/navigation";
import {
  AssetType,
  ItemCardData,
  fakeItemsFiis,
  fakeItemsStock,
  fakeItemsFixed,
} from "@/components/investmentsList/WalletCard";
import WalletCard from "@/components/investmentsList/WalletCard";

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
  acoes: fakeItemsStock,
  "fundos-imobiliarios": fakeItemsFiis,
  "renda-fixa": fakeItemsFixed,
};

export default function Carteira() {
  return (
    <Suspense>
      <CarteiraContent />
    </Suspense>
  );
}

function CarteiraContent() {
  const searchParams = useSearchParams();

  const asset = (searchParams.get("asset") as AssetType) || null;
  const items = asset ? (itemsByAsset[asset] ?? []) : [];

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
      <section className="flex w-full flex-col items-center gap-5">
        {/* Cabeçalho da página */}
        <div className="flex w-full items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              {carteiraMap[asset as TCarteiraItem]?.title}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground/60">
              Visão detalhada dos seus ativos
            </p>
          </div>
        </div>

        {/* Linha divisória */}
        <div className="w-full h-px bg-linear-to-r from-transparent via-border/60 to-transparent" />

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
              <WalletCard asset={asset as AssetType} data={item} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
