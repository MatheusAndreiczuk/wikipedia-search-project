import { Component, inject, computed } from '@angular/core';
import { SearchService } from '../../services/search-service';
import { Router } from '@angular/router';
import { LucideAngularModule, History, Search, FileText, Trash2 } from 'lucide-angular';
import { IHistoryItemDTO } from '../../models/IHistoryItemDTO';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './history.html',
})
export class HistoryScreen {
  readonly searchService = inject(SearchService);
  private router = inject(Router);
  
  readonly historyIcon = History;
  readonly searchIcon = Search;
  readonly articleIcon = FileText;
  readonly trashIcon = Trash2;

  readonly historyItems = this.searchService.historyItems;

  formatDate(timestamp: number): string {
    const date = new Date(timestamp);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    const isToday = date.toDateString() === now.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) {
      return `Hoje às ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (isYesterday) {
      return 'Ontem';
    } else {
      return date.toLocaleDateString();
    }
  }

  navigateToItem(item: IHistoryItemDTO) {
    if (item.type === 'search') {
      this.router.navigate(['/'], { queryParams: { search: item.termOrTitle } });
    } else {
      this.router.navigate(['/article', item.id]);
    }
  }

  clearHistory() {
    if(confirm('Tem certeza que deseja limpar todo o histórico?')) {
      this.searchService.clearHistory();
    }
  }
}
