import { TestBed } from '@angular/core/testing';

import { GestanteService } from './gestante.service';

describe('GestanteService', () => {
  let service: GestanteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GestanteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
