import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeakNowRankingComponent } from './speak-now-ranking.component';

describe('SpeakNowRankingComponent', () => {
  let component: SpeakNowRankingComponent;
  let fixture: ComponentFixture<SpeakNowRankingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpeakNowRankingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SpeakNowRankingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
