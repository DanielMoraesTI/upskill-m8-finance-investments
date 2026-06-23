import type { TMessage } from "@/schemas/chatbotSchema";
import db from "@/app/api/_lib/db";
import { RowDataPacket, ResultSetHeader } from 'mysql2';

const MOCK_USER_ID = 1;

async function findMessagesByConversationId(conversationId: number): Promise<RowDataPacket[]> {
    try {
        const [rows] = await db.query<RowDataPacket[]>(
            `SELECT c.id conversationId, c.title, c.created_at conversationCreatedAt,c.updated_at conversationUpdatedAt,
            m.id messageId, m.role, m.content, m.created_at messageCreatedAt
            FROM conversation c, message m
            WHERE c.id = m.conversation_id AND c.id = ? ORDER BY m.created_at DESC
        `, [conversationId]);
        return rows;
    } catch (error) {
        console.error("Error fetching messages by conversation ID:", error);
        throw error;
    }
}

async function findAllConversationSummary(): Promise<RowDataPacket[]> {
    try {
        const [rows] = await db.query<RowDataPacket[]>(
            `SELECT c.id, c.title, c.updated_at
            FROM conversation c
            ORDER BY c.updated_at DESC
        `);
        return rows;
    } catch (error) {
        console.error("Error fetching conversation summary:", error);
        throw error;
    }
}

async function createConversation(title: string): Promise<ResultSetHeader> {
    try {
        const [result] = await db.query<ResultSetHeader>(
            `INSERT INTO conversation (title, user_id) VALUES (?, ?)`, [title, MOCK_USER_ID]
        );
        return result;
    } catch (error) {
        console.error("Error creating conversation:", error);
        throw error;
    }
}

async function createMessage(args: Omit<TMessage, "id" | "createdAt">): Promise<ResultSetHeader> {
    try {
        const [result] = await db.query<ResultSetHeader>(
            `INSERT INTO message (conversation_id, role, content) VALUES (?, ?, ?)`, [args.conversationId, args.role, args.content]
        );
        return result;
    } catch (error) {
        console.error("Error creating message:", error);
        throw error;
    }
}

async function updateConversationTimestamp(conversationId: number): Promise<void> {
    try {
        const [result] = await db.query<ResultSetHeader>(
            `UPDATE conversation SET updated_at = CURRENT_TIMESTAMP WHERE id = ?`, [conversationId]
        );
        if (result.affectedRows === 0) {
            throw new Error("Failed to update conversation timestamp");
        }
    } catch (error) {
        console.error("Error updating conversation timestamp:", error);
        throw error;
    }
}

async function deleteConversation(conversationId: number): Promise<boolean> {
    try {
        const [result] = await db.query<ResultSetHeader>(
            `DELETE FROM conversation WHERE id = ?`, [conversationId]
        );
        return result.affectedRows > 0;
    } catch (error) {
        console.error("Error deleting conversation:", error);
        throw error;
    }
}

const chatbotRepository = {
    findMessagesByConversationId,
    findAllConversationSummary,
    createConversation,
    createMessage,
    updateConversationTimestamp,
    deleteConversation,
};
export default chatbotRepository;