import { Router } from 'express';
import { getDescriptionVacancy } from '../headHunter/getDescriptionVacancy';
import { getCustomCoverLetter } from '../headHunter/getCustomCoverLetter';
import Vacancy from '../models/Vacancy';

const router = Router();

router.get('/parse-vacancy', async (req, res) => {
  try {
    const { id } = req.query;
    console.log(id, 'parse-vacancy id');
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'Неверные данные' });
    }

    const vacancyIdFromLink = Number(id);

    const existingVacancy = await Vacancy.findOne({
      vacancyIdFromLink,
    });

    if (existingVacancy) {
      return res.json({
        description: existingVacancy.description,
      });
    }
    console.log('стоим перед дискрипшен');
    const description = await getDescriptionVacancy(id);

    if (!description) {
      return res.status(400).json({
        message: 'Что-то пошло не так при парсинге hh',
      });
    }

    const lastVacancy = await Vacancy.findOne().sort({ vacancyId: -1 });

    const newVacancy = await Vacancy.create({
      vacancyId: lastVacancy?.vacancyId || 1,
      vacancyIdFromLink,
      description,
    });

    res.json({
      description: newVacancy.description,
    });
  } catch (e) {
    console.log(e, 'попали в 500');

    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

router.get('/generate-cover-letter', async (req, res) => {
  try {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'Неверные данные' });
    }

    const vacancyIdFromLink = Number(id);

    const vacancy = await Vacancy.findOne({
      vacancyIdFromLink,
    });

    if (!vacancy?.description) {
      return res.status(400).json({ message: 'Не удалось получить описание вакансии' });
    }

    const covertLetter = await getCustomCoverLetter(vacancy.description);

    res.json({ covertLetter });
  } catch {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

export default router;
