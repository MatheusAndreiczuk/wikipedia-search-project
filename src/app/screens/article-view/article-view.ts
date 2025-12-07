import { Component, inject, signal, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { SearchService } from '../../services/search-service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { LucideAngularModule, ArrowLeft, ArrowUp } from "lucide-angular";

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
  private sanitizer = inject(DomSanitizer);

  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLDivElement>;

  articleContent = signal<SafeHtml>('');
  articleTitle = signal<string>('');
  isLoading = signal<boolean>(true);
  showScrollTop = signal<boolean>(false);
  
  readonly arrowLeft = ArrowLeft;
  readonly arrowUp = ArrowUp;

  constructor() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadArticle(id);
      }
    });
  }

  async loadArticle(id: string) {
    this.isLoading.set(true);
    try {
      const data = await this.searchService.getArticleContent(id);
      this.articleTitle.set(data.title);
      this.articleContent.set(this.sanitizer.bypassSecurityTrustHtml(data.content));
 
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
      if (href) {
        let title = '';
        if (href.startsWith('/wiki/')) {
          title = href.replace('/wiki/', '');
        } else if (href.includes('wikipedia.org/wiki/')) {
          const parts = href.split('/wiki/');
          if (parts.length > 1) {
            title = parts[1];
          }
        }

        if (title) {
          event.preventDefault();
          title = title.split('#')[0];
          this.router.navigate(['/article', decodeURIComponent(title)]);
        }
      }
    }
  }
}
