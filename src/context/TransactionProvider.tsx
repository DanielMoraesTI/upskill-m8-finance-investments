"use client";
import React, { createContext, useState, useContext, useEffect } from "react";
import type {
  TTransaction,
  TCreateTransaction,
} from "@/schemas/transactionSchema";
import { useAsset } from "./AssetProvider";
import {
  useQuery,
  useMutation,
  useQueryClient,
  UseMutationResult,
} from "@tanstack/react-query";
import {
  createTransaction,
  getTransactionList,
  updateTransaction,
  deleteTransaction,
} from "@/services/transactionService";
// ==============================================================================
//                                  CONTEXT
// ==============================================================================
// Esta interface define a estrutura do contexto de transações (TransactionContextProps), que inclui a lista completa de transações (transactionList), a lista filtrada de transações (filteredTransactionList), o ID do ativo selecionado (selectedAssetId), a função para atualizar o ID do ativo selecionado (setSelectedAssetId) e as mutações para criar, atualizar e deletar transações. Ela é utilizada para garantir a consistência dos dados relacionados às transações em todo o código, permitindo que os componentes que consomem esse contexto tenham acesso às informações necessárias e possam realizar as operações de criação, atualização e exclusão de forma segura e eficiente.
interface TransactionContextProps {
  transactionList: TTransaction[];
  filteredTransactionList: TTransaction[];
  selectedAssetId: number | null;
  setSelectedAssetId: (id: number | null) => void;
  createMutation: UseMutationResult<TTransaction, Error, TCreateTransaction>;
  deleteMutation: UseMutationResult<void, Error, number>;
  updateMutation: UseMutationResult<
    void,
    Error,
    { id: number; data: Partial<TCreateTransaction> }
  >;
}
// Este objeto inicializa o contexto de transações (TransactionContext) com valores padrão, incluindo uma lista vazia de transações, uma lista filtrada vazia, um ID de ativo selecionado nulo e mutações de criação, atualização e exclusão de transações vazias. Ele é utilizado para garantir que o contexto tenha um estado inicial consistente, permitindo que os componentes que consomem esse contexto possam acessar os dados
const initialTransactionContext: TransactionContextProps = {
  transactionList: [],
  filteredTransactionList: [],
  selectedAssetId: null,
  setSelectedAssetId: () => {},
  createMutation: {} as UseMutationResult<
    TTransaction,
    Error,
    TCreateTransaction
  >,
  deleteMutation: {} as UseMutationResult<void, Error, number>,
  updateMutation: {} as UseMutationResult<
    void,
    Error,
    { id: number; data: Partial<TCreateTransaction> }
  >,
};

const TransactionContext = createContext<TransactionContextProps>(
  initialTransactionContext,
);
// Este componente é o provedor do contexto de transações (TransactionProvider), que envolve os componentes filhos e fornece o contexto de transações para eles. Ele utiliza o hook useQuery para buscar a lista de transações da API, o hook useMutation para criar mutações que permitem criar, atualizar e deletar transações, e o hook useState para gerenciar a lista filtrada de transações e o ID do ativo selecionado. O useEffect é utilizado para filtrar a lista de transações com base no ID do ativo selecionado e no tipo de ativo selecionado, garantindo que os dados relacionados às transações sejam consistentes e sigam as regras definidas para cada tipo específico. O TransactionProvider é responsável por fornecer os dados relacionados às transações para os componentes filhos, permitindo que eles acessem as informações necessárias e possam realizar as operações de criação, atualização e exclusão de forma segura e eficiente.
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

  const createMutation = useMutation<TTransaction, Error, TCreateTransaction>({
    mutationFn: (payload) => createTransaction(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactionList"] });
      queryClient.invalidateQueries({ queryKey: ["walletList"] });
    },
  });

  const deleteMutation = useMutation<void, Error, number>({
    mutationFn: (id) => deleteTransaction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactionList"] });
      queryClient.invalidateQueries({ queryKey: ["walletList"] });
    },
  });

  const updateMutation = useMutation<
    void,
    Error,
    { id: number; data: Partial<TCreateTransaction> }
  >({
    mutationFn: ({ id, data }) => updateTransaction(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactionList"] });
      queryClient.invalidateQueries({ queryKey: ["walletList"] });
    },
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
        transactionList: transactionList || [],
        filteredTransactionList,
        selectedAssetId,
        setSelectedAssetId,
        createMutation,
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
