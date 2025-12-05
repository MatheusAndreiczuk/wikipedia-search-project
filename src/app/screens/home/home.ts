import { Component, computed, inject, effect } from '@angular/core';
import { SearchBar } from "../../components/search-bar/search-bar";
import { SearchService } from '../../services/search-service';
import { ActivatedRoute } from '@angular/router';
import { Star, LucideAngularModule } from "lucide-angular";
import { IFavoriteResultsDTO } from '../../models/IFavoriteResultsDTO';

@Component({
  selector: 'app-home',
  imports: [SearchBar, LucideAngularModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
   readonly searchService = inject(SearchService);
   readonly route = inject(ActivatedRoute);
   readonly hasSearchResults = computed(() => this.searchService.searchResults().length > 0);
   readonly starIcon = Star;

   constructor() {
     effect(() => {
       this.route.queryParams.subscribe(params => {
         const term = params['search'];
         if (term) {
           this.searchService.setSearchTerm(term);
           this.performSearch(term);
         }
       });
     });
   }

   async performSearch(searchTerm: string) {
     await this.searchService.fetchSearchResults(searchTerm);
   }

   addFavoriteResult({ title, snippet, pageId }: IFavoriteResultsDTO) {
     this.searchService.addFavoriteResult(title, snippet, pageId);
   }

   isFavoritedArticle(pageId: string): boolean {
     return this.searchService.verifyFavoritedArticle(pageId);
   }
}
