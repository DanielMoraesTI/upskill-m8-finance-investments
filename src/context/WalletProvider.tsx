"use client";
import React, { createContext, useState, useContext, useEffect } from "react";
import type { TWalletList } from "@/schemas/walletSchema";
import { useAsset } from "./AssetProvider";
import { useQuery } from "@tanstack/react-query";
import { getWalletList } from "@/services/walletService";

interface WalletContextProps {
  filteredWalletList: TWalletList;
}

const initialWalletContext: WalletContextProps = {
  filteredWalletList: [],
};

const WalletContext = createContext<WalletContextProps>(initialWalletContext);

export default function WalletProvider({
  children,
}: {
  children: React.ReactNode;
}) {

const { data: walletList } = useQuery({
  queryKey: ["walletList"],
  queryFn: getWalletList,
})

  const [filteredWalletList, setFilteredWalletList] =
    useState<TWalletList>([]);

  const { currentAssetType, assetList } = useAsset();

  useEffect(() => {
    const handleFilterWallet = () => {
      if (!walletList) {
        return setFilteredWalletList([]) 
      };

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
    <WalletContext.Provider value={{ filteredWalletList }}>
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
