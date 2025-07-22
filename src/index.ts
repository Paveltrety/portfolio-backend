import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import messagesRoutes from './routes/messages';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('Connection error', err));

app.use('/api/messages', messagesRoutes);

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => console.log(`🚀 Сервер запущен на http://localhost:${PORT}`));
