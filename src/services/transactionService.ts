import { TTransaction, TCreateTransaction, TransactionSchema, TransactionListResponseSchema } from "../schemas/transactionSchema";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

// Busca a lista de transações
export async function getTransactionList(): Promise<TTransaction[]> {
    try {
        const response = await fetch(`${API_URL}/portal/transactions`, {
            method: "GET",
        });
        if (!response.ok) {
            throw new Error("Failed to fetch transaction data");
        }

        const data = await response.json();

        // Valida a resposta usando o schema
        const parsed = TransactionListResponseSchema.safeParse(data);

        if (!parsed.success) {
            throw new Error("Invalid transaction data");
        }

        // Retorna a lista de transações extratida e validada para o formato esperado em TransactionProvider
        return parsed.data.transactionList;
    } catch (error) {
        console.error(error);
        throw new Error("An error occurred while fetching transaction data");
    }
}

// Cria uma nova transação
export async function createTransaction(transactionData: TCreateTransaction): Promise<TTransaction> {
    try {
        const response = await fetch(`${API_URL}/portal/transactions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(transactionData),
        });
        if (!response.ok) {
            throw new Error("Failed to create transaction");
        }

        const data = await response.json();

        // Valida a resposta usando o schema
        const parsed = TransactionSchema.safeParse(data);

        if (!parsed.success) {
            throw new Error("Invalid transaction data");
        }

        // Retorna a transação criada e validada
        return parsed.data;
    } catch (error) {
        console.error(error);
        throw new Error("An error occurred while creating transaction");
    }
}

// Atualiza uma transação existente
export async function updateTransaction(id: number, transactionData: Partial<TCreateTransaction>): Promise<TTransaction> {
    try {
        const response = await fetch(`${API_URL}/portal/transactions/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(transactionData),
        });

        // Verifica se a resposta foi bem-sucedida
        if (!response.ok) {
            throw new Error("Failed to update transaction");
        }

        const data = await response.json();

        // Valida a resposta usando o schema
        const parsed = TransactionSchema.safeParse(data);

        if (!parsed.success) {
            throw new Error("Invalid transaction data");
        }

        // Retorna a transação atualizada e validada pelo TransactionSchema
        return parsed.data;
    }

    catch (error) {
        console.error(error);
        throw new Error("An error occurred while updating transaction");
    }
}

// Exclui uma transação existente
export async function deleteTransaction(id: number): Promise<void> {
    try {
        const response = await fetch(`${API_URL}/portal/transactions/${id}`, {
            method: "DELETE",
        });

        // Verifica se a resposta foi bem-sucedida
        if (!response.ok) {
            throw new Error("Failed to delete transaction");
        }
    } catch (error) {
        console.error(error);
        throw new Error("An error occurred while deleting transaction");
    }
}




