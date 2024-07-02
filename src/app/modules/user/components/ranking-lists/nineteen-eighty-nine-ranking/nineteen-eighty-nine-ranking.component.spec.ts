import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NineteenEightyNineRankingComponent } from './nineteen-eighty-nine-ranking.component';

describe('NineteenEightyNineRankingComponent', () => {
  let component: NineteenEightyNineRankingComponent;
  let fixture: ComponentFixture<NineteenEightyNineRankingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NineteenEightyNineRankingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NineteenEightyNineRankingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
