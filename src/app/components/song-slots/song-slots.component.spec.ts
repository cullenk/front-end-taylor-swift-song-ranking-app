import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SongSlotsComponent } from './song-slots.component';

describe('SongSlotsComponent', () => {
  let component: SongSlotsComponent;
  let fixture: ComponentFixture<SongSlotsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SongSlotsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SongSlotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
