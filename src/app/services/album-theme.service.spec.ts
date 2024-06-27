import { TestBed } from '@angular/core/testing';

import { AlbumThemeService } from './album-theme.service';

describe('AlbumThemeService', () => {
  let service: AlbumThemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlbumThemeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
