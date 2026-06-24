"use client";
import React, { createContext, useState, useContext, useEffect } from "react";
import type {
  TWalletList,
  TUpdateWalletIncomeRequest,
} from "@/schemas/walletSchema";
import { useAsset } from "./AssetProvider";
import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query";
import {
  getWalletList,
  patchWalletIncome
} from "@/services/walletService";
// ==============================================================================
//                                  CONTEXT
// ==============================================================================
// Esta interface define a estrutura do contexto de carteiras (WalletContextProps), que inclui a lista completa de carteiras (walletList), a lista filtrada de carteiras (filteredWalletList) e a mutação para atualizar a renda de uma carteira (walletIncomeMutation). Ela é utilizada para garantir a consistência dos dados relacionados às carteiras em todo o código, permitindo que os componentes que consomem esse contexto tenham acesso às informações necessárias e possam realizar as operações de atualização de forma segura e eficiente.
interface WalletContextProps {
  walletList: TWalletList;
  filteredWalletList: TWalletList;
  walletIncomeMutation: UseMutationResult<
    void,
    Error,
    TUpdateWalletIncomeRequest
  >;
}
// Este objeto inicializa o contexto de carteiras (WalletContext) com valores padrão, incluindo uma lista vazia de carteiras, uma lista filtrada vazia e uma mutação de renda de carteira vazia. Ele é utilizado para garantir que o contexto tenha um estado inicial consistente, permitindo que os componentes que consomem esse contexto possam acessar os dados relacionados às carteiras mesmo antes de serem carregados ou atualizados.
const initialWalletContext: WalletContextProps = {
  walletList: [],
  filteredWalletList: [],
  walletIncomeMutation: {} as UseMutationResult<
    void,
    Error,
    TUpdateWalletIncomeRequest
  >,
};

const WalletContext = createContext<WalletContextProps>(initialWalletContext);
// Este componente é o provedor do contexto de carteiras (WalletProvider), que envolve os componentes filhos e fornece o contexto de carteiras para eles. Ele utiliza o hook useQuery para buscar a lista de carteiras da API, o hook useMutation para criar uma mutação que atualiza a renda de uma carteira, e o hook useState para gerenciar a lista filtrada de carteiras. O useEffect é utilizado para filtrar a lista de carteiras com base no tipo de ativo selecionado, garantindo que os dados relacionados às carteiras sejam consistentes e sigam as regras definidas para cada tipo específico. O WalletProvider é responsável por fornecer os dados relacionados às carteiras para os componentes filhos, permitindo que eles acessem as informações necessárias e possam realizar as operações de atualização de forma segura e eficiente.
export default function WalletProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: walletList } = useQuery({
    queryKey: ["walletList"],
    queryFn: getWalletList,
  });

  const queryClient = useQueryClient();

  const walletIncomeMutation = useMutation<
    void,
    Error,
    TUpdateWalletIncomeRequest
  >({
    mutationFn: (args) => patchWalletIncome(args),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["walletList"] });
    },
  });

  const [filteredWalletList, setFilteredWalletList] = useState<TWalletList>([]);

  const { currentAssetType, assetList } = useAsset();

  useEffect(() => {
    const handleFilterWallet = () => {
      if (!walletList) {
        return setFilteredWalletList([]);
      }

      if (!currentAssetType) {
        setFilteredWalletList(walletList);
      } else {
        const filtered: TWalletList = [];
        walletList.forEach((walletItem) => {
          const assetData = assetList.find(
            (asset) => asset.id === walletItem.asset_id,
          );
          if (assetData?.asset_type_id === currentAssetType.id) {
            filtered.push(walletItem);
          }
        });
        setFilteredWalletList(filtered);
      }
    };

    handleFilterWallet();
  }, [currentAssetType, walletList, assetList]);

  return (
    <WalletContext.Provider
      value={{
        walletList: walletList || [],
        filteredWalletList,
        walletIncomeMutation,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => {
  const walletContext = useContext(WalletContext);
  if (!walletContext) {
    throw new Error("useWallet should be inside a WalletProvider");
  }

  return walletContext;
};
