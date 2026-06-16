"use client";
import React, { createContext, useState, useContext } from "react";
import {
  mockStockList,
  mockFiisList,
  mockRendaFixaList,
} from "@/utils/mockData";
import type { TAssetType, TAsset } from "@/schemas/assetSchema";

interface AssetContextProps {
  currentAssetType: TAssetType | null;
  assetList: TAsset[];
  setCurrentAssetType: React.Dispatch<React.SetStateAction<TAssetType | null>>;
}

const initialAssetContext: AssetContextProps = {
  currentAssetType: null,
  assetList: [],
  setCurrentAssetType: () => {},
};

const AssetContext = createContext<AssetContextProps>(initialAssetContext);

// 2. Provider
export default function AssetProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentAssetType, setCurrentAssetType] = useState<TAssetType | null>(
    null,
  );

  const [assetList, setAssetList] = useState<TAsset[]>([
    ...mockStockList,
    ...mockFiisList,
    ...mockRendaFixaList,
  ]);

  return (
    <AssetContext.Provider
      value={{
        currentAssetType,
        assetList,
        setCurrentAssetType,
      }}
    >
      {children}
    </AssetContext.Provider>
  );
}

// 3. Usar o context
export const useAsset = () => {
  const assetContext = useContext(AssetContext);
  if (!assetContext) {
    throw new Error("useAsset should be inside a AssetProvider");
  }

  return assetContext;
};
