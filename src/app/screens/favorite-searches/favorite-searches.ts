import { TranslationService } from './../../services/translation.service';
import { Component, inject, signal } from '@angular/core';
import { SearchService } from '../../services/search-service';
import { Router } from '@angular/router';
import { LucideAngularModule, XIcon } from 'lucide-angular';
import { ConfirmationModal } from '../../components/shared/confirmation-modal/confirmation-modal';

@Component({
  selector: 'app-favorite-searches',
  imports: [LucideAngularModule, ConfirmationModal],
  templateUrl: './favorite-searches.html',
  styleUrl: './favorite-searches.css',
})
export class FavoriteSearches {
  readonly favoriteService = inject(SearchService);
  readonly translationService = inject(TranslationService);
  readonly router = inject(Router);
  readonly xIcon = XIcon;

  readonly t = this.translationService.t;
  
  readonly isRemoveTermModalOpen = signal(false);
  readonly termToRemove = signal<string | null>(null);

  redirectToSearch(term: string) {
    this.router.navigate(['/'], { queryParams: { search: term } });
  }

  removeFavoriteTerm(term: string) {
    this.termToRemove.set(term);
    this.isRemoveTermModalOpen.set(true);
  }

  onConfirmRemoveTerm() {
    const term = this.termToRemove();
    if (term) {
      this.favoriteService.removeFavoritedTerm(term);
      this.isRemoveTermModalOpen.set(false);
      this.termToRemove.set(null);
    }
  }
}
