import { Component, computed, inject, effect, DOCUMENT } from '@angular/core';
import { SearchBar } from "../../components/search-bar/search-bar";
import { SearchService } from '../../services/search-service';
import { TranslationService } from '../../services/translation.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Star, LucideAngularModule, ArrowLeft, ArrowRight } from "lucide-angular";
import { IFavoriteResultsDTO } from '../../models/IFavoriteResultsDTO';
import { SearchResultItem } from '../../components/search-result-item/search-result-item';

@Component({
  selector: 'app-home',
  imports: [SearchBar, LucideAngularModule, SearchResultItem],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
   readonly searchService = inject(SearchService);
   readonly translationService = inject(TranslationService);
   readonly route = inject(ActivatedRoute);
  private document = inject(DOCUMENT);
   
   readonly t = this.translationService.t;
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

   scrollToMainContent() {
    setTimeout(() => {
      const main = this.document.querySelector('main');
      if (main) {
        main.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 50);
  }

   async performSearch(searchTerm: string, offset: number = 0) {
     await this.searchService.fetchSearchResults(searchTerm, offset, this.translationService.currentLang());
   }

   clearSearch() {
     this.searchService.clearSearch();
   }
   
   nextPage() {
     if (this.hasNextPage()) {
       this.performSearch(this.searchService.currentSearchTerm(), this.searchService.currentOffset() + 10);
       this.scrollToMainContent();
     }
   }

   prevPage() {
     if (this.hasPrevPage()) {
       this.performSearch(this.searchService.currentSearchTerm(), this.searchService.currentOffset() - 10);
       this.scrollToMainContent();
     }
   }

   addFavoriteResult({ title, snippet, pageId }: IFavoriteResultsDTO) {
     this.searchService.addFavoriteResult(title, snippet, pageId, this.translationService.currentLang());
   }

   isFavoritedArticle(pageId: string): boolean {
     return this.searchService.verifyFavoritedArticle(pageId);
   }
}
