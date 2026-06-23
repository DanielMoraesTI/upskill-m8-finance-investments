import db from "@/app/api/_lib/db";
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { TWalletList, WalletListSchema } from "@/schemas/walletSchema";

export async function findAllWallets(): Promise<TWalletList | null> {
    try {
        const [rows] = await db.query<RowDataPacket[]>("SELECT * FROM wallet");
        if (rows.length === 0) return null;
        const walletList: TWalletList = rows.map((row) => ({
            id: row.id,
            asset_id: row.asset_id,
            quantity: row.quantity,
            average_price: row.average_price,
            total_invested: row.total_invested,
            income: row.income,
            initial_date: row.initial_date ? new Date(row.initial_date).toISOString().slice(0, 10) : undefined,
            created_at: new Date(row.created_at).toISOString().slice(0, 10),
            updated_at: new Date(row.updated_at).toISOString().slice(0, 10),
        }));

        const parsed = WalletListSchema.safeParse(walletList);
        if (!parsed.success) {
            console.log("Wallet List parsing error:", parsed.error);
            throw new Error("Invalid wallet data");
        }
        return parsed.data;
    } catch (error) {
        console.error("Error in findAllWallets:", error);
        return null;
    }
}

export async function updateWalletEntry(id: number, walletData: Partial<Omit<TWalletList[number], "id" | "created_at" | "updated_at">>): Promise<void> {
    try {
        const fields = [];
        const values = [];
        for (const [key, value] of Object.entries(walletData)) {
            fields.push(`${key} = ?`);
            values.push(value);
        }
        values.push(id);

        await db.query(
            `UPDATE wallet SET ${fields.join(", ")} WHERE id = ?`,
            values
        );
    } catch (error) {
        console.error("Error in updateWalletEntry:", error);
        throw new Error("An error occurred while updating wallet entry");
    }
}

export async function updateWalletIncome(asset_id: number, income: number): Promise<void> {
    try {
        const [result] = await db.query<ResultSetHeader>(
            `UPDATE wallet SET income = ? WHERE asset_id = ?`,
            [income, asset_id]
        );
        if (result.affectedRows === 0) {
            throw new Error("No wallet entry found for the given asset_id");
        }
    } catch (error) {
        console.error("Error in updateWalletIncome:", error);
        throw new Error("An error occurred while updating wallet income");
    }
}