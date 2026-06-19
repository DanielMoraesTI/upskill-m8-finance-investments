import { TransactionListSchema, type TTransactionList, TTransactionEntryType } from "@/schemas/transactionSchema";
import db from "@/app/api/_lib/db";
import { RowDataPacket } from 'mysql2';

interface IfindAllTransactions {
    startDate?: Date;
    endDate?: Date;
    entryType: TTransactionEntryType | null;
    assetTypeId: string | null;
}

async function findAllTransactions(args: IfindAllTransactions): Promise<TTransactionList> {
    try {
        const { query, params } = buildfindAllTransactionsQuery(args);

        const [rows] = await db.query<RowDataPacket[]>(query, params);
        if (rows.length === 0) {
            throw new Error("Transaction not found");
        }

        const transactionList: TTransactionList = rows.map((row) => ({
            id: row.id,
            asset_id: row.asset_id,
            entry_type: row.entry_type,
            date: new Date(row.date).toISOString().slice(0, 10),
            quantity: row.quantity,
            unit_price: row.unit_price,
            total_value: row.total_value,
            created_at: new Date(row.created_at).toISOString().slice(0, 10),
            updated_at: new Date(row.updated_at).toISOString().slice(0, 10),
        }));

        const parsed = TransactionListSchema.safeParse(transactionList);
        if (!parsed.success) {
            console.log("Transaction List parsing error:", parsed.error);
            throw new Error("Invalid transaction list data");
        }

        return parsed.data;
    } catch (error) {
        console.error("Error fetching transaction list:", error);
        throw error;
    }
}

const transactionRepository = {
    findAllTransactions,
};
export default transactionRepository;

// ===================================================================================
//                            Helper Functions
// ===================================================================================
function buildfindAllTransactionsQuery(args: IfindAllTransactions): { query: string; params: string[] } {
    const { startDate, endDate, entryType, assetTypeId } = args;
    
    // Base query
    let query = `SELECT *
            FROM transaction t`;
    const params: string[] = [];

    // buy / sell filter
    if (entryType) {
        query += ` WHERE t.entry_type = ?`;
        params.push(entryType);
    }

    // assetTypeId filter (1 = Ação, 2 = FII, 3 = Renda Fixa)
    if (assetTypeId) {
        query += entryType ? ` AND t.asset_type_id = ?` : ` WHERE t.asset_type_id = ?`;
        params.push(assetTypeId);
    }

    // date range filter
    if (startDate) {
        query += entryType || assetTypeId ? ` AND t.date >= ?` : ` WHERE t.date >= ?`;
        params.push(startDate.toISOString().slice(0, 10));
    }
    if (endDate) {
        query += entryType || assetTypeId || startDate ? ` AND t.date <= ?` : ` WHERE t.date <= ?`;
        params.push(endDate.toISOString().slice(0, 10));
    }

    // Order by updated_at descending
    query += ` ORDER BY t.updated_at DESC`;
    return { query, params };
}