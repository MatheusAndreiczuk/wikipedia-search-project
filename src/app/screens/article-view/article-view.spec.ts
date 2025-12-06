import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArticleView } from './article-view';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('ArticleView', () => {
  let component: ArticleView;
  let fixture: ComponentFixture<ArticleView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleView],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticleView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
