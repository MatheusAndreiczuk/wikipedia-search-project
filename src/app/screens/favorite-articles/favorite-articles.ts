import { Component, inject, signal } from '@angular/core';
import { SearchService } from '../../services/search-service';
import { Router } from '@angular/router';
import { TranslationService } from '../../services/translation.service';
import { ConfirmationModal } from '../../components/shared/confirmation-modal/confirmation-modal';
import { PageHeader } from '../../components/shared/page-header/page-header';
import { UpperCasePipe } from '@angular/common';

import { IFavoriteResultsDTO } from '../../models/IFavoriteResultsDTO';

@Component({
  selector: 'app-favorite-articles',
  imports: [ConfirmationModal, PageHeader, UpperCasePipe],
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

  navigateToArticle(article: IFavoriteResultsDTO) {
    this.router.navigate(['/article', article.pageId], { queryParams: { lang: article.language } });
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
