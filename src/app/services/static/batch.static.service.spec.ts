import { TestBed } from '@angular/core/testing';

import { BatchStaticService } from './batch.static.service';

describe('Batch.StaticService', () => {
  let service: BatchStaticService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BatchStaticService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
