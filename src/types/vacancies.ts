export const enum E_AGGREGATOR_TYPE {
  HH = 'HH',
  GETMATCH = 'GETMATCH',
}

export interface IVacancyInfo {
  id: string;
  aggregatorType: E_AGGREGATOR_TYPE;
}
