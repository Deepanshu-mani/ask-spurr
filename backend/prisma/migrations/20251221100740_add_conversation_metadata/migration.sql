-- CreateTable
CREATE TABLE "ConversationMetadata" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "orderNumber" TEXT,
    "trackingNumber" TEXT,
    "packageId" TEXT,
    "customerEmail" TEXT,
    "productName" TEXT,
    "extractedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConversationMetadata_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ConversationMetadata_conversationId_key" ON "ConversationMetadata"("conversationId");

-- AddForeignKey
ALTER TABLE "ConversationMetadata" ADD CONSTRAINT "ConversationMetadata_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
