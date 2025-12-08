import { Component, inject } from '@angular/core';
import { MenuItem } from "./menu-item/menu-item";
import { TranslationService } from '../../../services/translation.service';

@Component({
  selector: 'app-menu',
  imports: [MenuItem],
  templateUrl: './menu.html',
  styleUrls: ['./menu.css'],
})
export class Menu {
  readonly translationService = inject(TranslationService);
  readonly t = this.translationService.t;
}
