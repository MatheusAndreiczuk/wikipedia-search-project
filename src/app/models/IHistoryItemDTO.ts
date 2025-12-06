export type HistoryType = 'search' | 'article';

export interface IHistoryItemDTO {
  type: HistoryType;
  termOrTitle: string;
  id?: string;
  timestamp: number;
}
