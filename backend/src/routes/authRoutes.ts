/**
 * PHTS System - Authentication Routes
 *
 * Defines API endpoints for authentication operations
 *
 * Date: 2025-12-30
 */

import { Router } from 'express';
import { login, getCurrentUser, logout } from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = Router();

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and return JWT token
 * @access  Public
 * @body    { citizen_id: string, password: string }
 * @returns { success: boolean, token: string, user: UserProfile }
 */
router.post('/login', login);

/**
 * @route   GET /api/auth/me
 * @desc    Get current authenticated user's profile
 * @access  Protected
 * @returns { success: boolean, data: UserProfile }
 */
router.get('/me', protect, getCurrentUser);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (client-side token removal)
 * @access  Protected
 * @returns { success: boolean, message: string }
 */
router.post('/logout', protect, logout);

export default router;
