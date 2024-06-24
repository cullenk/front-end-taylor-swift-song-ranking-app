import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Top13SongSlotComponent } from './top-13-song-slot.component';

describe('Top13SongSlotComponent', () => {
  let component: Top13SongSlotComponent;
  let fixture: ComponentFixture<Top13SongSlotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Top13SongSlotComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Top13SongSlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
