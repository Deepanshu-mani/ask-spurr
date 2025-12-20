import { Router } from 'express';
import { sendMessage, getConversationMessages } from '../controllers/chatController.js';
import { validateBody, validateParams, chatMessageSchema, sessionIdSchema } from '../middleware/validation.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = Router();

// POST /chat/message - Send a message and get AI reply
router.post('/message', validateBody(chatMessageSchema), asyncHandler(sendMessage));

// GET /chat/:sessionId - Get conversation history
router.get('/:sessionId', validateParams('sessionId', sessionIdSchema), asyncHandler(getConversationMessages));

export default router;
