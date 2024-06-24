import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SongSlotComponent } from './song-slot.component';

describe('SongSlotComponent', () => {
  let component: SongSlotComponent;
  let fixture: ComponentFixture<SongSlotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SongSlotComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SongSlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
