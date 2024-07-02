import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MidnightsRankingComponent } from './midnights-ranking.component';

describe('MidnightsRankingComponent', () => {
  let component: MidnightsRankingComponent;
  let fixture: ComponentFixture<MidnightsRankingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MidnightsRankingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MidnightsRankingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
