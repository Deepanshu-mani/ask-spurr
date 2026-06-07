import type { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

/**
 * Validation schema for chat message requests
 */
export const chatMessageSchema = z.object({
    message: z
        .string()
        .trim()
        .min(1, 'Message cannot be empty')
        .max(1000, 'Message is too long (maximum 1000 characters)'),
    sessionId: z.string().optional(),
});

/**
 * Validation schema for session ID parameter
 */
export const sessionIdSchema = z.string().min(1, 'Session ID is required');

/**
 * Middleware to validate request body against a Zod schema
 */
export function validateBody(schema: z.ZodSchema) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const validated = schema.parse(req.body);
            req.body = validated;
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                    error: 'Validation failed',
                    details: error.issues.map((err) => ({
                        field: err.path.join('.'),
                        message: err.message,
                    })),
                });
            }
            next(error);
        }
    };
}

/**
 * Middleware to validate request params against a Zod schema
 */
export function validateParams(paramName: string, schema: z.ZodSchema) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const validated = schema.parse(req.params[paramName]);
            req.params[paramName] = validated as string;
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                    error: 'Invalid parameter',
                    details: error.issues.map((err) => ({
                        field: paramName,
                        message: err.message,
                    })),
                });
            }
            next(error);
        }
    };
}
