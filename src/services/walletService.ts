import { TWalletList, WalletListResponseSchema } from "@/schemas/walletSchema";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
// Esta função assíncrona busca a lista de carteiras (wallets) do sistema, fazendo uma requisição GET para o endpoint "/portal/wallet". Ela trata erros de rede e valida a resposta usando o esquema WalletListResponseSchema, retornando a lista de carteiras se a resposta for válida.
export async function getWalletList(): Promise<TWalletList> {
    try {
        const response = await fetch(`${API_URL}/portal/wallet`, {
            method: "GET",
    });

    if (!response.ok) {
        throw new Error("Failed to fetch wallet system data");
    }

    const data = await response.json();
    const parsed = WalletListResponseSchema.safeParse(data);

    if (!parsed.success) {
        throw new Error("Invalid wallet system data");
    }

    return parsed.data.walletList;

    } catch (error) {
        console.error(error);
        throw new Error ("An error occurred while fetching wallet system data")
    }
}
// Esta função assíncrona atualiza os dados de uma carteira específica, identificada pelo ID, enviando uma requisição PUT para o endpoint "/portal/wallet/{id}" com os dados da carteira a serem atualizados. Ela trata erros de rede e valida a resposta, lançando erros apropriados em caso de falha.
export async function updateWalletEntry(id: number, walletData: Partial<Omit<TWalletList[number], "id" | "created_at" | "updated_at">>): Promise<void> {
    try {
        const response = await fetch(`${API_URL}/portal/wallet/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(walletData),
        });

        if (!response.ok) {
            throw new Error("Failed to update wallet entry");
        }
    } catch (error) {
        console.error(error);
        throw new Error("An error occurred while updating wallet entry");
    }
}
// Esta Interface define os parâmetros necessários para atualizar a renda de uma carteira, incluindo o ID da carteira e o novo valor de renda a ser atualizado.
export interface IPatchWalletIncomeParams {
    walletId: number;
    newIncome: number;
}
// Esta função assíncrona atualiza o valor final da Renda Fixa de uma carteira específica, identificada pelo ID, enviando uma requisição PATCH para o endpoint "/portal/wallet/{id}" com o novo valor de renda. Ela trata erros de rede e valida a resposta, lançando erros apropriados em caso de falha.
export async function patchWalletIncome(args: IPatchWalletIncomeParams) {
    try {
        const response = await fetch(`${API_URL}/portal/wallet/${args.walletId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ newIncome: args.newIncome }),
        });
        if (!response.ok) {
            throw new Error("Failed to update wallet income");
        }
    } catch (error) {
        console.error(error);
        throw new Error("An error occurred while updating wallet income");
    }
};
