import { AssetListResponseSchema, TAssetListResponse } from "@/schemas/assetSchema";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export async function getAssetSystemData(): Promise<TAssetListResponse> {
    try {
        const response = await fetch(`${API_URL}/assets`, {
            method: "GET",
        });

        if (!response.ok) {
            throw new Error("Failed to fetch asset system data");
        }

        const data = await response.json();
        const parsed = AssetListResponseSchema.safeParse(data);

        if (!parsed.success) {
            throw new Error("Invalid asset system data");
        }

        return parsed.data;

    } catch (error) {
        console.error(error);
        throw new Error("An error occurred while fetching asset system data");
    }
}