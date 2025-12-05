import { SearchService } from './../../services/search-service';
import { Component, ElementRef, inject, output, signal, ViewChild, computed } from '@angular/core';
import { LucideAngularModule, Search, Star, X } from "lucide-angular";

@Component({
  selector: 'app-search-bar',
  imports: [LucideAngularModule],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.css',
})
export class SearchBar {
  @ViewChild('searchInputRef') searchInputRef!: ElementRef<HTMLInputElement>;
  readonly searchService = inject(SearchService);
  readonly searchIcon = Search;
  readonly starIcon = Star;
  readonly xIcon = X;

  search = output<string>();
  searchInput = computed(() => this.searchService.currentSearchTerm());
  isInputFocused = signal(false);

  onFocus(){
    this.isInputFocused.set(true);
  }

  onBlur(){
    this.isInputFocused.set(false);
  }

  clearInput(){
    this.searchService.setSearchTerm('');
    setTimeout(() => {
      this.searchInputRef.nativeElement.focus();
    });
  }

  onSearch(event: Event, term: string) {
    event.preventDefault();
    if (term.trim()) {
      this.search.emit(term);
    }
  }
}
