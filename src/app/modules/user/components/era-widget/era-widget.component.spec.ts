import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EraWidgetComponent } from './era-widget.component';

describe('EraWidgetComponent', () => {
  let component: EraWidgetComponent;
  let fixture: ComponentFixture<EraWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EraWidgetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EraWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
