import { streamText } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';

// FAQ Knowledge Base for ShopEase (fictional e-commerce store)
import { getFAQContext } from './faqService.js';

// Input validation schema
export const messageInputSchema = z.object({
    message: z
        .string()
        .trim()
        .min(1, 'Message cannot be empty')
        .max(1000, 'Message is too long (max 1000 characters)'),
    sessionId: z.string().optional(),
});

export type MessageInput = z.infer<typeof messageInputSchema>;

// Conversation history type
export interface ConversationMessage {
    sender: 'user' | 'ai';
    text: string;
}

import type { ConversationMetadata } from './metadataService.js';

/**
 * Stream LLM response for chat support agent
 * @param userMessage - User's question
 * @param conversationHistory - Previous messages in the conversation
 * @param metadata - Extracted customer metadata (order numbers, etc.)
 */
export async function* streamChatResponse(
    userMessage: string,
    conversationHistory: ConversationMessage[] = [],
    metadata?: ConversationMetadata | null,
) {
    let lastError: Error | null = null;

    try {
        // Validate input
        const validation = messageInputSchema.safeParse({ message: userMessage });
        if (!validation.success) {
            yield `Error: ${validation.error.issues[0]?.message || 'Invalid message'}`;
            return;
        }

        // Build customer context from metadata
        let customerContext = '';
        if (metadata) {
            const details: string[] = [];
            if (metadata.orderNumber) details.push(`Order Number: ${metadata.orderNumber}`);
            if (metadata.trackingNumber) details.push(`Tracking Number: ${metadata.trackingNumber}`);
            if (metadata.packageId) details.push(`Package ID: ${metadata.packageId}`);
            if (metadata.customerEmail) details.push(`Email: ${metadata.customerEmail}`);
            if (metadata.productName) details.push(`Product: ${metadata.productName}`);

            if (details.length > 0) {
                customerContext = `\n\nCUSTOMER CONTEXT:\n${details.join('\n')}`;
            }
        }

        // Build messages array with system prompt and conversation history
        const messages: any[] = [
            {
                role: 'system',
                content: `You are a helpful and friendly customer support agent for ShopEase, an e-commerce store.

Your role:
- Answer customer questions clearly and concisely
- Be polite, professional, and empathetic
- Use the information provided below to answer questions
- If you don't know something or it's not in the knowledge base, politely say so and offer to connect them with a human agent

IMPORTANT RULES:
1. Only answer based on the knowledge base provided
2. Don't make up information
3. Keep responses brief (2-3 sentences max unless more detail is needed)
4. Use a friendly, conversational tone
5. If asked about topics outside the knowledge base, say: "I don't have that information right now, but I can connect you with a human agent who can help. Would you like me to do that?"
6. **CONVERSATION MEMORY**: When the user asks "what was my last message" or "what did I just say", refer to their PREVIOUS message in the conversation history, NOT the current question they're asking.
7. **USE CUSTOMER CONTEXT**: If customer details are provided below, use them to give personalized responses. For example, if they ask "what's my order number?", use the order number from the context.

${getFAQContext()}${customerContext}`,
            },
        ];

        // Add conversation history (last 5 messages for context)
        const recentHistory = conversationHistory.slice(-5);
        console.log(`🧠 Using ${recentHistory.length} messages for context`);
        for (const msg of recentHistory) {
            messages.push({
                role: msg.sender === 'user' ? 'user' : 'assistant',
                content: msg.text,
            });
        }

        // Add current user message
        messages.push({
            role: 'user',
            content: userMessage,
        });

        // Try multiple models in case of rate limits or failures
        const models = [
            'gemini-2.5-flash-lite',
            'gemini-2.5-flash',
            'gemini-2.0-flash-exp',
            'gemini-1.5-flash',
        ];

        for (const modelName of models) {
            try {
                // Stream the LLM response using Gemini
                const result = await streamText({
                    model: google(modelName),
                    messages,
                    temperature: 0.7, // Balanced creativity
                });

                // Stream tokens individually for real-time response
                let hasContent = false;
                for await (const chunk of result.textStream) {
                    hasContent = true;
                    yield chunk;
                }

                // If we got here successfully, return
                if (hasContent) {
                    return;
                }
            } catch (error) {
                lastError = error as Error;
                console.error(`Model ${modelName} failed:`, error instanceof Error ? error.message : String(error));

                // If this is the last model, we'll fall through to error handling
                if (modelName === models[models.length - 1]) {
                    break;
                }

                // Otherwise, try the next model
                console.log(`Trying next model...`);
                continue;
            }
        }

        // If we get here, all models failed
        console.error('All LLM models failed. Last error:', lastError);
    } catch (error) {
        console.error('LLM streaming error:', error);

        // Handle specific error types with better messages
        if (lastError && lastError.message) {
            const errorMsg = lastError.message.toLowerCase();

            if (errorMsg.includes('quota') || errorMsg.includes('rate limit') || errorMsg.includes('resource_exhausted')) {
                yield "I'm experiencing high demand right now due to API rate limits. Please try again in a few moments, or I can connect you with a human agent for immediate assistance.";
            } else if (errorMsg.includes('api key') || errorMsg.includes('authentication')) {
                yield 'I apologize, but there seems to be a configuration issue with my AI service. Please contact our technical support at support@shopease.com.';
            } else if (errorMsg.includes('timeout') || errorMsg.includes('network')) {
                yield "I'm having trouble connecting to my AI service right now. Please check your internet connection and try again, or contact support@shopease.com for immediate assistance.";
            } else {
                yield "I apologize, but I'm having technical difficulties processing your request. Please try again in a moment, or email us at support@shopease.com for immediate assistance.";
            }
        } else {
            yield "I'm sorry, something went wrong on my end. Please try again or contact support@shopease.com for immediate assistance.";
        }
    }
}

/**
 * Validate message input
 * @param message - Message to validate
 * @returns Validation result with error message if invalid
 */
export function validateMessage(message: string): { valid: boolean; error?: string } {
    const validation = messageInputSchema.safeParse({ message });
    if (!validation.success) {
        return {
            valid: false,
            error: validation.error.issues[0]?.message || 'Invalid message',
        };
    }
    return { valid: true };
}