import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import messagesRoutes from './routes/messages';
import headHunterRoutes from './routes/vacancies';
import { initializeOpenRouter } from './openAI/initializeOpenRouter';

dotenv.config();

initializeOpenRouter(process.env.OPEN_AI_TOKEN!);

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: [process.env.CLIENT_ORIGIN || 'https://paveltrety.ru', 'http://localhost:5173', 'https://paveltrety-cover-letter.vercel.app'],
    credentials: true,
  }),
);
console.log('CWD:', process.cwd());
console.log('ENV FILE MONGO:', process.env.MONGO_URI);
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('Connection error', err));

app.use('/api/messages', messagesRoutes);
app.use('/api/head-hunter', headHunterRoutes);

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => console.log(`🚀 Сервер запущен на http://localhost:${PORT}`));
