import { Component, inject } from '@angular/core';
import { SearchService } from '../../services/search-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-favorite-searches',
  imports: [],
  templateUrl: './favorite-searches.html',
  styleUrl: './favorite-searches.css',
})
export class FavoriteSearches {
  readonly favoriteService = inject(SearchService);
  readonly router = inject(Router);
  
  redirectToSearch(term: string) {
    this.router.navigate(['/'], { queryParams: { search: term } });
  }
}
