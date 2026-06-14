export interface RegisterBody {
  email: string;
  password: string;
  display_name: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

// What we sign into the JWT and read back off req.user in requireAuth.
export interface JwtPayload {
  user_id: number;
}
