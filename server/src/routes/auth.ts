import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../db';
import { RegisterBody, JwtPayload, AuthRequest } from '../types/auth';
import { requireAuth } from '../middleware/auth';

const router = Router();

// TODO: POST /login

// Protected route to verify requireAuth end-to-end
router.get('/me', requireAuth, (req, res) => {
  res.json({ user: (req as AuthRequest).user });
});

router.post('/register', async (req, res) => {
  const { email, password, display_name } = req.body as RegisterBody;

  if (!email || !password || !display_name) {
    return res
      .status(400)
      .json({ error: 'email, password, and display_name are required fields' });
  }

  try {
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const result = await pool.query<{
      user_id: number;
      display_name: string;
      email: string;
      created_at: string;
    }>(
      `INSERT INTO users (display_name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING user_id, display_name, email, created_at`,
      [display_name, email, passwordHash],
    );

    const user = result.rows[0];

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('JWT_SECRET is not set');
      return res.status(500).json({ error: 'server misconfiguration' });
    }

    const payload: JwtPayload = { user_id: user.user_id };
    const token = jwt.sign(payload, secret, { expiresIn: '7d' });

    return res.status(201).json({ token, user });
  } catch (err: any) {
    // 23505 = Postgres unique_violation (email already exists)
    if (err?.code === '23505') {
      return res.status(409).json({ error: 'email already registered' });
    }
    console.error('register error:', err);
    return res.status(500).json({ error: 'internal server error' });
  }
});

export default router;
