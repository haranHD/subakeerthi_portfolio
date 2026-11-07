import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('3001').transform((val) => parseInt(val, 10)),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().min(1),
  SESSION_SECRET: z.string().min(16).default('subakeerthii_secure_session_secret_2026_solvexa'),
  CORS_ORIGIN: z.string().default('http://localhost:5173,http://localhost:5174,http://localhost:5175,http://localhost:3000'),
  ADMIN_DEFAULT_EMAIL: z.string().email().default('admin@subakeerthii.com'),
  ADMIN_DEFAULT_PASSWORD: z.string().min(8).default('ChangeMe123!'),
});

export const env = envSchema.parse(process.env);
