import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareSetlistComponent } from './share-set-list.component';

describe('ShareSetListComponent', () => {
  let component: ShareSetlistComponent;
  let fixture: ComponentFixture<ShareSetlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShareSetlistComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShareSetlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
