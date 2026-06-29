"use client";
import React, { createContext, useState, useContext } from "react";
import type {
  TAssetType,
  TAssetList,
  TAssetTypeList,
  TPatchCurrentPriceRequest,
} from "@/schemas/assetSchema";
import {
  useQuery,
  useMutation,
  useQueryClient,
  UseMutationResult,
} from "@tanstack/react-query";
import { getAssetSystemData, patchCurrentPrice } from "@/services/assetService";
import { useAuth } from "./AuthProvider";
// ==============================================================================
//                                  CONTEXT
// ==============================================================================
// Esta interface define a estrutura do contexto de ativos (AssetContextProps), que inclui o tipo de ativo atual selecionado (currentAssetType), a lista completa de ativos (assetList), a lista de tipos de ativos (assetTypeList), a função para atualizar o tipo de ativo atual selecionado (setCurrentAssetType) e a mutação para atualizar o preço atual de um ativo (currentPriceMutation).
interface AssetContextProps {
  currentAssetType: TAssetType | null;
  assetList: TAssetList;
  assetTypeList: TAssetTypeList;
  setCurrentAssetType: React.Dispatch<React.SetStateAction<TAssetType | null>>;
  currentPriceMutation: UseMutationResult<
    void,
    Error,
    TPatchCurrentPriceRequest,
    unknown
  >;
}
// Este objeto inicializa o contexto de ativos (AssetContext) com valores padrão, incluindo um tipo de ativo atual selecionado nulo, uma lista vazia de ativos, uma lista vazia de tipos de ativos, uma função vazia para atualizar o tipo de ativo atual selecionado e uma mutação de preço atual vazia.
const initialAssetContext: AssetContextProps = {
  currentAssetType: null,
  assetList: [],
  assetTypeList: [],
  setCurrentAssetType: () => {},
  currentPriceMutation: {} as UseMutationResult<
    void,
    Error,
    TPatchCurrentPriceRequest,
    unknown
  >,
};

const AssetContext = createContext<AssetContextProps>(initialAssetContext);
// Este componente é o provedor do contexto de ativos (AssetProvider), que envolve os componentes filhos e fornece o contexto de ativos para eles. Ele utiliza o hook useQuery para buscar a lista de ativos e tipos de ativos da API, o hook useMutation para criar uma mutação que atualiza o preço atual de um ativo, e o hook useState para gerenciar o tipo de ativo atual selecionado.
export default function AssetProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentAssetType, setCurrentAssetType] = useState<TAssetType | null>(
    null,
  );
  const { isAuthenticated } = useAuth();

  const { data } = useQuery({
    queryKey: ["assetList"],
    queryFn: getAssetSystemData,
    enabled: isAuthenticated,
  });

  const queryClient = useQueryClient();

  const currentPriceMutation = useMutation({
    mutationFn: (args: TPatchCurrentPriceRequest) => patchCurrentPrice(args),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assetList"] });
      queryClient.invalidateQueries({ queryKey: ["walletList"] });
      queryClient.invalidateQueries({ queryKey: ["transactionList"] });
    },
  });

  return (
    <AssetContext.Provider
      value={{
        currentAssetType,
        assetList: data?.assetList || [],
        assetTypeList: data?.assetTypeList || [],
        setCurrentAssetType,
        currentPriceMutation,
      }}
    >
      {children}
    </AssetContext.Provider>
  );
}

export const useAsset = () => {
  const assetContext = useContext(AssetContext);
  if (!assetContext) {
    throw new Error("useAsset should be inside a AssetProvider");
  }

  return assetContext;
};
