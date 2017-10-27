import { TestBed, inject } from "@angular/core/testing";

import { FocusService } from "./focus.service";

describe("FocusService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FocusService]
    });
  });

  it("should be created", inject([FocusService], (service: FocusService) => {
    expect(service).toBeTruthy();
  }));

  it("subscription should be called on focus", inject([FocusService], (service: FocusService) => {
    const spy = jasmine.createSpy("spy");
    service.subscribe("something", spy);
    service.focus("something");
    expect(spy).toHaveBeenCalled();
  }));

  it("subscription should be called only on given id", inject([FocusService], (service: FocusService) => {
    const spy = jasmine.createSpy("spy");
    service.subscribe("something", spy);
    service.focus("something else");
    expect(spy).not.toHaveBeenCalled();
  }));

  it("an id subscribable only once", inject([FocusService], (service: FocusService) => {
    const spy = jasmine.createSpy("spy");
    service.subscribe("something", spy);
    service.subscribe("something", spy);
    service.focus("something");
    expect(spy).toHaveBeenCalledTimes(1);
  }));

  it("subscription can be destroyed", inject([FocusService], (service: FocusService) => {
    const spy = jasmine.createSpy("spy");
    const destroy = service.subscribe("something", spy);
    destroy();
    service.focus("something");
    expect(spy).not.toHaveBeenCalled();
  }));

});
