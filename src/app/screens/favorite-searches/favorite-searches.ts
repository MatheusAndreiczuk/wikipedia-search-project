import { Component, inject } from '@angular/core';
import { SearchService } from '../../services/search-service';

@Component({
  selector: 'app-favorite-searches',
  imports: [],
  templateUrl: './favorite-searches.html',
  styleUrl: './favorite-searches.css',
})
export class FavoriteSearches {
  readonly favoriteService = inject(SearchService);
}
