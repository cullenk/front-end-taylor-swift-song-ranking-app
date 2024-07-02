import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedRankingComponent } from './red-ranking.component';

describe('RedRankingComponent', () => {
  let component: RedRankingComponent;
  let fixture: ComponentFixture<RedRankingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RedRankingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RedRankingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
