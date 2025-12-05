import { Component, computed, inject } from '@angular/core';
import { SearchBar } from "../../components/search-bar/search-bar";
import { SearchService } from '../../services/search-service';

@Component({
  selector: 'app-home',
  imports: [SearchBar],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
   readonly searchService = inject(SearchService);
   readonly hasSearchResults = computed(() => this.searchService.searchResults().length > 0);

   async performSearch(searchTerm: string) {
     await this.searchService.fetchSearchResults(searchTerm);
   }
}
