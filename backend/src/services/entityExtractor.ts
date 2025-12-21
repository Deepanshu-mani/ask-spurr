import { streamObject } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';

// Schema for extracted entities
export const extractedEntitiesSchema = z.object({
    orderNumber: z.string().optional().describe('Order number (e.g., #12345, ORD-123)'),
    trackingNumber: z.string().optional().describe('Tracking number for shipment'),
    packageId: z.string().optional().describe('Package ID or reference number'),
    customerEmail: z.string().email().optional().describe('Customer email address'),
    productName: z.string().optional().describe('Product name or item mentioned'),
});

export type ExtractedEntities = z.infer<typeof extractedEntitiesSchema>;

/**
 * Extract entities from user message using LLM
 * @param message - User's message text
 * @returns Extracted entities
 */
export async function extractEntities(message: string): Promise<ExtractedEntities> {
    try {
        // Use structured output to extract entities
        const result = await streamObject({
            model: google('gemini-2.5-flash-lite'), 
            schema: extractedEntitiesSchema,
            prompt: `Extract any relevant customer service entities from this message. Only extract if explicitly mentioned.

Message: "${message}"

Extract:
- Order numbers (formats: #12345, ORD-123, order 12345, etc.)
- Tracking numbers (formats: 1Z999AA10123456784, tracking #123, etc.)
- Package IDs
- Email addresses
- Product names

If nothing is found, return empty object. Be precise - only extract if clearly stated.`,
        });

        // Collect the streamed object
        let entities: ExtractedEntities = {};
        for await (const partialObject of result.partialObjectStream) {
            entities = partialObject as ExtractedEntities;
        }

        return entities;
    } catch (error) {
        console.error('Entity extraction error:', error);
        // Return empty object on error
        return {};
    }
}

/**
 * Check if extracted entities contain any values
 */
export function hasEntities(entities: ExtractedEntities): boolean {
    return Object.values(entities).some(value => value !== undefined && value !== null && value !== '');
}
