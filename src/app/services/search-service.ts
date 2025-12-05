import { computed, effect, Injectable, signal } from '@angular/core';
import { WikiResponse, WikiResult } from '../models/ISearchResponseDTO';

@Injectable({
  providedIn: 'root',
})
export class SearchService {

  readonly searchResults = signal<WikiResult[]>([]);
  readonly currentSearchTerm = signal<string>('');
  readonly favoriteTerms = signal<string[]>([]);
  readonly hasSearched = signal(false);
  
  readonly hasFavorited = computed(() => this.verifyFavorite(this.currentSearchTerm()));

  constructor() {
    this.loadFavorites();

    effect(() => {
      localStorage.setItem('favoriteTerms', JSON.stringify(this.favoriteTerms()));
    })
  }

  verifyFavorite(searchTerm: string): boolean {
    return this.favoriteTerms().includes(searchTerm) ? true : false;
  }

  async fetchSearchResults(searchTerm: string) {
    const response = await fetch(`https://pt.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(searchTerm)}&format=json&origin=*`);
    const data = await response.json() as WikiResponse;
    data ? this.searchResults.set(data.query.search as WikiResult[]) : this.searchResults.set([]);
    this.currentSearchTerm.set(searchTerm);
    this.hasSearched.set(true);
  }

  addFavorite(searchTerm: string) {
    if(!searchTerm.trim()) return;
    this.favoriteTerms.update((terms) => [...terms, searchTerm]);
  }

  loadFavorites(){
    const storedTerms = localStorage.getItem('favoriteTerms');
    if(storedTerms){
      const allTerms: string[] = JSON.parse(storedTerms);
      this.favoriteTerms.set(allTerms);
    }
  }
}


