import { TestBed } from '@angular/core/testing';

import { PlaceStaticService } from './place.static.service';

describe('Place.StaticService', () => {
  let service: PlaceStaticService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlaceStaticService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
