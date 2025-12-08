import { Component, inject, computed, signal } from '@angular/core';
import { SearchService } from '../../services/search-service';
import { TranslationService } from '../../services/translation.service';
import { Router } from '@angular/router';
import { LucideAngularModule, History, Search, FileText, XIcon, Calendar } from 'lucide-angular';
import { IHistoryItemDTO, IHistoryFiltersDTO } from '../../models/IHistoryItemDTO';
import { FormsModule } from '@angular/forms';
import { DateInputMaskDirective } from '../../directives/date-input-mask.directive';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [LucideAngularModule, FormsModule, DateInputMaskDirective],
  templateUrl: './history.html',
})
export class HistoryScreen {
  readonly searchService = inject(SearchService);
  readonly translationService = inject(TranslationService);
  private router = inject(Router);

  readonly t = this.translationService.t;
  readonly historyIcon = History;
  readonly searchIcon = Search;
  readonly articleIcon = FileText;
  readonly trashIcon = XIcon;
  readonly calendarIcon = Calendar;

  readonly order = signal<IHistoryFiltersDTO['order']>('newest');
  readonly startDate = signal<string>('');
  readonly endDate = signal<string>('');

  readonly filteredHistoryItems = computed(() => {
    let items = [...this.searchService.historyItems()];

    const startTimestamp = this.toTimestamp(this.startDate(), 'start');
    const endTimestamp = this.toTimestamp(this.endDate(), 'end');

    if (startTimestamp !== null) {
      items = items.filter(item => item.timestamp >= startTimestamp);
    }

    if (endTimestamp !== null) {
      items = items.filter(item => item.timestamp <= endTimestamp);
    }

    return items.sort((a, b) => {
      return this.order() === 'newest' ?
        b.timestamp - a.timestamp :
          a.timestamp - b.timestamp;
    });
  });

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
    const isFiltered = this.isCompleteDate(this.startDate()) || this.isCompleteDate(this.endDate());
    const message = isFiltered ?
      'Tem certeza que deseja remover os itens filtrados do histórico?' :
        'Tem certeza que deseja limpar todo o histórico?';

    if (confirm(message)) {
      if (isFiltered) {
        this.searchService.removeHistoryItems(this.filteredHistoryItems());
      } else {
        this.searchService.clearHistory();
      }
    }
  }

  resetFilters() {
    this.startDate.set('');
    this.endDate.set('');
    this.order.set('newest');
  }

  removeSingleItem(item: IHistoryItemDTO, event: Event) {
    event.stopPropagation();
    this.searchService.removeHistoryItem(item.timestamp);
  }

  focusDateInput(input: HTMLInputElement) {
    input.focus();
  }

  openCalendar(event: Event, input: HTMLInputElement) {
    event.stopPropagation();
    if (input.showPicker) {
      input.showPicker();
    } else {
      input.focus();
    }
  }

  onStartDateChange(value: string) {
    this.startDate.set(value.trim());
  }

  onEndDateChange(value: string) {
    this.endDate.set(value.trim());
  }

  onDateSelect(value: string, target: 'start' | 'end') {
    if (!value) {
      target === 'start' ? this.startDate.set('') : this.endDate.set('');
      return;
    }

    const [year, month, day] = value.split('-');
    const formatted = `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
    target === 'start' ? this.startDate.set(formatted) : this.endDate.set(formatted);
  }

  private toTimestamp(value: string, bound: 'start' | 'end'): number | null {
    const date = this.parseDate(value);
    if (!date) return null;

    if (bound === 'start') {
      date.setHours(0, 0, 0, 0);
    } else {
      date.setHours(23, 59, 59, 999);
    }

    return date.getTime();
  }

  private parseDate(value: string): Date | null {
    const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (!match) return null;

    const [, d, m, y] = match;
    const day = Number(d);
    const month = Number(m) - 1;
    const year = Number(y);

    const date = new Date(year, month, day);

    if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) {
      return null;
    }

    return date;
  }

  private isCompleteDate(value: string): boolean {
    return /^(\d{2})\/(\d{2})\/(\d{4})$/.test(value) && this.parseDate(value) !== null;
  }
}
