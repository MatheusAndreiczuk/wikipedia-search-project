import { SearchService } from './../../services/search-service';
import { Component, inject, output, signal } from '@angular/core';
import { LucideAngularModule, Search, Star } from "lucide-angular";

@Component({
  selector: 'app-search-bar',
  imports: [LucideAngularModule],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.css',
})
export class SearchBar {
  readonly searchService = inject(SearchService);
  readonly searchIcon = Search;
  readonly starIcon = Star;

  search = output<string>();
  searchInput = signal('');

  onSearch(event: Event, term: string) {
    event.preventDefault();
    if (term.trim()) {
      this.search.emit(term);
    }
  }
}
