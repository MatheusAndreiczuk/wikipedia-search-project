import { SearchService } from './../../services/search-service';
import { Component, ElementRef, inject, output, signal, ViewChild, computed } from '@angular/core';
import { LucideAngularModule, Search, Star, X } from "lucide-angular";
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-search-bar',
  imports: [LucideAngularModule],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.css',
})
export class SearchBar {
  @ViewChild('searchInputRef') searchInputRef!: ElementRef<HTMLInputElement>;
  readonly searchService = inject(SearchService);
  readonly translationService = inject(TranslationService);
  readonly searchIcon = Search;
  readonly starIcon = Star;
  readonly xIcon = X;

  readonly t = this.translationService.t;
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
