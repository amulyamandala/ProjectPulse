import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { hello } from '@projectpulse/shared';

import { connectDB } from './config/database';
import authRoutes from './routes/auth.routes';
import cookieParser from 'cookie-parser';

dotenv.config();

connectDB();

const app = express();
const port = process.env.PORT || 5000;

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/auth', authRoutes);

app.get('/api/v1/health', (req, res) => {
  res.json({
    status: 'ok',
    message: hello(),
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
