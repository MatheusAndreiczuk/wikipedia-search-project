import { Injectable, signal, computed, effect } from '@angular/core';
import { PT, EN } from '../i18n/translations';

export type Language = 'pt' | 'en';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  readonly currentLang = signal<Language>('pt');
  
  readonly t = computed(() => {
    return this.currentLang() === 'pt' ? PT : EN;
  });

  constructor() {
    const savedLang = localStorage.getItem('systemLanguage') as Language;
    if (savedLang as Language) {
      this.currentLang.set(savedLang);
    }

    effect(() => {
      localStorage.setItem('systemLanguage', this.currentLang());
    });
  }

  setLanguage(lang: Language) {
    this.currentLang.set(lang);
  }
}
