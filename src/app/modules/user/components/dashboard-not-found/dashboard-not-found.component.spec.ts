import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardNotFoundComponent } from './dashboard-not-found.component';

describe('DashboardNotFoundComponent', () => {
  let component: DashboardNotFoundComponent;
  let fixture: ComponentFixture<DashboardNotFoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardNotFoundComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashboardNotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
