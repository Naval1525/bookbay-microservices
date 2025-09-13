import express from 'express';
import { register, login, getProfile } from '../controllers/userController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
// router.get('/profile', authenticateToken, getProfile);

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'user-service',
    timestamp: new Date().toISOString()
  });
});

export default router;
