import { TestBed } from '@angular/core/testing';

import { TopThirteenService } from './top-thirteen.service';

describe('TopThirteenService', () => {
  let service: TopThirteenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TopThirteenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
