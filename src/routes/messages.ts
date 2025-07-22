import { Router, Request, Response } from 'express';
import Message from '../models/messages';

const router = Router();

// Получить все сообщения
router.get('/list', async (req: Request, res: Response) => {
  try {
    const messages = await Message.find().sort({ date: -1 });
    const convertedMessages = messages.map(({ messageId, message, date, name }) => ({
      messageId,
      name,
      message,
      date,
    }));
    res.json(convertedMessages);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Создать новое сообщение
router.post('/create', async (req: Request, res: Response) => {
  try {
    const { name, message } = req.body;

    if (!name || !message) {
      return res.status(400).json({ message: 'Отсутствуют обязательные поля' });
    }

    const lastMessage = await Message.findOne().sort({ messageId: -1 });
    const newMessageId = lastMessage ? lastMessage.messageId + 1 : 1;

    const newMessage = new Message({
      messageId: newMessageId,
      name,
      message,
    });

    const saved = await newMessage.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера епта' });
  }
});

export default router;
