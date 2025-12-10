import { Component, input, output, inject } from '@angular/core';
import { IFavoriteGroupDTO } from '../../models/IFavoriteGroupDTO';
import { LucideAngularModule, Folder } from 'lucide-angular';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-favorite-group-card',
  imports: [LucideAngularModule],
  templateUrl: './favorite-group-card.html',
  styleUrls: ['./favorite-group-card.css'],
})
export class FavoriteGroupCard {
  group = input.required<IFavoriteGroupDTO>();
  onClick = output<IFavoriteGroupDTO>();

  readonly translationService = inject(TranslationService);
  readonly t = this.translationService.t;
  readonly folderIcon = Folder;

  handleClick() {
    this.onClick.emit(this.group());
  }
}
