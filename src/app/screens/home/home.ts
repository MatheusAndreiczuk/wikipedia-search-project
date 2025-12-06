import { Component, computed, inject, effect } from '@angular/core';
import { SearchBar } from "../../components/search-bar/search-bar";
import { SearchService } from '../../services/search-service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Star, LucideAngularModule, ArrowLeft, ArrowRight } from "lucide-angular";
import { IFavoriteResultsDTO } from '../../models/IFavoriteResultsDTO';

@Component({
  selector: 'app-home',
  imports: [SearchBar, LucideAngularModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
   readonly searchService = inject(SearchService);
   readonly route = inject(ActivatedRoute);
   readonly hasSearchResults = computed(() => this.searchService.searchResults().length > 0);
   readonly starIcon = Star;
   readonly arrowLeft = ArrowLeft;
   readonly arrowRight = ArrowRight;
   
   readonly currentPage = computed(() => (this.searchService.currentOffset() / 10) + 1);
   readonly totalPages = computed(() => Math.ceil(this.searchService.totalHits() / 10));
   readonly hasNextPage = computed(() => this.currentPage() < this.totalPages());
   readonly hasPrevPage = computed(() => this.currentPage() > 1);

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

   async performSearch(searchTerm: string, offset: number = 0) {
     await this.searchService.fetchSearchResults(searchTerm, offset);
   }
   
   nextPage() {
     if (this.hasNextPage()) {
       this.performSearch(this.searchService.currentSearchTerm(), this.searchService.currentOffset() + 10);
     }
   }

   prevPage() {
     if (this.hasPrevPage()) {
       this.performSearch(this.searchService.currentSearchTerm(), this.searchService.currentOffset() - 10);
     }
   }

   addFavoriteResult({ title, snippet, pageId }: IFavoriteResultsDTO) {
     this.searchService.addFavoriteResult(title, snippet, pageId);
   }

   isFavoritedArticle(pageId: string): boolean {
     return this.searchService.verifyFavoritedArticle(pageId);
   }
}
