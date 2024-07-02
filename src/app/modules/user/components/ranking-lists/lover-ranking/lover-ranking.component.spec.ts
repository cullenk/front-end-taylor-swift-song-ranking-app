import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoverRankingComponent } from './lover-ranking.component';

describe('LoverRankingComponent', () => {
  let component: LoverRankingComponent;
  let fixture: ComponentFixture<LoverRankingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoverRankingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoverRankingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
