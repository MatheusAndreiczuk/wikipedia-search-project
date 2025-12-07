import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoriteGroups } from './favorite-groups';

describe('FavoriteGroups', () => {
  let component: FavoriteGroups;
  let fixture: ComponentFixture<FavoriteGroups>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavoriteGroups]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FavoriteGroups);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
