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
import type { ChatMessageRequest, ChatMessageResponse, ConversationHistoryResponse } from '../types/api.js';

/**
 * POST /chat/message
 * Send a message and get AI reply
 */
export async function sendMessage(req: Request, res: Response) {
    const { message, sessionId } = req.body as ChatMessageRequest;

    // Get or create conversation
    let conversationId = sessionId;

    if (!conversationId) {
        const newConversation = await createConversation();
        conversationId = newConversation.id;
    } else {
        // Verify conversation exists
        const exists = await conversationExists(conversationId);
        if (!exists) {
            throw new AppError(404, 'Conversation not found. Please start a new conversation.');
        }
    }

    // Get conversation history for context BEFORE saving current message
    const history = await getConversationHistory(conversationId);

    // Save user message
    await saveMessage(conversationId, 'user', message.trim());

    // Generate AI response
    let aiReply = '';
    try {
        for await (const chunk of streamChatResponse(message.trim(), history)) {
            aiReply += chunk;
        }
    } catch (error) {
        console.error('Error generating AI response:', error);
        // Still save an error message to maintain conversation flow
        aiReply = "I apologize, but I'm having technical difficulties. Please try again or contact support@shopease.com.";
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
    const messages = conversation.messages.map((msg) => ({
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
