import { TestBed } from '@angular/core/testing';

import { ErasBuilderRulesService } from './eras-builder-rules.service';

describe('ErasBuilderRulesService', () => {
  let service: ErasBuilderRulesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErasBuilderRulesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
