/**
 * Standard API response format
 */
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

/**
 * Chat message request
 */
export interface ChatMessageRequest {
    message: string;
    sessionId?: string;
}

/**
 * Chat message response
 */
export interface ChatMessageResponse {
    reply: string;
    sessionId: string;
}

/**
 * Conversation history response
 */
export interface ConversationHistoryResponse {
    sessionId: string;
    messages: Array<{
        id: string;
        sender: 'user' | 'ai';
        text: string;
        createdAt: string;
    }>;
    createdAt: string;
}

/**
 * Error response
 */
export interface ErrorResponse {
    error: string;
    details?: Array<{
        field: string;
        message: string;
    }>;
}
