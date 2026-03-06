import { Router } from 'express';
import { getDescriptionVacancy } from '../headHunter/getDescriptionVacancy';
import { getCustomCoverLetter } from '../headHunter/getCustomCoverLetter';
import Vacancy from '../models/Vacancy';
import { IVacancyInfo } from '../types/vacancies';

const router = Router();

router.get('/parse-vacancy', async (req, res) => {
  try {
    const vacancyInfo = req.query as unknown as IVacancyInfo;
    const { id, aggregatorType } = vacancyInfo;

    if (!id || typeof id !== 'string' || !aggregatorType) {
      return res.status(400).json({ message: 'Неверные данные' });
    }

    const vacancyIdFromLink = `${id}_${aggregatorType}`;

    const existingVacancy = await Vacancy.findOne({
      vacancyIdFromLink,
    });

    if (existingVacancy) {
      return res.json({
        vacancyId: vacancyIdFromLink,
      });
    }
    const description = await getDescriptionVacancy(vacancyInfo);

    if (!description) {
      return res.status(400).json({
        message: 'Что-то пошло не так при парсинге',
      });
    }

    const lastVacancy = await Vacancy.findOne().sort({ vacancyId: -1 });

    await Vacancy.create({
      vacancyId: lastVacancy?.vacancyId ? lastVacancy?.vacancyId + 1 : 1,
      vacancyIdFromLink,
      description,
    });

    res.json({
      vacancyId: vacancyIdFromLink,
    });
  } catch (e) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

router.get('/generate-cover-letter', async (req, res) => {
  try {
    const {vacancyId} = req.query as unknown as {
      vacancyId: string;
    };

    if (!vacancyId || typeof vacancyId !== 'string') {
      return res.status(400).json({ message: 'Неверные данные' });
    }

    const vacancy = await Vacancy.findOne({
      vacancyIdFromLink: vacancyId,
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
