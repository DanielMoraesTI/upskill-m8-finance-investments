import { AssetListResponseSchema, TAssetListResponse, type TPatchCurrentPriceRequest } from "@/schemas/assetSchema";
import { getUserToken } from "@/services/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

// Esta função assíncrona busca a lista de ativos do sistema, fazendo uma requisição GET para o endpoint "/portal/assets". Ela trata erros de rede e valida a resposta usando o esquema AssetListResponseSchema, retornando a lista de ativos se a resposta for válida.
export async function getAssetSystemData(): Promise<TAssetListResponse> {
    try {
        const token = await getUserToken();

        const response = await fetch(`${API_URL}/portal/assets`, {
            method: "GET",
            headers: {
                Authorization: token,
            },
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

// Esta função assíncrona atualiza o valor do preço atual de um ativo específico, identificado pelo ID, enviando uma requisição PATCH para o endpoint "/portal/assets/{id}" com o novo valor de preço. Ela trata erros de rede e valida a resposta, lançando erros apropriados em caso de falha.
export async function patchCurrentPrice(args: TPatchCurrentPriceRequest): Promise<void> {
    try {
        const token = await getUserToken();

        const response = await fetch(`${API_URL}/portal/assets/${args.assetId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
            body: JSON.stringify(args),
        });
        if (!response.ok) {
            throw new Error("Failed to update current price");
        }
    } catch (error) {
        console.error(error);
        throw new Error("An error occurred while updating current price");
    }
};