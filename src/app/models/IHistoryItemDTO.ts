export type HistoryType = 'search' | 'article';

export interface IHistoryItemDTO {
  type: HistoryType;
  termOrTitle: string;
  id?: string;
  timestamp: number;
}

export interface IHistoryFiltersDTO {
  order: 'newest' | 'oldest';
  initialDate?: Date;
  finalDate?: Date;
}
