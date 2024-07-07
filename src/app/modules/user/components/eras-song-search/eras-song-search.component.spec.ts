import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErasSongSearchComponent } from './eras-song-search.component';

describe('ErasSongSearchComponent', () => {
  let component: ErasSongSearchComponent;
  let fixture: ComponentFixture<ErasSongSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErasSongSearchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ErasSongSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
