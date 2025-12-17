import { Component, inject, signal, ViewChild, ElementRef, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { SearchService } from '../../services/search-service';
import { TranslationService } from '../../services/translation.service';
import { DomSanitizer, SafeHtml, Title } from '@angular/platform-browser';
import { LucideAngularModule, ArrowLeft, ArrowUp, Star } from "lucide-angular";

@Component({
  selector: 'app-article-view',
  imports: [LucideAngularModule],
  templateUrl: './article-view.html',
  styleUrl: './article-view.css'
})
export class ArticleView {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);
  private searchService = inject(SearchService);
  private translationService = inject(TranslationService);
  private sanitizer = inject(DomSanitizer);
  private titleService = inject(Title);

  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLDivElement>;

  articleContent = signal<SafeHtml>('');
  articleTitle = signal<string>('');
  articleId = signal<string>('');
  isLoading = signal<boolean>(true);
  showScrollTop = signal<boolean>(false);
  
  readonly t = this.translationService.t;
  readonly arrowLeft = ArrowLeft;
  readonly arrowUp = ArrowUp;
  readonly starIcon = Star;

  readonly isFavorited = computed(() => this.searchService.verifyFavoritedArticle(this.articleId()));

  articleLanguage = signal<string>('');

  constructor() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      const lang = this.route.snapshot.queryParamMap.get('lang');
      this.articleLanguage.set(lang || this.translationService.currentLang());
      
      if (id) {
        this.loadArticle(id);
      }
    });
  }

  async loadArticle(id: string) {
    this.isLoading.set(true);
    try {
      const data = await this.searchService.getArticleContent(id, this.articleLanguage());
      this.articleTitle.set(data.title);
      this.titleService.setTitle(data.title);
      this.articleId.set(data.pageId);
      
      let content = data.content;
      content = content.replace(/href="\/wiki\/([^"]*)"/g, 'href="/article/$1"');
      
      this.articleContent.set(this.sanitizer.bypassSecurityTrustHtml(content));
 
      setTimeout(() => {
        if (this.scrollContainer) {
          this.scrollContainer.nativeElement.scrollTop = 0;
          this.showScrollTop.set(false);
        }
      }, 0);
    } catch (error) {
      console.error('Erro ao carregar artigo:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  toggleFavorite() {
    if (this.isFavorited()) {
      if (this.articleId()) {
        this.searchService.removeFavoriteResult(this.articleId());
      }
    } else {
      if (this.articleId()) {
         this.searchService.addFavoriteResult(this.articleTitle(), this.t().article.favoritedViaView, this.articleId(), this.articleLanguage());
      }
    }
  }

  onScroll(event: Event) {
    const target = event.target as HTMLElement;
    this.showScrollTop.set(target.scrollTop > 300);
  }

  scrollToTop() {
    this.scrollContainer?.nativeElement.scrollTo({ top: 0, behavior: 'smooth' });
  }

  goBack() {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/']);
    }
  }

  handleContentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const anchor = target.closest('a');
    
    if (anchor) {
      const href = anchor.getAttribute('href');
      if (href && href.startsWith('/article/')) {
        event.preventDefault();
        const title = href.replace('/article/', '');
        
        if (event.button === 1 || event.ctrlKey || event.metaKey) {
            const url = this.router.serializeUrl(
              this.router.createUrlTree(['/article', decodeURIComponent(title)], { queryParams: { lang: this.articleLanguage() } })
            );
            window.open(url, '_blank');
        } else {
            this.router.navigate(['/article', decodeURIComponent(title)], { queryParams: { lang: this.articleLanguage() } });
        }
      }
    }
  }
}
