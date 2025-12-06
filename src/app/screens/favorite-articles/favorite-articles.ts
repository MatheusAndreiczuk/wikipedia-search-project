import { Component, inject } from '@angular/core';
import { SearchService } from '../../services/search-service';

@Component({
  selector: 'app-favorite-articles',
  imports: [],
  templateUrl: './favorite-articles.html',
  styleUrl: './favorite-articles.css',
})
export class FavoriteArticles {
  readonly favoriteService = inject(SearchService);
  
  redirectToWikipedia(pageId: string) {
    const url = `https://pt.wikipedia.org/?curid=${pageId}`;
    window.open(url, '_blank');
  }

  removeFavoriteArticle(pageId: string) {
    this.favoriteService.removeFavoriteResult(pageId);
  }
}
