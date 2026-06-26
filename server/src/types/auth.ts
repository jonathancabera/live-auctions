import {Request} from 'express';

export interface RegisterBody {
  email: string;
  password: string;
  display_name: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface JwtPayload {
  user_id: number;
}

export interface LoginBody {
  email: string;
  password: string
}

export interface AuthRequest extends Request {
  user: JwtPayload;
}
