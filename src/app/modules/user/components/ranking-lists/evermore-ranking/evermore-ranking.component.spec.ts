import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvermoreRankingComponent } from './evermore-ranking.component';

describe('EvermoreRankingComponent', () => {
  let component: EvermoreRankingComponent;
  let fixture: ComponentFixture<EvermoreRankingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvermoreRankingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EvermoreRankingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
