import { IArticleContentDTO } from './../models/IArticleContentDTO';
import { computed, effect, Injectable, signal } from '@angular/core';
import { WikiResponse, WikiResult } from '../models/ISearchResponseDTO';
import { IFavoriteResultsDTO } from '../models/IFavoriteResultsDTO';
import { IHistoryItemDTO } from '../models/IHistoryItemDTO';

@Injectable({
  providedIn: 'root',
})
export class SearchService {

  readonly searchResults = signal<WikiResult[]>([]);
  readonly currentSearchTerm = signal<string>('');
  readonly favoriteTerms = signal<string[]>([]);
  readonly favoriteResults = signal<IFavoriteResultsDTO[]>([]);
  readonly historyItems = signal<IHistoryItemDTO[]>([]);
  readonly hasSearched = signal(false);
  readonly totalHits = signal<number>(0);
  readonly currentOffset = signal<number>(0);
  
  readonly hasFavorited = computed(() => this.verifyFavorite(this.currentSearchTerm()));
  readonly hasFavoritedArticle = computed(() => this.verifyFavoritedArticle(this.currentSearchTerm()));

  constructor() {
    this.loadFavoritedTerms();
    this.loadFavoriteResults();
    this.loadHistory();

    effect(() => {
      localStorage.setItem('favoriteTerms', JSON.stringify(this.favoriteTerms()));
      localStorage.setItem('favoriteArticles', JSON.stringify(this.favoriteResults()));
      localStorage.setItem('historyItems', JSON.stringify(this.historyItems()));
    })
  }

  verifyFavorite(searchTerm: string): boolean {
    return this.favoriteTerms().includes(searchTerm) ? true : false;
  }

  verifyFavoritedArticle(pageId: string): boolean {
    return this.favoriteResults().some(article => String(article.pageId) === String(pageId));
  }

  async fetchSearchResults(searchTerm: string, offset: number = 0) {
    const response = await fetch(`https://pt.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(searchTerm)}&sroffset=${offset}&srlimit=10&format=json&origin=*`);
    const data = await response.json() as WikiResponse;
    
    if (data.query) {
      this.searchResults.set(data.query.search as WikiResult[]);
      this.totalHits.set(data.query.searchinfo?.totalhits || 0);
    } else {
      this.searchResults.set([]);
      this.totalHits.set(0);
    }
    
    this.currentSearchTerm.set(searchTerm);
    this.currentOffset.set(offset);
    this.hasSearched.set(true);

    if (offset === 0) {
      this.addToHistory({
        type: 'search',
        termOrTitle: searchTerm,
        timestamp: Date.now()
      });
    }
  }

  async getArticleContent(identifier: string): Promise<IArticleContentDTO> {
    const isId = /^\d+$/.test(identifier);
    const param = isId ? `pageid=${identifier}` : `page=${encodeURIComponent(identifier)}`;
    
    const response = await fetch(`https://pt.wikipedia.org/w/api.php?action=parse&${param}&format=json&origin=*`);
    const data = await response.json();
    
    this.addToHistory({
      type: 'article',
      termOrTitle: data.parse.title,
      id: String(data.parse.pageid),
      timestamp: Date.now()
    });

    return {
      title: data.parse.title,
      content: data.parse.text['*']
    };
  }

  setSearchTerm(searchTerm: string) {
    this.currentSearchTerm.set(searchTerm);
  }

  addFavoritedTerm(searchTerm: string) {
    if(!searchTerm.trim()) return;
    this.favoriteTerms.update((terms) => [...terms, searchTerm]);
  }

  removeFavoritedTerm(searchTerm: string) {
    this.favoriteTerms.update((terms) => terms.filter(term => term !== searchTerm));
  }

  loadFavoritedTerms(){
    const storedTerms = localStorage.getItem('favoriteTerms');
    if(storedTerms){
      const allTerms: string[] = JSON.parse(storedTerms);
      this.favoriteTerms.set(allTerms);
    }
  }

  addFavoriteResult(title: string, snippet: string, pageId: string) {
    if(!title.trim() || !snippet.trim() || !pageId.trim()) return;
    const favoriteArticle: IFavoriteResultsDTO = { title, snippet, pageId };
    this.favoriteResults.update((article) => [...article, favoriteArticle]);
  }

  removeFavoriteResult(pageId: string) {
    this.favoriteResults.update((articles) => articles.filter(article => String(article.pageId) !== String(pageId)));
  }

  loadFavoriteResults(){
    const storedResults = localStorage.getItem('favoriteArticles');
    if(storedResults){
      const allFavorites: IFavoriteResultsDTO[] = JSON.parse(storedResults);
      this.favoriteResults.set(allFavorites);
    }
  }

  loadHistory() {
    const storedHistory = localStorage.getItem('historyItems');
    if (storedHistory) {
      this.historyItems.set(JSON.parse(storedHistory));
    }
  }

  addToHistory(item: IHistoryItemDTO) {
    this.historyItems.update(items => [...items, item]);
  }

  clearHistory() {
    this.historyItems.set([]);
  }
}