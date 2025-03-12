import { TestBed } from '@angular/core/testing';

import { WordpressIntegrationService } from './wordpress-integration.service';

describe('WordpressIntegrationService', () => {
  let service: WordpressIntegrationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WordpressIntegrationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
