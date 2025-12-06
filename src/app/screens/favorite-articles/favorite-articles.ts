import { Component, inject } from '@angular/core';
import { SearchService } from '../../services/search-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-favorite-articles',
  imports: [],
  templateUrl: './favorite-articles.html',
  styleUrl: './favorite-articles.css',
})
export class FavoriteArticles {
  readonly favoriteService = inject(SearchService);
  private router = inject(Router);
  
  navigateToArticle(pageId: string) {
    this.router.navigate(['/article', pageId]);
  }

  removeFavoriteArticle(pageId: string) {
    this.favoriteService.removeFavoriteResult(pageId);
  }
}
