import { TestBed } from '@angular/core/testing';

import { ModelFonctionnaliteService } from './model-fonctionnalite.service';

describe('ModelFonctionnaliteService', () => {
  let service: ModelFonctionnaliteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModelFonctionnaliteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
