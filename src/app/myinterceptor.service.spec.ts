import { TestBed } from '@angular/core/testing';

import { MyinterceptorService } from './myinterceptor.service';

describe('MyinterceptorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MyinterceptorService = TestBed.get(MyinterceptorService);
    expect(service).toBeTruthy();
  });
});
