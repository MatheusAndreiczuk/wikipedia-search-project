import { Component, inject, signal } from '@angular/core';
import { SearchService } from '../../services/search-service';
import { Router } from '@angular/router';
import { TranslationService } from '../../services/translation.service';
import { ConfirmationModal } from '../../components/shared/confirmation-modal/confirmation-modal';
import { PageHeader } from '../../components/shared/page-header/page-header';

@Component({
  selector: 'app-favorite-articles',
  imports: [ConfirmationModal, PageHeader],
  templateUrl: './favorite-articles.html',
  styleUrl: './favorite-articles.css',
})
export class FavoriteArticles {
  readonly favoriteService = inject(SearchService);
  readonly translationService = inject(TranslationService);
  private router = inject(Router);

  readonly t = this.translationService.t;
  
  readonly isRemoveArticleModalOpen = signal(false);
  readonly articleToRemove = signal<string | null>(null);

  navigateToArticle(pageId: string) {
    this.router.navigate(['/article', pageId]);
  }

  removeFavoriteArticle(pageId: string) {
    this.articleToRemove.set(pageId);
    this.isRemoveArticleModalOpen.set(true);
  }

  onConfirmRemoveArticle() {
    const pageId = this.articleToRemove();
    if (pageId) {
      this.favoriteService.removeFavoriteResult(pageId);
      this.isRemoveArticleModalOpen.set(false);
      this.articleToRemove.set(null);
    }
  }
}
