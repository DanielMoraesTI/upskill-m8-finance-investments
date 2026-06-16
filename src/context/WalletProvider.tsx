"use client";
import React, { createContext, useState, useContext, useEffect } from "react";
import { mockWalletList } from "@/utils/mockData";
import type { TWallet } from "@/schemas/walletSchema";
import { useAsset } from "./AssetProvider";

interface WalletContextProps {
  filteredWalletList: TWallet[];
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
  const [walletList, setWalletList] = useState<TWallet[]>(mockWalletList);
  const [filteredWalletList, setFilteredWalletList] =
    useState<TWallet[]>(walletList);

  const { currentAssetType, assetList } = useAsset();

  useEffect(() => {
    const handleFilterWallet = () => {
      if (!currentAssetType) {
        setFilteredWalletList(walletList);
      } else {
        const filtered: TWallet[] = [];
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
