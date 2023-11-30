import { TestBed } from '@angular/core/testing';

import { EncondingParamsService } from './enconding-params.service';

describe('EncondingParamsService', () => {
  let service: EncondingParamsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EncondingParamsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
