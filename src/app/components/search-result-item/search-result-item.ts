import { Component, input, output, inject } from '@angular/core';
import { WikiResult } from '../../models/ISearchResponseDTO';
import { LucideAngularModule, Star } from 'lucide-angular';
import { RouterLink } from '@angular/router';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-search-result-item',
  imports: [LucideAngularModule, RouterLink],
  templateUrl: './search-result-item.html',
  styleUrls: ['./search-result-item.css'],
})
export class SearchResultItem {
  item = input.required<WikiResult>();
  isFavorited = input.required<boolean>();
  
  toggleFavorite = output<WikiResult>();

  readonly translationService = inject(TranslationService);
  readonly t = this.translationService.t;
  readonly starIcon = Star;

  onToggleFavorite() {
    this.toggleFavorite.emit(this.item());
  }
}
