import { Component, inject } from '@angular/core';
import { LucideAngularModule, Settings as SettingsIcon } from "lucide-angular";
import { TranslationService, Language } from '../../services/translation.service';

@Component({
  selector: 'app-settings',
  imports: [LucideAngularModule],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings {
    readonly translationService = inject(TranslationService);
    readonly settingsIcon = SettingsIcon;
    
    readonly t = this.translationService.t;
    readonly currentLang = this.translationService.currentLang;

    setLanguage(lang: Language) {
        this.translationService.setLanguage(lang);
    }
}
