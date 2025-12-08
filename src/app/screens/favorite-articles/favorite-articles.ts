import { Component, inject } from '@angular/core';
import { SearchService } from '../../services/search-service';
import { Router } from '@angular/router';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-favorite-articles',
  imports: [],
  templateUrl: './favorite-articles.html',
  styleUrl: './favorite-articles.css',
})
export class FavoriteArticles {
  readonly favoriteService = inject(SearchService);
  readonly translationService = inject(TranslationService);
  private router = inject(Router);

  readonly t = this.translationService.t;
  
  navigateToArticle(pageId: string) {
    this.router.navigate(['/article', pageId]);
  }

  removeFavoriteArticle(pageId: string) {
    this.favoriteService.removeFavoriteResult(pageId);
  }
}
