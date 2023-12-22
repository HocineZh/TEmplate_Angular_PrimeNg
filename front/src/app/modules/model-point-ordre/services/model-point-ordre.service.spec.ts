import { TestBed } from '@angular/core/testing';

import { ModelPointOrdreService } from './model-point-ordre.service';

describe('ModelPointOrdreService', () => {
  let service: ModelPointOrdreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModelPointOrdreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
