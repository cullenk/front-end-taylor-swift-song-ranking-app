import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TorturedPoetsDepartmentRankingComponent } from './tortured-poets-department-ranking.component';

describe('TorturedPoetsDepartmentRankingComponent', () => {
  let component: TorturedPoetsDepartmentRankingComponent;
  let fixture: ComponentFixture<TorturedPoetsDepartmentRankingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TorturedPoetsDepartmentRankingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TorturedPoetsDepartmentRankingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
