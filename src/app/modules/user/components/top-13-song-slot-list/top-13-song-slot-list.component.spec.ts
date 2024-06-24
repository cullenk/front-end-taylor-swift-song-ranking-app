import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Top13SongSlotListComponent } from './top-13-song-slot-list.component';

describe('Top13SongSlotListComponent', () => {
  let component: Top13SongSlotListComponent;
  let fixture: ComponentFixture<Top13SongSlotListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Top13SongSlotListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Top13SongSlotListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
