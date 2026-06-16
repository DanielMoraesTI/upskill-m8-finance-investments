"use client";
import React, { createContext, useState, useContext } from "react";
import type { TAssetType, TAssetList, TAssetTypeList } from "@/schemas/assetSchema";
import { useQuery } from "@tanstack/react-query";
import { getAssetSystemData } from "@/services/assetService";

interface AssetContextProps {
  currentAssetType: TAssetType | null;
  assetList: TAssetList;
  assetTypeList: TAssetTypeList;
  setCurrentAssetType: React.Dispatch<React.SetStateAction<TAssetType | null>>;
}

const initialAssetContext: AssetContextProps = {
  currentAssetType: null,
  assetList: [],
  assetTypeList: [],
  setCurrentAssetType: () => {},
};

const AssetContext = createContext<AssetContextProps>(initialAssetContext);

export default function AssetProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentAssetType, setCurrentAssetType] = useState<TAssetType | null>(
    null,
  );

  const { data } = useQuery({
    queryKey: ["assetList"],
    queryFn: getAssetSystemData,
  });

  return (
    <AssetContext.Provider
      value={{
        currentAssetType,
        assetList: data?.assetList || [],
        assetTypeList: data?.assetTypeList || [],
        setCurrentAssetType,
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
