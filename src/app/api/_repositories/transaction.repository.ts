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
        if (rows.length === 0) return [];

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

    // Seleciona apenas colunas de transaction para evitar conflito de nomes com o JOIN
    let query = "SELECT t.* FROM transaction t";

    const params: string[] = [];
    const whereClauses: string[] = [];

    // Se filtrar por tipo de ativo, precisa JOIN com asset
    if (assetTypeId) {
        query += " INNER JOIN asset a ON a.id = t.asset_id";
        whereClauses.push("a.asset_type_id = ?");
        params.push(assetTypeId);
    }

    // buy / sell filter
    if (entryType) {
        whereClauses.push("t.entry_type = ?");
        params.push(entryType);
    }

    // date range filter
    if (startDate) {
        whereClauses.push(`t.date >= ?`);
        params.push(startDate.toISOString().slice(0, 10));
    }

    if (endDate) {
        whereClauses.push(`t.date <= ?`);
        params.push(endDate.toISOString().slice(0, 10));
    }

    if (whereClauses.length > 0) {
        query += ` WHERE ${whereClauses.join(" AND ")}`;
    }

    query += ` ORDER BY t.updated_at DESC`;

    return { query, params };
}