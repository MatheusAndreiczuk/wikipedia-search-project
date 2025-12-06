import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistoryScreen } from './history';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('HistoryScreen', () => {
  let component: HistoryScreen;
  let fixture: ComponentFixture<HistoryScreen>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoryScreen],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoryScreen);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
