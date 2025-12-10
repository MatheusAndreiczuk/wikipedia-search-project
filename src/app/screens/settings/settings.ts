import { Component, inject } from '@angular/core';
import { LucideAngularModule, Languages } from "lucide-angular";
import { TranslationService, Language } from '../../services/translation.service';
import { PageHeader } from '../../components/shared/page-header/page-header';

@Component({
  selector: 'app-settings',
  imports: [LucideAngularModule, PageHeader],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings {
    readonly translationService = inject(TranslationService);
    readonly languageIcon = Languages;
    
    readonly t = this.translationService.t;
    readonly currentLang = this.translationService.currentLang;

    setLanguage(lang: Language) {
        this.translationService.setLanguage(lang);
    }
}
