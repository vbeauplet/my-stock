import { TestBed } from '@angular/core/testing';

import { HouseholdStaticService } from './household.static.service';

describe('HouseholdStaticService', () => {
  let service: HouseholdStaticService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HouseholdStaticService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
