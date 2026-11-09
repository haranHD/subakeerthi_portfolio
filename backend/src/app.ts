import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import session from 'express-session';
import path from 'path';
import { env } from './config/env.js';
import { UPLOADS_DIR } from './config/paths.js';
import apiRoutes from './routes/index.js';
import { errorHandler } from './middlewares/errorHandler.js';

export const app = express();

// Trust reverse proxy (Render, Railway, Heroku, AWS) for secure HTTPS cookies
app.set('trust proxy', 1);

// Security Middlewares
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

const allowedOrigins = env.CORS_ORIGIN.split(',').map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const isAllowed =
        allowedOrigins.includes(origin) ||
        allowedOrigins.includes('*') ||
        origin.endsWith('.vercel.app') ||
        origin.includes('subakeerthii') ||
        origin.includes('localhost');
      if (isAllowed || env.NODE_ENV !== 'production') {
        return callback(null, origin);
      }
      return callback(null, origin);
    },
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  })
);

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Express Session
const isProd = env.NODE_ENV === 'production' || process.env.NODE_ENV === 'production';
app.use(
  session({
    name: 'subakeerthii.sid',
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
  })
);

// Static uploads directory (supports both backend/uploads and cwd uploads)
const staticUploadOptions = {
  setHeaders: (res: express.Response) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  },
};
app.use('/uploads', express.static(UPLOADS_DIR, staticUploadOptions));
if (path.resolve(process.cwd(), 'uploads') !== UPLOADS_DIR) {
  app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads'), staticUploadOptions));
}

// Health Check
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Subakeerthii MP Portfolio Backend API',
    version: '1.0.0',
  });
});

// Mount API Routes
app.use('/api/v1', apiRoutes);

// Global Error Handler
app.use(errorHandler);
