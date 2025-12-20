import { prisma } from './prisma.js';
import type { ConversationMessage } from './llmService.js';


/**
 * Create a new conversation
 */
export async function createConversation() {
    return await prisma.conversation.create({
        data: {},
    });
}

/**
 * Get conversation by ID
 */
export async function getConversation(conversationId: string) {
    return await prisma.conversation.findUnique({
        where: { id: conversationId },
        include: {
            messages: {
                orderBy: { createdAt: 'asc' },
            },
        },
    });
}

/**
 * Save a message to the database
 */
export async function saveMessage(
    conversationId: string,
    sender: 'user' | 'ai',
    text: string,
) {
    return await prisma.message.create({
        data: {
            conversationId,
            sender,
            text,
        },
    });
}

/**
 * Get conversation history formatted for LLM
 */
export async function getConversationHistory(
    conversationId: string,
): Promise<ConversationMessage[]> {
    // Only fetch the last 20 messages for context
    // We take from the end (descending) and then need to reverse them back to chronological order
    const messages = await prisma.message.findMany({
        where: { conversationId },
        orderBy: { createdAt: 'desc' },
        take: 20,
    });

    // Reverse to get chronological order (oldest to newest)
    return messages.reverse().map((msg) => ({
        sender: msg.sender,
        text: msg.text,
    }));
}

/**
 * Get all messages for a conversation
 */
export async function getMessages(conversationId: string) {
    return await prisma.message.findMany({
        where: { conversationId },
        orderBy: { createdAt: 'asc' },
    });
}

/**
 * Check if conversation exists
 */
export async function conversationExists(conversationId: string): Promise<boolean> {
    const count = await prisma.conversation.count({
        where: { id: conversationId },
    });
    return count > 0;
}
