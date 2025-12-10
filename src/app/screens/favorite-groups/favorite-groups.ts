import { Component, inject, signal } from '@angular/core';
import { SearchService } from '../../services/search-service';
import { LucideAngularModule, Plus, Trash2, X, Folder, ExternalLink } from 'lucide-angular';
import { IFavoriteGroupDTO } from '../../models/IFavoriteGroupDTO';
import { IFavoriteResultsDTO } from '../../models/IFavoriteResultsDTO';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslationService } from '../../services/translation.service';
import { ConfirmationModal } from '../../components/shared/confirmation-modal/confirmation-modal';

@Component({
  selector: 'app-favorite-groups',
  imports: [LucideAngularModule, RouterLink, FormsModule, ConfirmationModal],
  templateUrl: './favorite-groups.html',
  styleUrl: './favorite-groups.css'
})
export class FavoriteGroups {
  readonly searchService = inject(SearchService);
  readonly translationService = inject(TranslationService);
  
  readonly plusIcon = Plus;
  readonly trashIcon = Trash2;
  readonly closeIcon = X;
  readonly folderIcon = Folder;
  readonly externalLinkIcon = ExternalLink;
  readonly t = this.translationService.t;

  isCreateModalOpen = signal(false);
  isDetailsModalOpen = signal(false);
  isAddArticleMode = signal(false);
  
  isDeleteGroupModalOpen = signal(false);
  isRemoveArticleModalOpen = signal(false);
  articleToRemove = signal<string | null>(null);

  selectedGroup = signal<IFavoriteGroupDTO | null>(null);
  
  newGroupName = signal('');
  newGroupColor = signal('#FF0000'); 

  openCreateModal() {
    this.newGroupName.set('');
    this.newGroupColor.set('#FF0000');
    this.isCreateModalOpen.set(true);
  }

  closeCreateModal() {
    this.isCreateModalOpen.set(false);
  }

  createGroup() {
    if (this.newGroupName().trim()) {
      this.searchService.addFavoriteGroup(this.newGroupName(), this.newGroupColor());
      this.closeCreateModal();
    }
  }

  openGroupDetails(group: IFavoriteGroupDTO) {
    this.selectedGroup.set(group);
    this.isDetailsModalOpen.set(true);
    this.isAddArticleMode.set(false);
  }

  closeDetailsModal() {
    this.isDetailsModalOpen.set(false);
    this.selectedGroup.set(null);
  }

  deleteGroup(groupId: string) {
    this.isDeleteGroupModalOpen.set(true);
  }

  onConfirmDeleteGroup() {
    const group = this.selectedGroup();
    if (group) {
      this.searchService.removeFavoriteGroup(group.id);
      this.closeDetailsModal();
      this.isDeleteGroupModalOpen.set(false);
    }
  }

  toggleAddArticleMode() {
    this.isAddArticleMode.update(v => !v);
  }

  addArticleToGroup(article: IFavoriteResultsDTO) {
    const group = this.selectedGroup();
    if (group) {
      this.searchService.addArticleToGroup(group.id, article);
      const updatedGroup = this.searchService.favoriteGroups().find(g => g.id === group.id);
      if (updatedGroup) {
        this.selectedGroup.set(updatedGroup);
      }
      this.isAddArticleMode.set(false);
    }
  }

  removeArticleFromGroup(articleId: string) {
    this.articleToRemove.set(articleId);
    this.isRemoveArticleModalOpen.set(true);
  }

  onConfirmRemoveArticle() {
    const group = this.selectedGroup();
    const articleId = this.articleToRemove();
    if (group && articleId) {
      this.searchService.removeArticleFromGroup(group.id, articleId);
      const updatedGroup = this.searchService.favoriteGroups().find(g => g.id === group.id);
      if (updatedGroup) {
        this.selectedGroup.set(updatedGroup);
      }
      this.isRemoveArticleModalOpen.set(false);
      this.articleToRemove.set(null);
    }
  }

  isArticleInGroup(articleId: string): boolean {
    return this.selectedGroup()?.articles.some(a => String(a.pageId) === String(articleId)) ?? false;
  }

  areAllFavoritesInGroup(): boolean {
    const favorites = this.searchService.favoriteResults();
    if (favorites.length === 0) return false;
    return favorites.every(fav => this.isArticleInGroup(fav.pageId));
  }
}
