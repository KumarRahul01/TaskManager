import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import taskRoutes from './routes/task.routes';
import userRoutes from './routes/user.routes';
import { errorHandler } from './middlewares/error.middleware';
import cookieParser from 'cookie-parser';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/task', taskRoutes);
app.use('/api/v1/user', userRoutes);

// HealthCheck
app.get('/', (_req, res) => {
  res
    .status(200)
    .json({ status: true, message: 'Server running successfully!' });
});

// Error Handler Middleware
app.use(errorHandler);

export default app;
