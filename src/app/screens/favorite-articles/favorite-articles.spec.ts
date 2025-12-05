import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoriteArticles } from './favorite-articles';

describe('FavoriteArticles', () => {
  let component: FavoriteArticles;
  let fixture: ComponentFixture<FavoriteArticles>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavoriteArticles]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FavoriteArticles);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
