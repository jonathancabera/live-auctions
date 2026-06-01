import { Request, Response, NextFunction } from 'express';

// TODO: verify JWT from Authorization header and attach decoded payload to req.user

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  // your implementation here
}
