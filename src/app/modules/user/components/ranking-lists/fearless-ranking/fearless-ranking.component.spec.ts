import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FearlessRankingComponent } from './fearless-ranking.component';

describe('FearlessRankingComponent', () => {
  let component: FearlessRankingComponent;
  let fixture: ComponentFixture<FearlessRankingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FearlessRankingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FearlessRankingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
