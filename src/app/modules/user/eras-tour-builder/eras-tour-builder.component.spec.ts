import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErasTourBuilderComponent } from './eras-tour-builder.component';

describe('ErasTourBuilderComponent', () => {
  let component: ErasTourBuilderComponent;
  let fixture: ComponentFixture<ErasTourBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErasTourBuilderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ErasTourBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
