import { IVacancyInfo } from '../types/vacancies';

export const getVacancyIdFromLink = ({ id, aggregatorType }: IVacancyInfo) => `${id}_${aggregatorType}`;
