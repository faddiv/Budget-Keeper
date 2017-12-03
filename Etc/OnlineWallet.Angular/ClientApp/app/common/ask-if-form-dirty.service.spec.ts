import { TestBed, inject } from "@angular/core/testing";

import { AskIfFormDirtyService } from "./ask-if-form-dirty.service";

describe("AskIfFormDirtyServiceService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AskIfFormDirtyService]
    });
  });

  it("should be created", inject([AskIfFormDirtyService], (service: AskIfFormDirtyService) => {
    expect(service).toBeTruthy();
  }));
});
