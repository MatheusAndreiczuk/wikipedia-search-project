import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoriteGroupCard } from './favorite-group-card';

describe('FavoriteGroupCard', () => {
  let component: FavoriteGroupCard;
  let fixture: ComponentFixture<FavoriteGroupCard>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavoriteGroupCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FavoriteGroupCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
