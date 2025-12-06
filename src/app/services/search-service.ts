import { computed, effect, Injectable, signal } from '@angular/core';
import { WikiResponse, WikiResult } from '../models/ISearchResponseDTO';
import { IFavoriteResultsDTO } from '../models/IFavoriteResultsDTO';

@Injectable({
  providedIn: 'root',
})
export class SearchService {

  readonly searchResults = signal<WikiResult[]>([]);
  readonly currentSearchTerm = signal<string>('');
  readonly favoriteTerms = signal<string[]>([]);
  readonly favoriteResults = signal<IFavoriteResultsDTO[]>([]);
  readonly hasSearched = signal(false);
  readonly totalHits = signal<number>(0);
  readonly currentOffset = signal<number>(0);
  
  readonly hasFavorited = computed(() => this.verifyFavorite(this.currentSearchTerm()));
  readonly hasFavoritedArticle = computed(() => this.verifyFavoritedArticle(this.currentSearchTerm()));

  constructor() {
    this.loadFavoritedTerms();
    this.loadFavoriteResults();

    effect(() => {
      localStorage.setItem('favoriteTerms', JSON.stringify(this.favoriteTerms()));
      localStorage.setItem('favoriteArticles', JSON.stringify(this.favoriteResults()));
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
  }

  async getArticleContent(pageId: string): Promise<{ title: string, content: string }> {
    const response = await fetch(`https://pt.wikipedia.org/w/api.php?action=parse&pageid=${pageId}&format=json&origin=*`);
    const data = await response.json();
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
}