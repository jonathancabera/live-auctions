import { Pool } from 'pg';

// TODO: create and export a pg Pool using DATABASE_URL from env

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
