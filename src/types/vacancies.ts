export const enum E_AGGREGATOR_TYPE {
  HH = 'HH',
  GETMATCH = 'GETMATCH',
  ZARPLATA = 'ZARPLATA',
}

export interface IVacancyInfo {
  id: string;
  aggregatorType: E_AGGREGATOR_TYPE;
}
