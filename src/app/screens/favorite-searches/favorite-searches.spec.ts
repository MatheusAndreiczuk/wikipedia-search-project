import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoriteSearches } from './favorite-searches';

describe('FavoriteSearches', () => {
  let component: FavoriteSearches;
  let fixture: ComponentFixture<FavoriteSearches>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavoriteSearches]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FavoriteSearches);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
