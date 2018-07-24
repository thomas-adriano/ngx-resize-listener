import { TestBed, inject } from '@angular/core/testing';

import { ScrollListenerService } from './scroll-listener.service';

describe('ScrollListenerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ScrollListenerService]
    });
  });

  it('should be created', inject([ScrollListenerService], (service: ScrollListenerService) => {
    expect(service).toBeTruthy();
  }));
});
