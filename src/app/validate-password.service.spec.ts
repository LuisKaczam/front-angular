import { TestBed } from '@angular/core/testing';

import { ValidatePasswordService } from './validate-password.service';

describe('ValidatePasswordService', () => {
  let service: ValidatePasswordService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidatePasswordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
