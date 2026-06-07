import { prisma } from './prisma.js';
import type { ExtractedEntities } from './entityExtractor.js';

export interface ConversationMetadata {
    id: string;
    conversationId: string;
    orderNumber?: string | null;
    trackingNumber?: string | null;
    packageId?: string | null;
    customerEmail?: string | null;
    productName?: string | null;
    extractedAt: Date;
    updatedAt: Date;
}

/**
 * Get conversation metadata
 */
export async function getConversationMetadata(
    conversationId: string
): Promise<ConversationMetadata | null> {
    return await prisma.conversationMetadata.findUnique({
        where: { conversationId },
    });
}

/**
 * Update conversation metadata with extracted entities
 * Merges new entities with existing ones (new values override old)
 */
export async function updateConversationMetadata(
    conversationId: string,
    entities: ExtractedEntities
): Promise<ConversationMetadata> {
    // Get existing metadata
    const existing = await getConversationMetadata(conversationId);

    // Merge entities (new values override existing)
    const mergedData = {
        orderNumber: entities.orderNumber || existing?.orderNumber || null,
        trackingNumber: entities.trackingNumber || existing?.trackingNumber || null,
        packageId: entities.packageId || existing?.packageId || null,
        customerEmail: entities.customerEmail || existing?.customerEmail || null,
        productName: entities.productName || existing?.productName || null,
    };

    // Upsert metadata
    return await prisma.conversationMetadata.upsert({
        where: { conversationId },
        create: {
            conversationId,
            ...mergedData,
        },
        update: mergedData,
    });
}

/**
 * Delete conversation metadata
 */
export async function deleteConversationMetadata(conversationId: string): Promise<void> {
    await prisma.conversationMetadata
        .delete({
            where: { conversationId },
        })
        .catch(() => {
            // Ignore if doesn't exist
        });
}
