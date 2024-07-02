import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FolkloreRankingComponent } from './folklore-ranking.component';

describe('FolkloreRankingComponent', () => {
  let component: FolkloreRankingComponent;
  let fixture: ComponentFixture<FolkloreRankingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FolkloreRankingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FolkloreRankingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
