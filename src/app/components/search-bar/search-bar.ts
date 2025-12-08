import { SearchService } from './../../services/search-service';
import { Component, ElementRef, inject, output, signal, ViewChild, computed } from '@angular/core';
import { LucideAngularModule, Search, Star, X, MapPin } from "lucide-angular";
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
  readonly mapPinIcon = MapPin;

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

  onSearchNearby() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        this.searchService.fetchGeoSearchResults(lat, lon);
      }, (error) => {
        console.error("Error getting location", error);
        alert("Erro ao obter localização. Verifique se a permissão foi concedida.");
      });
    } else {
      alert("Geolocalização não é suportada neste navegador.");
    }
  }
}
