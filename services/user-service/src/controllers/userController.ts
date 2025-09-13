import { Request, Response } from 'express';
import { registerUser, loginUser, getUserById } from '../services/userService';
import { AuthRequest } from '../middleware/auth';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name, role } = req.body;

    // Validation
    if (!email || !password || !name) {
      res.status(400).json({ error: 'Email, password, and name are required' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters long' });
      return;
    }

    const result = await registerUser({ email, password, name, role });

    res.status(201).json({
      message: 'User registered successfully',
      data: result
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Registration failed';
    res.status(400).json({ error: errorMessage });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const result = await loginUser({ email, password });

    res.status(200).json({
      message: 'Login successful',
      data: result
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Login failed';
    res.status(401).json({ error: errorMessage });
  }
};

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const user = await getUserById(req.user.userId);

    res.status(200).json({
      message: 'Profile retrieved successfully',
      data: user
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to get profile';
    res.status(404).json({ error: errorMessage });
  }
};
