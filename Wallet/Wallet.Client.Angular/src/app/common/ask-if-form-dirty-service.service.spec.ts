import { TestBed, inject } from '@angular/core/testing';

import { AskIfFormDirtyServiceService } from './ask-if-form-dirty-service.service';

describe('AskIfFormDirtyServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AskIfFormDirtyServiceService]
    });
  });

  it('should be created', inject([AskIfFormDirtyServiceService], (service: AskIfFormDirtyServiceService) => {
    expect(service).toBeTruthy();
  }));
});
