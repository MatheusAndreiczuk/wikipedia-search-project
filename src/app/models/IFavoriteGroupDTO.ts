import { IFavoriteResultsDTO } from './IFavoriteResultsDTO';

export interface IFavoriteGroupDTO {
    id: string;
    name: string;
    color: string;
    articles: IFavoriteResultsDTO[];
}
