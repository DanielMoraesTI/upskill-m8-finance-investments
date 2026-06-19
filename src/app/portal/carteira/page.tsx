"use client";
import AssetCategoryTable from "@/components/chart-objects/AssetCategoryTable";
import WalletCard from "@/components/investmentsList/WalletCard";
import { useWallet } from "@/context/WalletProvider";
import { useAsset } from "@/context/AssetProvider";
import {
  StockOperationButton,
  FIIOperationButton,
  FixedIncomeOperationButton,
} from "@/components/AssetButtons";
import { Vault, Building2, FileText, Shuffle } from "lucide-react";
import CardValues from "@/components/chart-objects/CardValues";
import { formatCurrency, calcPct } from "@/utils/dataTypeUtils";

export default function Carteira() {
  const { filteredWalletList } = useWallet();
  const { currentAssetType } = useAsset();

  const assetType = currentAssetType?.asset_type;

  const getPageTitle = () => {
    switch (assetType) {
      case "Ação":
        return "Ações";
      case "Renda Fixa":
        return assetType;
      case "FII":
        return "Fundos Imobiliários";
      default:
        return "Carteira";
    }
  };

  const renderActionButtons = () => {
    switch (assetType) {
      case "Ação":
        return <StockOperationButton operacao="compra" size="sm" />;
      case "FII":
        return <FIIOperationButton operacao="compra" size="sm" />;
      case "Renda Fixa":
        return <FixedIncomeOperationButton operacao="compra" size="sm" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
      <section className="flex w-full flex-col items-center gap-5">
        {/* Cabeçalho da página */}
        <div className="flex w-full items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              {getPageTitle()}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground/60">
              Visão detalhada dos seus ativos
            </p>
          </div>

          {/* Botões de ação — aparecem apenas quando há um tipo de ativo selecionado */}
          <div className="flex items-center gap-2">{renderActionButtons()}</div>
        </div>

        {/* Linha divisória */}
        <div className="w-full h-px bg-linear-to-r from-transparent via-border/60 to-transparent" />

        {assetType === "FII" && (
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 w-full">
            <CardValues
              title="Total FIIs"
              value={formatCurrency(20075.33 + 32080.14 + 15000.0)}
              percentage="100% do portfólio"
              icon={Vault}
              highlight
            />
            <CardValues
              title="Fundos de Papel"
              value={formatCurrency(20075.33)}
              percentage={calcPct(20075.33, 20075.33 + 32080.14 + 15000.0)}
              icon={FileText}
            />
            <CardValues
              title="Fundos de Tijolo"
              value={formatCurrency(32080.14)}
              percentage={calcPct(32080.14, 20075.33 + 32080.14 + 15000.0)}
              icon={Building2}
            />
            <CardValues
              title="Fundos Híbridos"
              value={formatCurrency(15000.0)}
              percentage={calcPct(15000.0, 20075.33 + 32080.14 + 15000.0)}
              icon={Shuffle}
            />
          </div>
        )}

        <ul className="flex w-full flex-col gap-3">
          {filteredWalletList.length > 0 &&
            filteredWalletList.map((item) => (
              <li key={`wallet-list-item-${item.id}`}>
                <WalletCard walletItem={item} />
              </li>
            ))}
        </ul>
      </section>
    </div>
  );
}
