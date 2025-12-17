import { IArticleContentDTO } from './../models/IArticleContentDTO';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { WikiResponse, WikiResult } from '../models/ISearchResponseDTO';
import { IFavoriteResultsDTO } from '../models/IFavoriteResultsDTO';
import { IHistoryItemDTO, IHistoryFiltersDTO } from '../models/IHistoryItemDTO';
import { IFavoriteGroupDTO } from '../models/IFavoriteGroupDTO';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private http = inject(HttpClient);

  readonly searchResults = signal<WikiResult[]>([]);
  readonly currentSearchTerm = signal<string>('');
  readonly favoriteTerms = signal<string[]>([]);
  readonly favoriteResults = signal<IFavoriteResultsDTO[]>([]);
  readonly favoriteGroups = signal<IFavoriteGroupDTO[]>([]);
  readonly historyItems = signal<IHistoryItemDTO[]>([]);
  readonly historyOrder = signal<IHistoryFiltersDTO['order']>('newest');
  readonly hasSearched = signal(false);
  readonly totalHits = signal<number>(0);
  readonly currentOffset = signal<number>(0);
  
  readonly hasFavorited = computed(() => this.verifyFavorite(this.currentSearchTerm()));
  readonly hasFavoritedArticle = computed(() => this.verifyFavoritedArticle(this.currentSearchTerm()));

  constructor() {
    this.loadFavoritedTerms();
    this.loadFavoriteResults();
    this.loadFavoriteGroups();
    this.loadHistory();

    effect(() => {
      localStorage.setItem('favoriteTerms', JSON.stringify(this.favoriteTerms()));
      localStorage.setItem('favoriteArticles', JSON.stringify(this.favoriteResults()));
      localStorage.setItem('favoriteGroups', JSON.stringify(this.favoriteGroups()));
      localStorage.setItem('historyItems', JSON.stringify(this.historyItems()));
    })
  }

  verifyFavorite(searchTerm: string): boolean {
    return this.favoriteTerms().includes(searchTerm) ? true : false;
  }

  verifyFavoritedArticle(pageId: string): boolean {
    return this.favoriteResults().some(article => String(article.pageId) === String(pageId));
  }

  async fetchSearchResults(searchTerm: string, offset: number = 0, language: string) {
    const data = await firstValueFrom(this.http.get<WikiResponse>(`https://${language}.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(searchTerm)}&sroffset=${offset}&srlimit=10&format=json&origin=*`));
    
    if (data.query && data.query.search) {
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
        timestamp: Date.now(),
        language: language
      });
    }
  }

  async fetchGeoSearchResults(lat: number, lon: number, radius: number = 10000) {
    const data = await firstValueFrom(this.http.get<WikiResponse>(`https://pt.wikipedia.org/w/api.php?action=query&list=geosearch&gscoord=${lat}|${lon}&gsradius=${radius}&gslimit=10&format=json&origin=*`));

    if (data.query && data.query.geosearch) {
      const results = data.query.geosearch.map((item: any) => ({
        ...item,
        snippet: `Distância da pesquisa: ${item.dist} metros`
      })) as WikiResult[];
      
      this.searchResults.set(results);
      this.totalHits.set(results.length);
    } else {
      this.searchResults.set([]);
      this.totalHits.set(0);
    }

    const locationName = await this.getReverseGeocoding(lat, lon);

    this.currentSearchTerm.set(locationName);
    this.currentOffset.set(0);
    this.hasSearched.set(true);

    this.addToHistory({
      type: 'search',
      termOrTitle: locationName,
      timestamp: Date.now()
    });
  }

  async getReverseGeocoding(lat: number, lon: number): Promise<string> {
    try {
      const data = await firstValueFrom(this.http.get<any>(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`));
      
      if (data.address) {
        const city = data.address.city || data.address.town || data.address.village || data.address.municipality;
        const state = data.address.state;
        
        if (city && state) {
          return `${city} - ${state}`;
        } else if (city) {
          return city;
        }
      }
      return `Localização: ${lat.toFixed(4)} , ${lon.toFixed(4)}`;
    } catch (error) {
      console.error('Erro ao fazer reverse geocoding:', error);
      return `Localização: ${lat.toFixed(4)} , ${lon.toFixed(4)}`;
    }
  }

  async getArticleContent(identifier: string, language: string): Promise<IArticleContentDTO> {
    const isId = /^\d+$/.test(identifier);
    const param = isId ? `pageid=${identifier}` : `page=${encodeURIComponent(identifier)}`;
    
    const data = await firstValueFrom(this.http.get<any>(`https://${language}.wikipedia.org/w/api.php?action=parse&${param}&format=json&origin=*`));
    
    this.addToHistory({
      type: 'article',
      termOrTitle: data.parse.title,
      id: String(data.parse.pageid),
      timestamp: Date.now(),
      language: language
    });

    return {
      title: data.parse.title,
      content: data.parse.text['*'],
      pageId: String(data.parse.pageid)
    };
  }

  setSearchTerm(searchTerm: string) {
    this.currentSearchTerm.set(searchTerm);
  }

  clearSearch() {
    this.searchResults.set([]);
    this.currentSearchTerm.set('');
    this.hasSearched.set(false);
    this.totalHits.set(0);
    this.currentOffset.set(0);
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

  addFavoriteResult(title: string, snippet: string, pageId: string, language?: string) {
    if(!title.trim() || !snippet.trim() || !pageId.trim()) return;
    const favoriteArticle: IFavoriteResultsDTO = { title, snippet, pageId, language };
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

  loadFavoriteGroups() {
    const storedGroups = localStorage.getItem('favoriteGroups');
    if (storedGroups) {
      this.favoriteGroups.set(JSON.parse(storedGroups));
    }
  }

  addFavoriteGroup(name: string, color: string) {
    const newGroup: IFavoriteGroupDTO = {
      id: crypto.randomUUID(),
      name,
      color,
      articles: []
    };
    this.favoriteGroups.update(groups => [...groups, newGroup]);
  }

  removeFavoriteGroup(groupId: string) {
    this.favoriteGroups.update(groups => groups.filter(g => g.id !== groupId));
  }

  addArticleToGroup(groupId: string, article: IFavoriteResultsDTO) {
    this.favoriteGroups.update(groups => 
      groups.map(group => {
        if (group.id === groupId) {
          if (group.articles.some(a => a.pageId === article.pageId)) return group;
          return { ...group, articles: [...group.articles, article] };
        }
        return group;
      })
    );
  }

  removeArticleFromGroup(groupId: string, articleId: string) {
    this.favoriteGroups.update(groups => 
      groups.map(group => {
        if (group.id === groupId) {
          return { ...group, articles: group.articles.filter(a => String(a.pageId) !== String(articleId)) };
        }
        return group;
      })
    );
  }

  loadHistory() {
    const storedHistory = localStorage.getItem('historyItems');
    if (storedHistory) {
      
      const finalHistory = this.historyOrder() === 'newest' ? 
        (JSON.parse(storedHistory).reverse() as IHistoryItemDTO[]) : 
          (JSON.parse(storedHistory) as IHistoryItemDTO[]);
      this.historyItems.set(finalHistory);
    }
  }

  addToHistory(item: IHistoryItemDTO) {
    this.historyItems.update(items => [...items, item]);
  }

  removeHistoryItem(timestamp: number) {
    this.historyItems.update(items => items.filter(i => i.timestamp !== timestamp));
  }

  removeHistoryItems(itemsToRemove: IHistoryItemDTO[]) {
  const timestampsToRemove = itemsToRemove.map(i => i.timestamp);
  this.historyItems.update(items =>
    items.filter(i => !timestampsToRemove.includes(i.timestamp))
  );
}

  clearHistory() {
    this.historyItems.set([]);
  }
}