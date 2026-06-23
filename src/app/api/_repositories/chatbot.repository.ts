import { ConversationSchema, ConversationSummarySchema, MessageSchema } from "@/schemas/chatbotSchema";
import type { TConversation, TMessage, TConversationSummary } from "@/schemas/chatbotSchema";
import db from "@/app/api/_lib/db";
import { RowDataPacket, ResultSetHeader } from 'mysql2';

const MOCK_USER_ID = 1;

async function findMessagesByConversationId(conversationId: number): Promise<TConversation | null> {
    try {
        const [rows] = await db.query<RowDataPacket[]>(
            `SELECT c.id conversationId, c.title, c.created_at conversationCreatedAt,c.updated_at conversationUpdatedAt,
            m.id messageId, m.role, m.content, m.created_at messageCreatedAt
            FROM conversation c, message m
            WHERE c.id = m.conversation_id AND c.id = ? ORDER BY m.created_at DESC
        `, [conversationId]);

        if (rows.length === 0) return null;

        const messages: Omit<TMessage, "conversationId">[] = rows.map((row) => ({
            id: row.messageId,
            role: row.role === "user" ? "user" : "model",
            content: row.content,
            createdAt: new Date(row.messageCreatedAt).toISOString(),
        }));

        const conversation: TConversation = {
            id: rows[0].conversationId,
            title: rows[0].title,
            createdAt: new Date(rows[0].conversationCreatedAt).toISOString(),
            updatedAt: new Date(rows[0].conversationUpdatedAt).toISOString(),
            messages,
        }

        const parsed = ConversationSchema.safeParse(conversation);
        if (!parsed.success) {
            console.log("Conversation parsing error:", parsed.error);
            throw new Error("Invalid conversation data");
        }

        return parsed.data;
    } catch (error) {
        console.error("Error fetching messages by conversation ID:", error);
        throw error;
    }
}

async function findAllConversationSummary(): Promise<TConversationSummary> {
    try {
        const [rows] = await db.query<RowDataPacket[]>(
            `SELECT c.id, c.title, c.updated_at
            FROM conversation c
            ORDER BY c.updated_at DESC
        `);
        if (rows.length === 0) return [];

        const conversationSummary: TConversationSummary = rows.map((row) => ({
            id: row.id,
            title: row.title,
            updatedAt: new Date(row.updated_at).toISOString(),
        }));

        const parsed = ConversationSummarySchema.safeParse(conversationSummary);
        if (!parsed.success) {
            console.log("Conversation Summary parsing error:", parsed.error);
            throw new Error("Invalid conversation summary data");
        }

        return parsed.data;
    } catch (error) {
        console.error("Error fetching conversation summary:", error);
        throw error;
    }
}

async function createConversation(title: string): Promise<TConversation> {
    try {
        const [result] = await db.query<ResultSetHeader>(
            `INSERT INTO conversation (title, user_id) VALUES (?, ?)`, [title, MOCK_USER_ID]
        );
        if (result.affectedRows === 0 || !result.insertId) {
            throw new Error("Failed to create conversation");
        }

        const conversation: TConversation = {
            id: result.insertId,
            title,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            messages: [],
        }

        const parsed = ConversationSchema.safeParse(conversation);
        if (!parsed.success) {
            console.log("Conversation parsing error:", parsed.error);
            throw new Error("Invalid conversation data");
        }

        return parsed.data;
    } catch (error) {
        console.error("Error creating conversation:", error);
        throw error;
    }
}

async function createMessage(args: Omit<TMessage, "id" | "createdAt">): Promise<TMessage> {
    try {
        const [result] = await db.query<ResultSetHeader>(
            `INSERT INTO message (conversation_id, role, content) VALUES (?, ?, ?)`, [args.conversationId, args.role, args.content]
        );
        if (result.affectedRows === 0 || !result.insertId) {
            throw new Error("Failed to create message");
        }

        const message: TMessage = {
            id: result.insertId,
            conversationId: args.conversationId,
            role: args.role,
            content: args.content,
            createdAt: new Date().toISOString(),
        }

        const parsed = MessageSchema.safeParse(message);
        if (!parsed.success) {
            console.log("Message parsing error:", parsed.error);
            throw new Error("Invalid message data");
        }

        return parsed.data;
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