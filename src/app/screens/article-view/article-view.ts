import { Component, inject, signal, effect } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SearchService } from '../../services/search-service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { LucideAngularModule, ArrowLeft } from "lucide-angular";

@Component({
  selector: 'app-article-view',
  imports: [LucideAngularModule, RouterLink],
  templateUrl: './article-view.html',
  styleUrl: './article-view.css'
})
export class ArticleView {
  private route = inject(ActivatedRoute);
  private searchService = inject(SearchService);
  private sanitizer = inject(DomSanitizer);

  articleContent = signal<SafeHtml>('');
  articleTitle = signal<string>('');
  isLoading = signal<boolean>(true);
  readonly arrowLeft = ArrowLeft;

  constructor() {
    effect(() => {
      const id = this.route.snapshot.paramMap.get('id');
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
    } catch (error) {
      console.error('Erro ao carregar artigo:', error);
    } finally {
      this.isLoading.set(false);
    }
  }
}
