/**
 * PHTS System - Express Type Extensions
 *
 * Extends Express Request interface to include authenticated user
 *
 * Date: 2025-12-30
 */

import { JwtPayload } from './auth.js';

declare global {
  namespace Express {
    /**
     * Extend Express Request interface to include user from JWT token
     * This allows TypeScript to recognize req.user in protected routes
     */
    interface Request {
      user?: JwtPayload;
    }
  }
}

export {};
