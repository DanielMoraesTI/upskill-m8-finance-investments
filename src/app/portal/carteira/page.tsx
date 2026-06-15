"use client";
import { Suspense } from "react";
export const dynamic = "force-dynamic";
import AssetCategoryTable from "@/components/chart-objects/AssetCategoryTable";
import { useSearchParams } from "next/navigation";
import WalletCard, {
  type AssetType,
  type ItemCardData,
} from "@/components/investmentsList/WalletCard";
import {
  fakeItemsFiis,
  fakeItemsFixed,
  fakeItemsStock,
} from "@/utils/mockData";

const carteiraMap: Record<AssetType, { title: string }> = {
  acoes: {
    title: "Ações",
  },
  "fundos-imobiliarios": {
    title: "Fundos Imobiliários",
  },
  "renda-fixa": {
    title: "Renda Fixa",
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

  const queryAsset = searchParams.get("asset");
  const asset: AssetType | null =
    queryAsset === "acoes" ||
    queryAsset === "fundos-imobiliarios" ||
    queryAsset === "renda-fixa"
      ? queryAsset
      : null;
  const items = asset ? (itemsByAsset[asset] ?? []) : [];

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
      <section className="flex w-full flex-col items-center gap-5">
        {/* Cabeçalho da página */}
        <div className="flex w-full items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              {asset ? carteiraMap[asset].title : "Carteira"}
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
          {asset &&
            items.map((item) => (
              <li key={item.id}>
                <WalletCard asset={asset} data={item} />
              </li>
            ))}
        </ul>
      </section>
    </div>
  );
}
