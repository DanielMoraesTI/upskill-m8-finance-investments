"use client";
import React, { createContext, useState, useContext, useEffect } from "react";
import type {
  TTransaction,
  TCreateTransaction,
} from "@/schemas/transactionSchema";
import { useAsset } from "./AssetProvider";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTransactionList,
  updateTransaction,
  deleteTransaction,
} from "@/services/transactionService";

interface TransactionContextProps {
  filteredTransactionList: TTransaction[];
  selectedAssetId: number | null;
  setSelectedAssetId: (id: number | null) => void;
  updateMutation: ReturnType<
    typeof useMutation<
      TTransaction,
      Error,
      { id: number; data: Partial<TTransaction> }
    >
  >;
  deleteMutation: ReturnType<typeof useMutation<void, Error, number>>;
}

const initialTransactionContext: TransactionContextProps = {
  filteredTransactionList: [],
  selectedAssetId: null,
  setSelectedAssetId: () => {},
  updateMutation: {} as ReturnType<
    typeof useMutation<
      TTransaction,
      Error,
      { id: number; data: Partial<TTransaction> }
    >
  >,
  deleteMutation: {} as ReturnType<typeof useMutation<void, Error, number>>,
};

const TransactionContext = createContext<TransactionContextProps>(
  initialTransactionContext,
);

export default function TransactionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Busca a lista de transações usando o TanStack React Query
  const { data: transactionList } = useQuery({
    queryKey: ["transactionList"],
    queryFn: getTransactionList,
  });

  const [filteredTransactionList, setFilteredTransactionList] = useState<
    TTransaction[]
  >([]);

  // Estado para armazenar o ID do ativo selecionado ao clicar em "Histórico"
  const [selectedAssetId, setSelectedAssetId] = useState<number | null>(null);

  // Obtém o tipo de ativo selecionado e a lista de ativos do AssetProvider
  const { currentAssetType, assetList } = useAsset();

  // Configura as mutações para atualizar e deletar transações
  const queryClient = useQueryClient(); // ✅

  const deleteMutation = useMutation<void, Error, number>({
    mutationFn: (id) => deleteTransaction(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["transactionList"] }),
  });

  const updateMutation = useMutation<
    TTransaction,
    Error,
    { id: number; data: Partial<TCreateTransaction> }
  >({
    mutationFn: ({ id, data }) => updateTransaction(id, data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["transactionList"] }),
  });

  // Efeito colateral unificado para filtrar a lista de transações
  useEffect(() => {
    const handleFilterTransaction = () => {
      if (!transactionList) {
        return setFilteredTransactionList([]);
      }

      let filtered = [...transactionList];

      // 1. Filtro por Histórico Específico (clique na linha da carteira)
      if (selectedAssetId !== null) {
        filtered = filtered.filter(
          (transactionItem) => transactionItem.asset_id === selectedAssetId,
        );
      }

      // 2. Filtro por Categoria Global (Ações, FIIs, etc.) vindo da Navbar/Tabs
      if (currentAssetType) {
        filtered = filtered.filter((transactionItem) => {
          const assetData = assetList.find(
            (asset) => asset.id === transactionItem.asset_id,
          );
          return assetData?.asset_type_id === currentAssetType.id;
        });
      }

      setFilteredTransactionList(filtered);
    };

    handleFilterTransaction();
  }, [currentAssetType, selectedAssetId, transactionList, assetList]);

  return (
    <TransactionContext.Provider
      value={{
        filteredTransactionList,
        selectedAssetId,
        setSelectedAssetId,
        updateMutation,
        deleteMutation,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

// Hook personalizado para acessar o contexto de transações nos componentes filhos
export const useTransaction = () => {
  const transactionContext = useContext(TransactionContext);
  if (!transactionContext) {
    throw new Error("useTransaction must be used within a TransactionProvider");
  }
  return transactionContext;
};
