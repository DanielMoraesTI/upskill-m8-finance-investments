"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useTransaction } from "@/context/TransactionProvider";
import { useAsset } from "@/context/AssetProvider";
import {
  TransactionCard,
  type TransactionCardData,
} from "@/components/investmentsList/TransactionCard";
import type { TTransaction } from "@/schemas/transactionSchema";
import {
  TransactionFilter,
  FilterType,
} from "@/components/investmentsList/TransactionFilter";

export default function TransactionPage() {
  const [filter, setFilter] = useState<FilterType>("all");

  // Obter a função de atualização do ID do ativo selecionado a partir do TransactionProvider
  const seacrhParams = useSearchParams();
  const { selectedAssetId, setSelectedAssetId } = useTransaction();
  const asssetIdParam = seacrhParams.get("assetId");

  // Efeito para atualizar o ID do ativo selecionado com base no parâmetro da URL
  useEffect(() => {
    if (asssetIdParam) {
      setSelectedAssetId(Number(asssetIdParam));
    } else {
      // Se não houver parâmetro, limpar a seleção
      setSelectedAssetId(null);
    }
  }, [asssetIdParam, setSelectedAssetId]);

  // Ao mudar o filtro manualmente, limpa o assetId da URL
  function handleFilterChange(newFilter: FilterType) {
    setFilter(newFilter);
    setSelectedAssetId(null);

    // Limpa o parâmetro da URL sem recarregar a página
    const url = new URL(window.location.href);
    url.searchParams.delete("assetId");
    window.history.replaceState({}, "", url.toString());
  }

  function handleEdit(id: string) {
    console.log("Editar transação:", id);
  }

  function handleDelete(id: string) {
    console.log("Deletar transação:", id);
  }

  // Filtragem lógica baseada no tipo selecionado ("compra" ou "venda")
  const { filteredTransactionList } = useTransaction();
  const { assetList } = useAsset();
  type TransactionCardItem = {
    cardData: TransactionCardData;
    transaction: TTransaction;
  };

  // Aplicar o filtro adicional para "todos", "compras" ou "vendas"
  const filteredTransactions = filteredTransactionList.filter((transaction) => {
    if (filter === "all") {
      // Mostrar todas as transações
      return true;
    }
    if (filter === "compra") {
      // Mostrar apenas transações de compra (quantidade positiva)
      return transaction.entry_type === "buy";
    }
    if (filter === "venda") {
      // Mostrar apenas transações de venda (quantidade negativa)
      return transaction.entry_type === "sell";
    }
    const isAssetTypeFilter = ["acoes", "fiis", "renda_fixa"].includes(
      filter as string,
    );
    if (isAssetTypeFilter) {
      const assetData = assetList.find(
        (asset) => asset.id === transaction.asset_id,
      );
      if (!assetData) return false;

      if (filter === "acoes") {
        // Mostrar apenas transações de ações
        return assetData.asset_type_id === 1;
      }
      if (filter === "fiis") {
        // Mostrar apenas transações de fundos imobiliários
        return assetData.asset_type_id === 2;
      }
      // Mostrar apenas transações de renda fixa
      return assetData.asset_type_id === 3;
    }
    return true;
  });

  const transactionCardDataList = filteredTransactions.reduce<
    TransactionCardItem[]
  >((acc, transaction) => {
    const assetData = assetList.find(
      (asset) => asset.id === transaction.asset_id,
    );
    if (!assetData) return acc;

    const baseData = {
      id: String(transaction.id),
      tipo: transaction.entry_type === "buy" ? "compra" : "venda",
      valorTotal: transaction.total_value,
      data: transaction.date,
    } as const;

    if (assetData.asset_type_id === 1 && "ticker" in assetData) {
      const cardData: TransactionCardData = {
        ...baseData,
        asset: "acoes",
        sigla: assetData.ticker,
        quantidade: transaction.quantity,
        valorUnitario: transaction.unit_price,
      };
      acc.push({
        cardData,
        transaction,
      });
      return acc;
    }

    if (assetData.asset_type_id === 2 && "ticker" in assetData) {
      const cardData: TransactionCardData = {
        ...baseData,
        asset: "fundos-imobiliarios",
        sigla: assetData.ticker,
        quantidade: transaction.quantity,
        valorUnitario: transaction.unit_price,
      };
      acc.push({
        cardData,
        transaction,
      });
      return acc;
    }
    if (assetData.asset_type_id === 3 && "company" in assetData) {
      const cardData: TransactionCardData = {
        ...baseData,
        asset: "renda-fixa",
        name: assetData.company,
      };
      acc.push({
        cardData,
        transaction,
      });
    }
    return acc;
  }, []);

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
      <section className="flex w-full flex-col items-center gap-5">
        {/* Cabeçalho */}
        <div className="flex w-full flex-col items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Histórico de Transações
          </h1>
          <p className="text-sm text-muted-foreground/60">
            Todas as suas operações de compra e venda registradas
          </p>
        </div>

        {/* Linha divisória */}
        <div className="w-full h-px bg-linear-to-r from-transparent via-border/60 to-transparent" />

        {/* Filtro */}
        <TransactionFilter
          currentFilter={filter}
          onFilterChange={handleFilterChange}
        />

        <ul className="flex w-full flex-col gap-3">
          {transactionCardDataList.length > 0 ? (
            transactionCardDataList.map(({ cardData, transaction }) => (
              <li key={cardData.id}>
                <TransactionCard
                  data={cardData}
                  transaction={transaction}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </li>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-14 h-14 rounded-2xl bg-muted/50 border border-border/40 flex items-center justify-center">
                <span className="text-2xl text-muted-foreground/40">∅</span>
              </div>
              <p className="text-sm text-muted-foreground/60 text-center">
                Nenhuma transação encontrada para este filtro.
              </p>
            </div>
          )}
        </ul>
      </section>
    </div>
  );
}
