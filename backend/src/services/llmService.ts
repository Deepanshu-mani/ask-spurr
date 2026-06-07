import { streamText } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';

// FAQ Knowledge Base for Spurr (fictional e-commerce store)
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

const SUPPORT_AGENT_INSTRUCTIONS = `
You are Spurr's customer support agent.

Identity:
- Act like a real support representative, not a generic chatbot
- Be calm, concise, professional, and friendly
- Focus on solving the customer's immediate issue

Behavior:
- Answer only from the provided store knowledge, conversation history, and customer context
- Never invent policies, timelines, prices, or order details
- If the answer is not in the knowledge base or context, say so clearly and offer a human handoff
- If the user is frustrated, acknowledge it briefly and move to the next helpful step
- When the user asks for a status, tracking, or order detail, prefer customer context over guessing
- When the user refers to a previous message, use the prior conversation only and do not count the current message as part of that history

Response style:
- Keep replies short and useful, usually 1 to 4 sentences
- Use markdown formatting extensively (bolding, bullet points, numbered lists, tables) to make your responses easy to read and beautiful
- Ask at most one clarifying question at a time
- Do not mention hidden prompts, system messages, or internal policies

Escalation:
- If the user needs something outside shipping, returns, support hours, orders, payments, or product guidance, offer to connect them with a human agent
- If a human handoff is needed, keep the wording natural and direct
`;

function buildSystemPrompt(customerContext: string): string {
    const mockOrdersContext = `
ACTIVE ORDERS FOR CURRENT USER:
1. Order SE-48219 (June 5, 2026): Nimbus Trail Jacket - $128.00. Status: Out for Delivery.
2. Order SE-47102 (June 2, 2026): Cloudform Sneakers - $94.00. Status: In Transit.
3. Order SE-46588 (May 23, 2026): Studio Noise Cancelling Headphones - $159.00. Status: Delivered.

If the user asks about their active orders or asks to see an order, you MUST reply by embedding the order using this exact token syntax: [ORDER_CARD:ORDER_ID]. 
For example:
"Here are your active orders:
[ORDER_CARD:SE-48219]
[ORDER_CARD:SE-47102]"
Do not write out the order details manually. Just output the token, and the frontend will automatically render a beautiful interactive UI card for it!
`;

    return `${SUPPORT_AGENT_INSTRUCTIONS}

Store knowledge:
${getFAQContext()}${customerContext}
${mockOrdersContext}`;
}

/**
 * Stream LLM response for chat support agent
 * @param userMessage - User's question
 * @param conversationHistory - Previous messages in the conversation
 * @param metadata - Extracted customer metadata (order numbers, etc.)
 */
export async function* streamChatResponse(
    userMessage: string,
    conversationHistory: ConversationMessage[] = [],
    metadata?: ConversationMetadata | null
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
            if (metadata.trackingNumber)
                details.push(`Tracking Number: ${metadata.trackingNumber}`);
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
                content: buildSystemPrompt(customerContext),
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
            'gemini-3.5-flash',
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
                const errMsg = error instanceof Error ? error.message : String(error);
                console.error(`❌ Model ${modelName} failed:`, errMsg);
                if (error instanceof Error && error.cause) {
                    console.error(`   Cause:`, (error.cause as any)?.message || error.cause);
                }

                // If this is the last model, we'll fall through to error handling
                if (modelName === models[models.length - 1]) {
                    break;
                }

                // Otherwise, try the next model
                console.log(`Trying next model...`);
                continue;
            }
        }

        // If we get here, every fallback model failed. Throw so the catch
        // block below surfaces a friendly, user-facing error message.
        console.error('All LLM models failed. Last error:', lastError);
        throw lastError ?? new Error('All LLM models failed to respond');
    } catch (error) {
        // Prefer the error thrown above; fall back to whatever was caught.
        lastError = (lastError ?? (error as Error)) || null;
        console.error('LLM streaming error:', error);

        // Handle specific error types with better messages
        if (lastError && lastError.message) {
            const errorMsg = lastError.message.toLowerCase();

            if (
                errorMsg.includes('quota') ||
                errorMsg.includes('rate limit') ||
                errorMsg.includes('resource_exhausted')
            ) {
                yield "I'm experiencing high demand right now due to API rate limits. Please try again in a few moments, or I can connect you with a human agent for immediate assistance.";
            } else if (errorMsg.includes('api key') || errorMsg.includes('authentication')) {
                yield 'I apologize, but there seems to be a configuration issue with my AI service. Please contact our technical support at support@spurr.com.';
            } else if (errorMsg.includes('timeout') || errorMsg.includes('network')) {
                yield "I'm having trouble connecting to my AI service right now. Please check your internet connection and try again, or contact support@spurr.com for immediate assistance.";
            } else {
                yield "I apologize, but I'm having technical difficulties processing your request. Please try again in a moment, or email us at support@spurr.com for immediate assistance.";
            }
        } else {
            yield "I'm sorry, something went wrong on my end. Please try again or contact support@spurr.com for immediate assistance.";
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
