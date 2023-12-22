import { TestBed } from '@angular/core/testing';

import { ModelProcessService } from './model-process.service';

describe('ModelProcessService', () => {
  let service: ModelProcessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModelProcessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
