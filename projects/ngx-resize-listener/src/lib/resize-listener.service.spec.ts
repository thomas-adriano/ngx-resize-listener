import { TestBed, inject } from '@angular/core/testing';

import { ResizeListenerService } from './resize-listener.service';

describe('ResizeListenerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ResizeListenerService]
    });
  });

  it('should be created', inject([ResizeListenerService], (service: ResizeListenerService) => {
    expect(service).toBeTruthy();
  }));
});
