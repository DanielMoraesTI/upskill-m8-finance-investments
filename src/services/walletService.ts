import { TWalletList, WalletListResponseSchema } from "@/schemas/walletSchema";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

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

export interface IPatchWalletIncomeParams {
    walletId: number;
    newIncome: number;
}

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
