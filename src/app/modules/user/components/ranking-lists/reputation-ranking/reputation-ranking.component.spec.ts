import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReputationRankingComponent } from './reputation-ranking.component';

describe('ReputationRankingComponent', () => {
  let component: ReputationRankingComponent;
  let fixture: ComponentFixture<ReputationRankingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReputationRankingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReputationRankingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
