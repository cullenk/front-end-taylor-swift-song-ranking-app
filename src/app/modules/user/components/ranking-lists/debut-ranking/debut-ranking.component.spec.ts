import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebutRankingComponent } from './debut-ranking.component';

describe('DebutRankingComponent', () => {
  let component: DebutRankingComponent;
  let fixture: ComponentFixture<DebutRankingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DebutRankingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DebutRankingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
