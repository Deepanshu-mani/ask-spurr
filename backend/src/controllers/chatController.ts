import type { Request, Response } from 'express';
import {
    createConversation,
    getConversation,
    saveMessage,
    getConversationHistory,
    conversationExists,
} from '../services/chatService.js';
import { streamChatResponse } from '../services/llmService.js';
import { AppError } from '../middleware/errorHandler.js';
import type {
    ChatMessageRequest,
    ChatMessageResponse,
    ConversationHistoryResponse,
} from '../types/api.js';
import { extractEntities, hasEntities } from '../services/entityExtractor.js';
import {
    updateConversationMetadata,
    getConversationMetadata,
} from '../services/metadataService.js';

/**
 * POST /chat/message
 * Send a message and get AI reply
 */
export async function sendMessage(req: Request, res: Response) {
    const { message, sessionId } = req.body as ChatMessageRequest;

    // Get or create conversation
    let conversationId: string;

    if (!sessionId) {
        const newConversation = await createConversation();
        conversationId = newConversation.id;
    } else {
        // Verify conversation exists
        const exists = await conversationExists(sessionId);
        if (!exists) {
            throw new AppError(404, 'Conversation not found. Please start a new conversation.');
        }
        conversationId = sessionId;
    }

    // Get conversation history for context BEFORE saving current message
    const history = await getConversationHistory(conversationId);
    console.log(`📚 Conversation history: ${history.length} messages`);

    // Save user message
    await saveMessage(conversationId, 'user', message.trim());

    // Extract entities before generating the reply so the current turn can use them.
    console.log(`🔎 Starting entity extraction for message: "${message.trim()}"`);
    try {
        const entities = await extractEntities(message.trim());
        console.log(`📦 Raw extracted entities:`, JSON.stringify(entities, null, 2));
        if (hasEntities(entities)) {
            console.log(`🔍 Extracted entities:`, entities);
            await updateConversationMetadata(conversationId, entities);
            console.log(`✅ Metadata updated successfully`);
        } else {
            console.log(`⚠️  No entities found in message`);
        }
    } catch (err) {
        console.error('Entity extraction failed:', err);
    }

    // Get current metadata for context after extraction
    const metadata = await getConversationMetadata(conversationId);

    // Generate AI response
    let aiReply = '';
    try {
        for await (const chunk of streamChatResponse(message.trim(), history, metadata)) {
            aiReply += chunk;
        }
    } catch (error) {
        console.error(
            '❌ Error generating AI response:',
            error instanceof Error ? error.message : String(error)
        );
        if (error instanceof Error && error.cause) {
            console.error('   Cause:', error.cause);
        }
        if (error instanceof Error && error.stack) {
            console.error('   Stack:', error.stack.split('\n').slice(0, 3).join('\n'));
        }
        // Still save an error message to maintain conversation flow
        aiReply =
            "I apologize, but I'm having technical difficulties. Please try again or contact support@spurr.com.";
    }

    // Save AI response
    await saveMessage(conversationId, 'ai', aiReply);

    // Return response
    const response: ChatMessageResponse = {
        reply: aiReply,
        sessionId: conversationId,
    };

    return res.status(200).json(response);
}

/**
 * GET /chat/:sessionId
 * Get conversation history
 */
export async function getConversationMessages(req: Request, res: Response) {
    const { sessionId } = req.params;

    if (!sessionId) {
        throw new AppError(400, 'Session ID is required');
    }

    // Get conversation
    const conversation = await getConversation(sessionId);

    if (!conversation) {
        throw new AppError(404, 'Conversation not found');
    }

    // Format messages for frontend
    const messages = conversation.Message.map((msg) => ({
        id: msg.id,
        sender: msg.sender,
        text: msg.text,
        createdAt: msg.createdAt.toISOString(),
    }));

    const response: ConversationHistoryResponse = {
        sessionId: conversation.id,
        messages,
        createdAt: conversation.createdAt.toISOString(),
    };

    return res.status(200).json(response);
}
