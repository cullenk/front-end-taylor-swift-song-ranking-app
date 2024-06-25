import { TestBed } from '@angular/core/testing';

import { TopThirteenStateService } from './top-thirteen-state.service';

describe('TopThirteenStateService', () => {
  let service: TopThirteenStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TopThirteenStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
