"use client";
import { useMemo, useState } from "react";
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
import {
  buildPortfolioSummary,
  getWalletUpdatedValue,
} from "@/utils/portfolioMetrics";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
// Esta função de componente React renderiza a página da carteira de investimentos, exibindo informações detalhadas sobre os ativos do usuário, incluindo resumos, tabelas e botões de ação para operações de compra. Ela utiliza hooks para gerenciar o estado da ordenação dos ativos e filtra a lista de ativos com base no tipo selecionado.
export default function Carteira() {
  const { filteredWalletList } = useWallet();
  const { currentAssetType, assetList } = useAsset();
  const [sortOrder, setSortOrder] = useState<"none" | "asc" | "desc">("desc");

  const summary = buildPortfolioSummary({
    walletList: filteredWalletList,
    assetList,
  });

  const fiiPapelValue =
    summary.fiiByCategory.find((item) => item.label.includes("Papel"))?.value ||
    0;
  const fiiTijoloValue =
    summary.fiiByCategory.find((item) => item.label.includes("Tijolo"))
      ?.value || 0;
  const fiiHibridoValue =
    summary.fiiByCategory.find(
      (item) =>
        item.label.includes("Híbridos") || item.label.includes("Hibrido"),
    )?.value || 0;

  const assetType = currentAssetType?.asset_type;
  // Função auxiliar para ordenar a lista de ativos com base no valor atualizado, considerando o tipo de ordenação selecionado pelo usuário (ascendente, descendente ou sem ordenação).
  const sortedWalletList = useMemo(() => {
    if (sortOrder === "none") return filteredWalletList;

    return [...filteredWalletList].sort((a, b) => {
      const assetA = assetList.find((asset) => asset.id === a.asset_id);
      const assetB = assetList.find((asset) => asset.id === b.asset_id);

      const updatedA = getWalletUpdatedValue(a, assetA);
      const updatedB = getWalletUpdatedValue(b, assetB);

      if (sortOrder === "asc") return updatedA - updatedB;
      return updatedB - updatedA;
    });
  }, [assetList, filteredWalletList, sortOrder]);
  // Função auxiliar para determinar o título da página com base no tipo de ativo selecionado
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
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            {assetType && (
              <NativeSelect
                className="h-9 w-full sm:w-auto min-w-[160px] sm:min-w-max bg-muted/30 border-border/50 focus:border-primary/50 transition-colors"
                value={sortOrder}
                onChange={(event) =>
                  setSortOrder(event.target.value as "none" | "asc" | "desc")
                }
              >
                <NativeSelectOption value="none">
                  Sem ordenação
                </NativeSelectOption>
                <NativeSelectOption value="asc">
                  Valor Atual: menor para maior
                </NativeSelectOption>
                <NativeSelectOption value="desc">
                  Valor Atual: maior para menor
                </NativeSelectOption>
              </NativeSelect>
            )}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
              {renderActionButtons()}
            </div>
          </div>
        </div>

        {/* Linha divisória */}
        <div className="w-full h-px bg-linear-to-r from-transparent via-border/60 to-transparent" />

        {assetType === "FII" && (
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 w-full">
            <CardValues
              title="Total FIIs"
              value={formatCurrency(summary.byTypeUpdated.fii)}
              percentage="100% do portfólio"
              icon={Vault}
              highlight
            />
            <CardValues
              title="Fundos de Papel"
              value={formatCurrency(fiiPapelValue)}
              percentage={calcPct(fiiPapelValue, summary.byTypeUpdated.fii)}
              icon={FileText}
            />
            <CardValues
              title="Fundos de Tijolo"
              value={formatCurrency(fiiTijoloValue)}
              percentage={calcPct(fiiTijoloValue, summary.byTypeUpdated.fii)}
              icon={Building2}
            />
            <CardValues
              title="Fundos Híbridos"
              value={formatCurrency(fiiHibridoValue)}
              percentage={calcPct(fiiHibridoValue, summary.byTypeUpdated.fii)}
              icon={Shuffle}
            />
          </div>
        )}

        <ul className="flex w-full flex-col gap-3">
          {sortedWalletList.length > 0 &&
            sortedWalletList.map((item) => (
              <li key={`wallet-list-item-${item.id}`}>
                <WalletCard walletItem={item} />
              </li>
            ))}
        </ul>
      </section>
    </div>
  );
}
