import { TranslationService } from './../../services/translation.service';
import { Component, inject } from '@angular/core';
import { SearchService } from '../../services/search-service';
import { Router } from '@angular/router';
import { LucideAngularModule, XIcon } from 'lucide-angular';

@Component({
  selector: 'app-favorite-searches',
  imports: [LucideAngularModule],
  templateUrl: './favorite-searches.html',
  styleUrl: './favorite-searches.css',
})
export class FavoriteSearches {
  readonly favoriteService = inject(SearchService);
  readonly translationService = inject(TranslationService);
  readonly router = inject(Router);
  readonly xIcon = XIcon;

  readonly t = this.translationService.t;
  
  redirectToSearch(term: string) {
    this.router.navigate(['/'], { queryParams: { search: term } });
  }

  removeFavoriteTerm(term: string) {
    this.favoriteService.removeFavoritedTerm(term);
  }
}
